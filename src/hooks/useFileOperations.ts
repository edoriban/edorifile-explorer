// Hook for file operations
// Encapsulates copy, cut, paste, create folder, rename, delete operations

import { useCallback } from 'react';
import { fileService, systemService } from '../services';
import { useTabStore, useClipboardStore } from '../store';
import type { FileEntry } from '../types';

export type DialogType = 'newFolder' | 'rename' | 'delete' | 'properties' | null;

interface FileOperationsReturn {
    handleCopy: () => void;
    handleCut: () => void;
    handlePaste: () => Promise<void>;
    handleNewFolder: (name: string) => Promise<void>;
    handleRename: (newName: string) => Promise<void>;
    handleDelete: () => Promise<void>;
    handleSelect: (file: FileEntry) => void;
    handleOpen: (file: FileEntry) => Promise<void>;
    goUp: () => Promise<void>;
}

export function useFileOperations(): FileOperationsReturn {
    const { activeTabId, setSelectedPath, updateTabState, navigateTo } = useTabStore();
    const { copy, cut, clear } = useClipboardStore();

    const handleCopy = useCallback(() => {
        const currentState = useTabStore.getState().getCurrentState();
        const files = useTabStore.getState().getCurrentFiles();
        const selectedFile = files.find(f => f.path === currentState.selectedPath);
        if (selectedFile) {
            copy([selectedFile]);
        }
    }, [copy]);

    const handleCut = useCallback(() => {
        const currentState = useTabStore.getState().getCurrentState();
        const files = useTabStore.getState().getCurrentFiles();
        const selectedFile = files.find(f => f.path === currentState.selectedPath);
        if (selectedFile) {
            cut([selectedFile]);
        }
    }, [cut]);

    const handlePaste = useCallback(async () => {
        const currentState = useTabStore.getState().getCurrentState();
        const clipboardState = useClipboardStore.getState().clipboard;
        if (!clipboardState) return;

        try {
            for (const item of clipboardState.items) {
                if (clipboardState.operation === 'copy') {
                    await fileService.copyItem(item.path, currentState.path);
                } else {
                    await fileService.moveItem(item.path, currentState.path);
                }
            }

            if (clipboardState.operation === 'cut') {
                clear();
            }

            useTabStore.getState().refresh();
        } catch (error) {
            updateTabState(activeTabId, { error: String(error) });
        }
    }, [activeTabId, clear, updateTabState]);

    const handleNewFolder = useCallback(async (name: string) => {
        const currentState = useTabStore.getState().getCurrentState();
        try {
            await fileService.createFolder(currentState.path, name);
            useTabStore.getState().refresh();
        } catch (error) {
            updateTabState(activeTabId, { error: String(error) });
        }
    }, [activeTabId, updateTabState]);

    const handleRename = useCallback(async (newName: string) => {
        const currentState = useTabStore.getState().getCurrentState();
        const files = useTabStore.getState().getCurrentFiles();
        const selectedFile = files.find(f => f.path === currentState.selectedPath);
        if (!selectedFile) return;

        try {
            await fileService.renameItem(selectedFile.path, newName);
            useTabStore.getState().refresh();
            setSelectedPath(activeTabId, null);
        } catch (error) {
            updateTabState(activeTabId, { error: String(error) });
        }
    }, [activeTabId, setSelectedPath, updateTabState]);

    const handleDelete = useCallback(async () => {
        const currentState = useTabStore.getState().getCurrentState();
        const files = useTabStore.getState().getCurrentFiles();
        const selectedFile = files.find(f => f.path === currentState.selectedPath);
        if (!selectedFile) return;

        try {
            await fileService.deleteItem(selectedFile.path);
            useTabStore.getState().refresh();
            setSelectedPath(activeTabId, null);
        } catch (error) {
            updateTabState(activeTabId, { error: String(error) });
        }
    }, [activeTabId, setSelectedPath, updateTabState]);

    const handleSelect = useCallback((file: FileEntry) => {
        setSelectedPath(activeTabId, file.path);
    }, [activeTabId, setSelectedPath]);

    const handleOpen = useCallback(async (file: FileEntry) => {
        if (file.is_dir) {
            navigateTo(file.path);
        } else {
            try {
                const { openPath } = await import('@tauri-apps/plugin-opener');
                await openPath(file.path);
            } catch (error) {
                console.error('Failed to open file:', error);
                updateTabState(activeTabId, { error: `Failed to open: ${error}` });
            }
        }
    }, [activeTabId, navigateTo, updateTabState]);

    const goUp = useCallback(async () => {
        const currentState = useTabStore.getState().getCurrentState();
        try {
            const parent = await systemService.getParentDirectory(currentState.path);
            if (parent && parent !== currentState.path) {
                navigateTo(parent);
            }
        } catch (error) {
            console.error('Failed to get parent:', error);
        }
    }, [navigateTo]);

    return {
        handleCopy,
        handleCut,
        handlePaste,
        handleNewFolder,
        handleRename,
        handleDelete,
        handleSelect,
        handleOpen,
        goUp,
    };
}
