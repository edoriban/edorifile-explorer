import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-shell';
import './App.css';

import { FileEntry, DriveInfo, ViewMode } from './types';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { FileGrid } from './components/FileGrid';
import { FileList } from './components/FileList';

function App() {
  // State
  const [currentPath, setCurrentPath] = useState<string>('C:\\');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [drives, setDrives] = useState<DriveInfo[]>([]);
  const [quickAccess, setQuickAccess] = useState<FileEntry[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Navigation history
  const [history, setHistory] = useState<string[]>(['C:\\']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Load drives and quick access on mount
  useEffect(() => {
    const init = async () => {
      try {
        const [drivesData, quickAccessData] = await Promise.all([
          invoke<DriveInfo[]>('get_drives'),
          invoke<FileEntry[]>('get_quick_access'),
        ]);
        setDrives(drivesData);
        setQuickAccess(quickAccessData);

        // Start in user's home directory if available
        if (quickAccessData.length > 0) {
          const desktopFolder = quickAccessData.find(f => f.name === 'Desktop');
          if (desktopFolder) {
            navigateTo(desktopFolder.path, true);
          }
        }
      } catch (err) {
        console.error('Failed to initialize:', err);
      }
    };
    init();
  }, []);

  // Load directory contents
  const loadDirectory = useCallback(async (path: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const entries = await invoke<FileEntry[]>('read_directory', { path });
      setFiles(entries);
      setSelectedPath(null);
    } catch (err) {
      setError(String(err));
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Navigate to a path (with history)
  const navigateTo = useCallback((path: string, replaceHistory = false) => {
    setCurrentPath(path);
    setSearchQuery('');
    setIsSearching(false);

    if (replaceHistory) {
      setHistory([path]);
      setHistoryIndex(0);
    } else {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(path);
        return newHistory;
      });
      setHistoryIndex(prev => prev + 1);
    }

    loadDirectory(path);
  }, [historyIndex, loadDirectory]);

  // Navigation controls
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const goBack = useCallback(() => {
    if (canGoBack) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const path = history[newIndex];
      setCurrentPath(path);
      loadDirectory(path);
    }
  }, [canGoBack, historyIndex, history, loadDirectory]);

  const goForward = useCallback(() => {
    if (canGoForward) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const path = history[newIndex];
      setCurrentPath(path);
      loadDirectory(path);
    }
  }, [canGoForward, historyIndex, history, loadDirectory]);

  const goUp = useCallback(async () => {
    try {
      const parent = await invoke<string | null>('get_parent_directory', { path: currentPath });
      if (parent) {
        navigateTo(parent);
      }
    } catch (err) {
      console.error('Failed to get parent:', err);
    }
  }, [currentPath, navigateTo]);

  const refresh = useCallback(() => {
    if (isSearching && searchQuery) {
      handleSearch(searchQuery);
    } else {
      loadDirectory(currentPath);
    }
  }, [currentPath, isSearching, searchQuery, loadDirectory]);

  // Search
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setIsSearching(false);
      loadDirectory(currentPath);
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    setError(null);

    try {
      const results = await invoke<FileEntry[]>('search_files', {
        path: currentPath,
        query: query.trim(),
        maxResults: 100,
      });
      setFiles(results);
    } catch (err) {
      setError(String(err));
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPath, loadDirectory]);

  // File actions
  const handleSelect = useCallback((file: FileEntry) => {
    setSelectedPath(file.path);
  }, []);

  const handleOpen = useCallback(async (file: FileEntry) => {
    if (file.is_dir) {
      navigateTo(file.path);
    } else {
      // Open file with default application
      try {
        await open(file.path);
      } catch (err) {
        console.error('Failed to open file:', err);
      }
    }
  }, [navigateTo]);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-primary)]">
      {/* Toolbar */}
      <Toolbar
        currentPath={currentPath}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        viewMode={viewMode}
        searchQuery={searchQuery}
        onBack={goBack}
        onForward={goForward}
        onUp={goUp}
        onRefresh={refresh}
        onNavigate={navigateTo}
        onViewModeChange={setViewMode}
        onSearchChange={handleSearch}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          drives={drives}
          quickAccess={quickAccess}
          currentPath={currentPath}
          onNavigate={navigateTo}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[var(--color-bg-primary)]">
          {/* Search indicator */}
          {isSearching && (
            <div className="px-4 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]">
              Searching for "{searchQuery}" in {currentPath}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-primary)]/50 z-10">
              <div className="text-[var(--color-text-secondary)]">Loading...</div>
            </div>
          )}

          {/* File display */}
          {viewMode === 'grid' ? (
            <FileGrid
              files={files}
              selectedPath={selectedPath}
              onSelect={handleSelect}
              onOpen={handleOpen}
            />
          ) : (
            <FileList
              files={files}
              selectedPath={selectedPath}
              onSelect={handleSelect}
              onOpen={handleOpen}
            />
          )}

          {/* Status bar */}
          <footer className="h-7 flex items-center px-4 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
            <span>{files.length} items</span>
            {selectedPath && (
              <span className="ml-4 truncate">
                Selected: {selectedPath}
              </span>
            )}
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
