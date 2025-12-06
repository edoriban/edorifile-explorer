// Hook for context menu handling
// Manages native Tauri context menu integration

import { useEffect, useRef, useCallback } from 'react';
import { listen } from '@tauri-apps/api/event';
import { systemService } from '../services';
import { useTabStore, useClipboardStore } from '../store';
import { useFileOperations, type DialogType } from './useFileOperations';
import type { FileEntry } from '../types';

interface ContextMenuOptions {
    setDialog: (dialog: DialogType) => void;
}

interface ContextMenuReturn {
    handleContextMenu: (e: React.MouseEvent, file: FileEntry) => Promise<void>;
    handleBackgroundContextMenu: (e: React.MouseEvent) => Promise<void>;
    contextFileRef: React.MutableRefObject<FileEntry | null>;
}

export function useContextMenu({ setDialog }: ContextMenuOptions): ContextMenuReturn {
    const contextFileRef = useRef<FileEntry | null>(null);
    const { handleOpen, handleCut, handleCopy, handlePaste } = useFileOperations();
    const { activeTabId, setSelectedPath, getCurrentState } = useTabStore();
    const hasClipboard = useClipboardStore((s) => s.clipboard !== null);

    // Handle right-click on file
    const handleContextMenu = useCallback(async (e: React.MouseEvent, file: FileEntry) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedPath(activeTabId, file.path);
        contextFileRef.current = file;

        try {
            await systemService.showContextMenu({
                x: e.clientX,
                y: e.clientY,
                filePath: file.path,
                isFile: !file.is_dir,
                hasClipboard,
            });
        } catch (error) {
            console.error('Failed to show context menu:', error);
        }
    }, [activeTabId, setSelectedPath, hasClipboard]);

    // Handle right-click on background
    const handleBackgroundContextMenu = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        contextFileRef.current = null;

        try {
            await systemService.showContextMenu({
                x: e.clientX,
                y: e.clientY,
                filePath: null,
                isFile: false,
                hasClipboard,
            });
        } catch (error) {
            console.error('Failed to show context menu:', error);
        }
    }, [hasClipboard]);

    // Store handlers in ref to avoid recreating listener
    const handlersRef = useRef({
        handleOpen,
        handleCut,
        handleCopy,
        handlePaste,
        getCurrentState,
    });

    useEffect(() => {
        handlersRef.current = {
            handleOpen,
            handleCut,
            handleCopy,
            handlePaste,
            getCurrentState,
        };
    }, [handleOpen, handleCut, handleCopy, handlePaste, getCurrentState]);

    // Listen for context menu actions from Tauri
    useEffect(() => {
        let unlistenFn: (() => void) | null = null;
        let mounted = true;

        listen<string>('context-menu-action', async (event) => {
            if (!mounted) return;

            const action = event.payload;
            const file = contextFileRef.current;
            const handlers = handlersRef.current;

            console.log('[ContextMenu] Action received:', action, 'File:', file?.name);

            switch (action) {
                case 'open':
                    if (file) handlers.handleOpen(file);
                    break;
                case 'cut':
                    if (file) handlers.handleCut();
                    break;
                case 'copy':
                    if (file) handlers.handleCopy();
                    break;
                case 'paste':
                    handlers.handlePaste();
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
                        const currentPath = handlers.getCurrentState().path;
                        await systemService.openInTerminal(file?.is_dir ? file.path : currentPath);
                    } catch (error) {
                        console.error('Failed to open terminal:', error);
                    }
                    break;
                case 'properties':
                    if (file) {
                        try {
                            await systemService.showNativeProperties(file.path);
                        } catch (error) {
                            console.error('Failed to show properties:', error);
                        }
                    }
                    break;
            }
        }).then((fn) => {
            if (mounted) unlistenFn = fn;
        });

        return () => {
            mounted = false;
            if (unlistenFn) unlistenFn();
        };
    }, [setDialog]);

    return {
        handleContextMenu,
        handleBackgroundContextMenu,
        contextFileRef,
    };
}
