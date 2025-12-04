import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-shell';
import './App.css';

import { FileEntry, DriveInfo, ViewMode } from './types';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { FileGrid } from './components/FileGrid';
import { FileList } from './components/FileList';
import { ContextMenu } from './components/ContextMenu';
import { InputDialog, ConfirmDialog } from './components/Dialog';

// Clipboard state for copy/cut operations
interface ClipboardState {
  items: FileEntry[];
  operation: 'copy' | 'cut';
}

// Dialog state
type DialogType = 'newFolder' | 'rename' | 'delete' | null;

function App() {
  // Core state
  const [currentPath, setCurrentPath] = useState<string>('C:\\');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [drives, setDrives] = useState<DriveInfo[]>([]);
  const [quickAccess, setQuickAccess] = useState<FileEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Navigation history
  const [history, setHistory] = useState<string[]>(['C:\\']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Clipboard
  const [clipboard, setClipboard] = useState<ClipboardState | null>(null);

  // Context menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: FileEntry | null } | null>(null);

  // Dialogs
  const [dialog, setDialog] = useState<DialogType>(null);

  // Initialize
  useEffect(() => {
    const init = async () => {
      try {
        const [drivesData, quickAccessData] = await Promise.all([
          invoke<DriveInfo[]>('get_drives'),
          invoke<FileEntry[]>('get_quick_access'),
        ]);
        setDrives(drivesData);
        setQuickAccess(quickAccessData);

        // Start in user profile
        if (quickAccessData.length > 0) {
          const firstFolder = quickAccessData[0];
          if (firstFolder) {
            // Go to parent of Desktop (user folder)
            const userPath = firstFolder.path.replace('\\Desktop', '');
            navigateTo(userPath, true);
          }
        }
      } catch (err) {
        console.error('Failed to initialize:', err);
        loadDirectory('C:\\');
      }
    };
    init();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if dialog is open
      if (dialog) return;

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'c':
            if (selectedFile) handleCopy();
            break;
          case 'x':
            if (selectedFile) handleCut();
            break;
          case 'v':
            if (clipboard) handlePaste();
            break;
          case 'n':
            if (e.shiftKey) {
              e.preventDefault();
              setDialog('newFolder');
            }
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
            if (selectedFile) setDialog('delete');
            break;
          case 'F2':
            if (selectedFile) setDialog('rename');
            break;
          case 'F5':
            refresh();
            break;
          case 'Backspace':
            goUp();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFile, clipboard, dialog]);

  // Load directory
  const loadDirectory = useCallback(async (path: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const entries = await invoke<FileEntry[]>('read_directory', { path });
      setFiles(entries);
      setSelectedFile(null);
    } catch (err) {
      setError(String(err));
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Navigate to path
  const navigateTo = useCallback((path: string, replaceHistory = false) => {
    setCurrentPath(path);
    setSearchQuery('');
    setIsSearching(false);
    setContextMenu(null);

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

  // Navigation
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
      if (parent && parent !== currentPath) {
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

  // File selection
  const handleSelect = useCallback((file: FileEntry) => {
    setSelectedFile(file);
  }, []);

  const handleOpen = useCallback(async (file: FileEntry) => {
    if (file.is_dir) {
      navigateTo(file.path);
    } else {
      try {
        await open(file.path);
      } catch (err) {
        console.error('Failed to open file:', err);
        setError(`Failed to open: ${err}`);
      }
    }
  }, [navigateTo]);

  // Context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, file: FileEntry) => {
    e.preventDefault();
    setSelectedFile(file);
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  }, []);

  const handleBackgroundContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file: null });
  }, []);

  // File operations
  const handleCopy = useCallback(() => {
    if (selectedFile) {
      setClipboard({ items: [selectedFile], operation: 'copy' });
    }
  }, [selectedFile]);

  const handleCut = useCallback(() => {
    if (selectedFile) {
      setClipboard({ items: [selectedFile], operation: 'cut' });
    }
  }, [selectedFile]);

  const handlePaste = useCallback(async () => {
    if (!clipboard) return;

    try {
      for (const item of clipboard.items) {
        if (clipboard.operation === 'copy') {
          await invoke('copy_item', { source: item.path, destination: currentPath });
        } else {
          await invoke('move_item', { source: item.path, destination: currentPath });
        }
      }

      if (clipboard.operation === 'cut') {
        setClipboard(null);
      }

      refresh();
    } catch (err) {
      setError(String(err));
    }
  }, [clipboard, currentPath, refresh]);

  const handleNewFolder = useCallback(async (name: string) => {
    try {
      await invoke('create_folder', { path: currentPath, name });
      refresh();
      setDialog(null);
    } catch (err) {
      setError(String(err));
    }
  }, [currentPath, refresh]);

  const handleRename = useCallback(async (newName: string) => {
    if (!selectedFile) return;

    try {
      await invoke('rename_item', { oldPath: selectedFile.path, newName });
      refresh();
      setDialog(null);
      setSelectedFile(null);
    } catch (err) {
      setError(String(err));
    }
  }, [selectedFile, refresh]);

  const handleDelete = useCallback(async () => {
    if (!selectedFile) return;

    try {
      await invoke('delete_item', { path: selectedFile.path });
      refresh();
      setDialog(null);
      setSelectedFile(null);
    } catch (err) {
      setError(String(err));
    }
  }, [selectedFile, refresh]);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-mica)]">
      {/* Toolbar */}
      <Toolbar
        currentPath={currentPath}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        viewMode={viewMode}
        searchQuery={searchQuery}
        hasSelection={!!selectedFile}
        hasClipboard={!!clipboard}
        onBack={goBack}
        onForward={goForward}
        onUp={goUp}
        onRefresh={refresh}
        onNavigate={navigateTo}
        onViewModeChange={setViewMode}
        onSearchChange={handleSearch}
        onNewFolder={() => setDialog('newFolder')}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onRename={() => setDialog('rename')}
        onDelete={() => setDialog('delete')}
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
        <main
          className="flex-1 flex flex-col overflow-hidden"
          onContextMenu={handleBackgroundContextMenu}
        >
          {/* Search indicator */}
          {isSearching && (
            <div className="px-4 py-2 bg-[var(--color-bg-card)] border-b border-[var(--color-divider)] text-[13px] text-[var(--color-text-secondary)]">
              Search results for "{searchQuery}" in {currentPath}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20 text-red-400 text-[13px] flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="hover:text-red-300">✕</button>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-mica)]/80 z-10">
              <div className="text-[var(--color-text-secondary)]">Loading...</div>
            </div>
          )}

          {/* File view */}
          {viewMode === 'grid' ? (
            <FileGrid
              files={files}
              selectedPath={selectedFile?.path || null}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onContextMenu={handleContextMenu}
            />
          ) : (
            <FileList
              files={files}
              selectedPath={selectedFile?.path || null}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onContextMenu={handleContextMenu}
            />
          )}

          {/* Status bar */}
          <footer className="h-6 flex items-center px-4 bg-[var(--color-bg-card)] border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)]">
            <span>{files.length} items</span>
            {selectedFile && (
              <span className="ml-4 truncate">
                {selectedFile.name}
              </span>
            )}
          </footer>
        </main>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          hasSelection={!!selectedFile}
          hasClipboard={!!clipboard}
          isOnFile={!!contextMenu.file}
          onClose={() => setContextMenu(null)}
          onNewFolder={() => { setContextMenu(null); setDialog('newFolder'); }}
          onCut={() => { handleCut(); setContextMenu(null); }}
          onCopy={() => { handleCopy(); setContextMenu(null); }}
          onPaste={() => { handlePaste(); setContextMenu(null); }}
          onRename={() => { setContextMenu(null); setDialog('rename'); }}
          onDelete={() => { setContextMenu(null); setDialog('delete'); }}
          onOpen={() => { if (selectedFile) handleOpen(selectedFile); setContextMenu(null); }}
        />
      )}

      {/* Dialogs */}
      {dialog === 'newFolder' && (
        <InputDialog
          title="New folder"
          placeholder="Folder name"
          confirmLabel="Create"
          onConfirm={handleNewFolder}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === 'rename' && selectedFile && (
        <InputDialog
          title="Rename"
          initialValue={selectedFile.name}
          confirmLabel="Rename"
          onConfirm={handleRename}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === 'delete' && selectedFile && (
        <ConfirmDialog
          title="Delete"
          message={`Are you sure you want to delete "${selectedFile.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          confirmDanger
          onConfirm={handleDelete}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
}

export default App;
