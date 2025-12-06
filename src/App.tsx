// EdoriFile Explorer - Main Application
// Refactored with SOLID principles using Zustand for state management

import { useState, useEffect } from 'react';
import './App.css';

// Stores
import { useAppStore, useTabStore, useClipboardStore } from '@store';

// Hooks
import { useFileOperations, useKeyboardShortcuts, useContextMenu, type DialogType } from '@hooks';

// Components - organized by category
import {
  TabBar,
  Sidebar,
  Toolbar,
  FileGrid,
  FileList,
  InputDialog,
  ConfirmDialog,
  PropertiesDialog
} from '@components';

function App() {
  // Dialog state (local since it's UI-only)
  const [dialog, setDialog] = useState<DialogType>(null);

  // App store
  const { drives, quickAccess, viewMode, setViewMode, initialize } = useAppStore();

  // Tab store
  const {
    tabs,
    activeTabId,
    setActiveTab,
    addTab,
    closeTab,
    getCurrentState,
    getCurrentFiles,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    navigateTo,
    searchFiles,
    refresh,
    initializeFirstTab,
  } = useTabStore();

  // Clipboard store
  const clipboard = useClipboardStore((s) => s.clipboard);

  // Custom hooks
  const {
    handleCopy,
    handleCut,
    handlePaste,
    handleNewFolder,
    handleRename,
    handleDelete,
    handleSelect,
    handleOpen,
    goUp,
  } = useFileOperations();

  const { handleContextMenu, handleBackgroundContextMenu } = useContextMenu({ setDialog });

  useKeyboardShortcuts({
    dialog,
    setDialog,
    onNewTab: () => addTab(getCurrentState().path),
    onCloseTab: () => closeTab(activeTabId),
  });

  // Get current state
  const currentState = getCurrentState();
  const currentFiles = getCurrentFiles();

  // Initialize app
  useEffect(() => {
    const init = async () => {
      await initialize();

      // Initialize first tab with user folder
      const qa = useAppStore.getState().quickAccess;
      if (qa.length > 0) {
        const userPath = qa[0].path
          .replace('\\Desktop', '')
          .replace('\\Downloads', '')
          .replace('\\Documents', '');
        initializeFirstTab(userPath);
      } else {
        initializeFirstTab('C:\\');
      }
    };
    init();
  }, []);

  // Get selected file from current files
  const selectedFile = currentFiles.find(f => f.path === currentState.selectedPath) || null;

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-base)]">
      {/* Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        onNewTab={() => addTab(currentState.path)}
      />

      {/* Toolbar */}
      <Toolbar
        currentPath={currentState.path}
        canGoBack={canGoBack()}
        canGoForward={canGoForward()}
        viewMode={viewMode}
        searchQuery={currentState.searchQuery}
        hasSelection={!!currentState.selectedPath}
        hasClipboard={!!clipboard}
        onBack={goBack}
        onForward={goForward}
        onUp={goUp}
        onRefresh={refresh}
        onNavigate={navigateTo}
        onViewModeChange={setViewMode}
        onSearchChange={searchFiles}
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
                onClick={() => useTabStore.getState().updateTabState(activeTabId, { error: null })}
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
              files={currentFiles}
              selectedPath={currentState.selectedPath}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onContextMenu={handleContextMenu}
            />
          ) : (
            <FileList
              files={currentFiles}
              selectedPath={currentState.selectedPath}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onContextMenu={handleContextMenu}
            />
          )}

          {/* Status bar */}
          <footer className="h-6 flex items-center px-4 bg-[var(--color-bg-base)] border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)]">
            <span>{currentFiles.length} items</span>
            {selectedFile && (
              <>
                <span className="mx-2">|</span>
                <span className="truncate">{selectedFile.name}</span>
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

      {/* Dialogs */}
      {dialog === 'newFolder' && (
        <InputDialog
          title="New Folder"
          placeholder="Folder name"
          confirmLabel="Create"
          onConfirm={(name) => {
            handleNewFolder(name);
            setDialog(null);
          }}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === 'rename' && selectedFile && (
        <InputDialog
          title="Rename"
          initialValue={selectedFile.name}
          confirmLabel="Rename"
          onConfirm={(newName) => {
            handleRename(newName);
            setDialog(null);
          }}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === 'delete' && selectedFile && (
        <ConfirmDialog
          title="Delete"
          message={`Are you sure you want to delete "${selectedFile.name}"?`}
          confirmLabel="Delete"
          confirmDanger
          onConfirm={() => {
            handleDelete();
            setDialog(null);
          }}
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog === 'properties' && selectedFile && (
        <PropertiesDialog
          file={selectedFile}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}

export default App;
