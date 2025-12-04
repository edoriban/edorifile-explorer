import { useState, useEffect, useCallback, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { openPath } from '@tauri-apps/plugin-opener';
import './App.css';

import { FileEntry, DriveInfo, ViewMode } from './types';
import { TabBar, Tab } from './components/TabBar';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { FileGrid } from './components/FileGrid';
import { FileList } from './components/FileList';
import { InputDialog, ConfirmDialog } from './components/Dialog';
import { PropertiesDialog } from './components/PropertiesDialog';

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Tab state
interface TabState {
  path: string;
  title: string;
  history: string[];
  historyIndex: number;
  files: FileEntry[];
  selectedFile: FileEntry | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  isSearching: boolean;
}

// Clipboard
interface ClipboardState {
  items: FileEntry[];
  operation: 'copy' | 'cut';
}

type DialogType = 'newFolder' | 'rename' | 'delete' | 'properties' | null;

function App() {
  // Global state
  const [drives, setDrives] = useState<DriveInfo[]>([]);
  const [quickAccess, setQuickAccess] = useState<FileEntry[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [clipboard, setClipboard] = useState<ClipboardState | null>(null);

  // Tabs
  const [tabs, setTabs] = useState<Tab[]>([{ id: generateId(), path: 'C:\\', title: 'C:' }]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const [tabStates, setTabStates] = useState<Record<string, TabState>>({});

  // UI
  const [dialog, setDialog] = useState<DialogType>(null);

  // Get current tab state
  const currentState = tabStates[activeTabId] || {
    path: 'C:\\',
    title: 'C:',
    history: ['C:\\'],
    historyIndex: 0,
    files: [],
    selectedFile: null,
    isLoading: false,
    error: null,
    searchQuery: '',
    isSearching: false,
  };

  // Update tab state helper
  const updateTabState = useCallback((tabId: string, updates: Partial<TabState>) => {
    setTabStates(prev => ({
      ...prev,
      [tabId]: { ...prev[tabId], ...updates }
    }));
  }, []);

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

        // Initialize first tab with user folder
        if (quickAccessData.length > 0) {
          const userPath = quickAccessData[0].path.replace('\\Desktop', '').replace('\\Downloads', '').replace('\\Documents', '');
          const initialState: TabState = {
            path: userPath,
            title: userPath.split('\\').filter(Boolean).pop() || 'Home',
            history: [userPath],
            historyIndex: 0,
            files: [],
            selectedFile: null,
            isLoading: false,
            error: null,
            searchQuery: '',
            isSearching: false,
          };

          setTabStates({ [tabs[0].id]: initialState });
          setTabs([{ id: tabs[0].id, path: userPath, title: initialState.title }]);
          loadDirectoryForTab(tabs[0].id, userPath);
        }
      } catch (err) {
        console.error('Failed to initialize:', err);
      }
    };
    init();
  }, []);


  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (dialog) return;

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'c':
            if (currentState.selectedFile) handleCopy();
            break;
          case 'x':
            if (currentState.selectedFile) handleCut();
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
          case 't':
            e.preventDefault();
            handleNewTab();
            break;
          case 'w':
            e.preventDefault();
            if (tabs.length > 1) handleCloseTab(activeTabId);
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
            if (currentState.selectedFile) setDialog('delete');
            break;
          case 'F2':
            if (currentState.selectedFile) setDialog('rename');
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
  }, [currentState.selectedFile, clipboard, dialog, tabs, activeTabId]);

  // Load directory for a specific tab
  const loadDirectoryForTab = useCallback(async (tabId: string, path: string) => {
    updateTabState(tabId, { isLoading: true, error: null });
    try {
      const entries = await invoke<FileEntry[]>('read_directory', { path });
      updateTabState(tabId, { files: entries, selectedFile: null, isLoading: false });
    } catch (err) {
      updateTabState(tabId, { error: String(err), files: [], isLoading: false });
    }
  }, [updateTabState]);

  // Navigate for current tab
  const navigateTo = useCallback((path: string, replaceHistory = false) => {
    const title = path.split('\\').filter(Boolean).pop() || path;

    // Update tab
    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, path, title } : t
    ));

    // Update tab state
    setTabStates(prev => {
      const current = prev[activeTabId] || { history: [], historyIndex: 0 };
      let newHistory: string[];
      let newHistoryIndex: number;

      if (replaceHistory) {
        newHistory = [path];
        newHistoryIndex = 0;
      } else {
        newHistory = current.history.slice(0, current.historyIndex + 1);
        newHistory.push(path);
        newHistoryIndex = newHistory.length - 1;
      }

      return {
        ...prev,
        [activeTabId]: {
          ...prev[activeTabId],
          path,
          title,
          history: newHistory,
          historyIndex: newHistoryIndex,
          searchQuery: '',
          isSearching: false,
        }
      };
    });

    loadDirectoryForTab(activeTabId, path);
  }, [activeTabId, loadDirectoryForTab]);

  // Navigation
  const canGoBack = currentState.historyIndex > 0;
  const canGoForward = currentState.historyIndex < (currentState.history?.length || 1) - 1;

  const goBack = useCallback(() => {
    if (canGoBack) {
      const newIndex = currentState.historyIndex - 1;
      const path = currentState.history[newIndex];
      updateTabState(activeTabId, { historyIndex: newIndex, path });
      setTabs(prev => prev.map(t =>
        t.id === activeTabId ? { ...t, path, title: path.split('\\').filter(Boolean).pop() || path } : t
      ));
      loadDirectoryForTab(activeTabId, path);
    }
  }, [canGoBack, currentState, activeTabId, loadDirectoryForTab, updateTabState]);

  const goForward = useCallback(() => {
    if (canGoForward) {
      const newIndex = currentState.historyIndex + 1;
      const path = currentState.history[newIndex];
      updateTabState(activeTabId, { historyIndex: newIndex, path });
      setTabs(prev => prev.map(t =>
        t.id === activeTabId ? { ...t, path, title: path.split('\\').filter(Boolean).pop() || path } : t
      ));
      loadDirectoryForTab(activeTabId, path);
    }
  }, [canGoForward, currentState, activeTabId, loadDirectoryForTab, updateTabState]);

  const goUp = useCallback(async () => {
    try {
      const parent = await invoke<string | null>('get_parent_directory', { path: currentState.path });
      if (parent && parent !== currentState.path) {
        navigateTo(parent);
      }
    } catch (err) {
      console.error('Failed to get parent:', err);
    }
  }, [currentState.path, navigateTo]);

  const refresh = useCallback(() => {
    if (currentState.isSearching && currentState.searchQuery) {
      handleSearch(currentState.searchQuery);
    } else {
      loadDirectoryForTab(activeTabId, currentState.path);
    }
  }, [activeTabId, currentState, loadDirectoryForTab]);

  // Search
  const handleSearch = useCallback(async (query: string) => {
    updateTabState(activeTabId, { searchQuery: query });

    if (!query.trim()) {
      updateTabState(activeTabId, { isSearching: false });
      loadDirectoryForTab(activeTabId, currentState.path);
      return;
    }

    updateTabState(activeTabId, { isSearching: true, isLoading: true, error: null });

    try {
      const results = await invoke<FileEntry[]>('search_files', {
        path: currentState.path,
        query: query.trim(),
        maxResults: 100,
      });
      updateTabState(activeTabId, { files: results, isLoading: false });
    } catch (err) {
      updateTabState(activeTabId, { error: String(err), files: [], isLoading: false });
    }
  }, [activeTabId, currentState.path, loadDirectoryForTab, updateTabState]);

  // Tab management
  const handleNewTab = useCallback(() => {
    const id = generateId();
    const path = currentState.path;
    const title = path.split('\\').filter(Boolean).pop() || path;

    setTabs(prev => [...prev, { id, path, title }]);
    setTabStates(prev => ({
      ...prev,
      [id]: {
        path,
        title,
        history: [path],
        historyIndex: 0,
        files: currentState.files,
        selectedFile: null,
        isLoading: false,
        error: null,
        searchQuery: '',
        isSearching: false,
      }
    }));
    setActiveTabId(id);
  }, [currentState]);

  const handleCloseTab = useCallback((tabId: string) => {
    if (tabs.length <= 1) return;

    const index = tabs.findIndex(t => t.id === tabId);
    const newTabs = tabs.filter(t => t.id !== tabId);

    if (tabId === activeTabId) {
      const newActiveIndex = Math.min(index, newTabs.length - 1);
      setActiveTabId(newTabs[newActiveIndex].id);
    }

    setTabs(newTabs);
    setTabStates(prev => {
      const { [tabId]: _, ...rest } = prev;
      return rest;
    });
  }, [tabs, activeTabId]);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  // File actions
  const handleSelect = useCallback((file: FileEntry) => {
    updateTabState(activeTabId, { selectedFile: file });
  }, [activeTabId, updateTabState]);

  const handleOpen = useCallback(async (file: FileEntry) => {
    if (file.is_dir) {
      navigateTo(file.path);
    } else {
      try {
        await openPath(file.path);
      } catch (err) {
        console.error('Failed to open file:', err);
        updateTabState(activeTabId, { error: `Failed to open: ${err}` });
      }
    }
  }, [navigateTo, activeTabId, updateTabState]);

  // Context menu - keep reference to selected file for menu actions
  const contextFileRef = useRef<FileEntry | null>(null);

  const handleContextMenu = useCallback(async (e: React.MouseEvent, file: FileEntry) => {
    e.preventDefault();
    e.stopPropagation();
    updateTabState(activeTabId, { selectedFile: file });
    contextFileRef.current = file;

    // Call native Tauri context menu
    try {
      await invoke('show_context_menu', {
        x: e.clientX,
        y: e.clientY,
        filePath: file.path,
        isFile: !file.is_dir,
        hasClipboard: !!clipboard,
      });
    } catch (err) {
      console.error('Failed to show context menu:', err);
    }
  }, [activeTabId, updateTabState, clipboard]);

  const handleBackgroundContextMenu = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    contextFileRef.current = null;

    // Call native Tauri context menu for background
    try {
      await invoke('show_context_menu', {
        x: e.clientX,
        y: e.clientY,
        filePath: null,
        isFile: false,
        hasClipboard: !!clipboard,
      });
    } catch (err) {
      console.error('Failed to show context menu:', err);
    }
  }, [clipboard]);

  // File operations
  const handleCopy = useCallback(() => {
    if (currentState.selectedFile) {
      setClipboard({ items: [currentState.selectedFile], operation: 'copy' });
    }
  }, [currentState.selectedFile]);

  const handleCut = useCallback(() => {
    if (currentState.selectedFile) {
      setClipboard({ items: [currentState.selectedFile], operation: 'cut' });
    }
  }, [currentState.selectedFile]);

  const handlePaste = useCallback(async () => {
    if (!clipboard) return;

    try {
      for (const item of clipboard.items) {
        if (clipboard.operation === 'copy') {
          await invoke('copy_item', { source: item.path, destination: currentState.path });
        } else {
          await invoke('move_item', { source: item.path, destination: currentState.path });
        }
      }

      if (clipboard.operation === 'cut') {
        setClipboard(null);
      }

      refresh();
    } catch (err) {
      updateTabState(activeTabId, { error: String(err) });
    }
  }, [clipboard, currentState.path, refresh, activeTabId, updateTabState]);

  const handleNewFolder = useCallback(async (name: string) => {
    try {
      await invoke('create_folder', { path: currentState.path, name });
      refresh();
      setDialog(null);
    } catch (err) {
      updateTabState(activeTabId, { error: String(err) });
    }
  }, [currentState.path, refresh, activeTabId, updateTabState]);

  const handleRename = useCallback(async (newName: string) => {
    if (!currentState.selectedFile) return;

    try {
      await invoke('rename_item', { oldPath: currentState.selectedFile.path, newName });
      refresh();
      setDialog(null);
      updateTabState(activeTabId, { selectedFile: null });
    } catch (err) {
      updateTabState(activeTabId, { error: String(err) });
    }
  }, [currentState.selectedFile, refresh, activeTabId, updateTabState]);

  const handleDelete = useCallback(async () => {
    if (!currentState.selectedFile) return;

    try {
      await invoke('delete_item', { path: currentState.selectedFile.path });
      refresh();
      setDialog(null);
      updateTabState(activeTabId, { selectedFile: null });
    } catch (err) {
      updateTabState(activeTabId, { error: String(err) });
    }
  }, [currentState.selectedFile, refresh, activeTabId, updateTabState]);

  // Listen for native context menu actions from Tauri
  useEffect(() => {
    let unlistenFn: (() => void) | null = null;

    listen<string>('context-menu-action', async (event) => {
      const action = event.payload;
      const file = contextFileRef.current;

      console.log('[ContextMenu] Action received:', action, 'File:', file?.name);

      switch (action) {
        case 'open':
          console.log('[ContextMenu] Opening file:', file?.path);
          if (file) handleOpen(file);
          break;
        case 'cut':
          if (file) handleCut();
          break;
        case 'copy':
          if (file) handleCopy();
          break;
        case 'paste':
          handlePaste();
          break;
        case 'new_folder':
          setDialog('newFolder');
          break;
        case 'rename':
          if (file) setDialog('rename');
          break;
        case 'delete':
          if (file) setDialog('delete');
          break;
        case 'open_terminal':
          try {
            await invoke('open_in_terminal', { path: file?.is_dir ? file.path : currentState.path });
          } catch (err) {
            console.error('Failed to open terminal:', err);
          }
          break;
        case 'properties':
          if (file) {
            try {
              await invoke('show_native_properties', { path: file.path });
            } catch (err) {
              console.error('Failed to show properties:', err);
            }
          }
          break;
      }
    }).then(fn => { unlistenFn = fn; });

    return () => { if (unlistenFn) unlistenFn(); };
  }, [handleOpen, handleCut, handleCopy, handlePaste, currentState.path]);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-base)]">
      {/* Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={handleTabClick}
        onTabClose={handleCloseTab}
        onNewTab={handleNewTab}
      />

      {/* Toolbar */}
      <Toolbar
        currentPath={currentState.path}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        viewMode={viewMode}
        searchQuery={currentState.searchQuery}
        hasSelection={!!currentState.selectedFile}
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
          currentPath={currentState.path}
          onNavigate={navigateTo}
        />

        {/* Main content */}
        <main
          className="flex-1 flex flex-col overflow-hidden file-area"
          onContextMenu={handleBackgroundContextMenu}
        >
          {/* Search indicator */}
          {currentState.isSearching && (
            <div className="px-4 py-2 bg-[var(--color-bg-elevated)] border-b border-[var(--color-divider)] text-[12px] text-[var(--color-text-secondary)]">
              Search results for "<span className="text-[var(--color-accent)]">{currentState.searchQuery}</span>"
            </div>
          )}

          {/* Error */}
          {currentState.error && (
            <div className="px-4 py-2 bg-[rgba(248,81,73,0.1)] border-b border-[var(--color-danger)]/20 text-[var(--color-danger)] text-[12px] flex items-center justify-between">
              <span>{currentState.error}</span>
              <button
                onClick={() => updateTabState(activeTabId, { error: null })}
                className="hover:opacity-70"
              >
                ✕
              </button>
            </div>
          )}

          {/* Loading */}
          {currentState.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-surface)]/80 z-10">
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            </div>
          )}

          {/* Files */}
          {viewMode === 'grid' ? (
            <FileGrid
              files={currentState.files}
              selectedPath={currentState.selectedFile?.path || null}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onContextMenu={handleContextMenu}
            />
          ) : (
            <FileList
              files={currentState.files}
              selectedPath={currentState.selectedFile?.path || null}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onContextMenu={handleContextMenu}
            />
          )}

          {/* Status bar */}
          <footer className="h-6 flex items-center px-4 bg-[var(--color-bg-base)] border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)]">
            <span>{currentState.files.length} items</span>
            {currentState.selectedFile && (
              <>
                <span className="mx-2">|</span>
                <span className="truncate">{currentState.selectedFile.name}</span>
              </>
            )}
            {clipboard && (
              <>
                <span className="flex-1" />
                <span className="text-[var(--color-accent)]">
                  {clipboard.operation === 'copy' ? 'Copied' : 'Cut'}: {clipboard.items.length} item(s)
                </span>
              </>
            )}
          </footer>
        </main>
      </div>

      {/* Native context menu is handled via invoke('show_context_menu') */}

      {/* Dialogs */}
      {dialog === 'newFolder' && (
        <InputDialog
          title="New Folder"
          placeholder="Folder name"
          confirmLabel="Create"
          onConfirm={handleNewFolder}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === 'rename' && currentState.selectedFile && (
        <InputDialog
          title="Rename"
          initialValue={currentState.selectedFile.name}
          confirmLabel="Rename"
          onConfirm={handleRename}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === 'delete' && currentState.selectedFile && (
        <ConfirmDialog
          title="Delete"
          message={`Are you sure you want to delete "${currentState.selectedFile.name}"?`}
          confirmLabel="Delete"
          confirmDanger
          onConfirm={handleDelete}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === 'properties' && currentState.selectedFile && (
        <PropertiesDialog
          file={currentState.selectedFile}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}

export default App;
