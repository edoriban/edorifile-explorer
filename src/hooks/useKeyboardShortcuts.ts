// Hook for keyboard shortcuts
// Centralizes all keyboard handling in one place

import { useEffect } from 'react';
import { useFileOperations, type DialogType } from './useFileOperations';
import { useTabStore, useClipboardStore } from '@store';

interface KeyboardShortcutsOptions {
    dialog: DialogType;
    setDialog: (dialog: DialogType) => void;
    onNewTab: () => void;
    onCloseTab: () => void;
}

export function useKeyboardShortcuts({
    dialog,
    setDialog,
    onNewTab,
    onCloseTab,
}: KeyboardShortcutsOptions): void {
    const { handleCopy, handleCut, handlePaste, goUp } = useFileOperations();
    const getCurrentState = useTabStore((s) => s.getCurrentState);
    const refresh = useTabStore((s) => s.refresh);
    const tabs = useTabStore((s) => s.tabs);
    const clipboard = useClipboardStore((s) => s.clipboard);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't handle shortcuts when dialog is open
            if (dialog) return;

            const currentState = getCurrentState();

            if (e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'c':
                        if (currentState.selectedPaths.length > 0) handleCopy();
                        break;
                    case 'x':
                        if (currentState.selectedPaths.length > 0) handleCut();
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
                        onNewTab();
                        break;
                    case 'w':
                        e.preventDefault();
                        if (tabs.length > 1) onCloseTab();
                        break;
                }
            } else {
                switch (e.key) {
                    case 'Delete':
                        if (currentState.selectedPaths.length > 0) setDialog('delete');
                        break;
                    case 'F2':
                        if (currentState.selectedPaths.length === 1) setDialog('rename');
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
    }, [
        dialog,
        setDialog,
        onNewTab,
        onCloseTab,
        handleCopy,
        handleCut,
        handlePaste,
        goUp,
        getCurrentState,
        refresh,
        tabs.length,
        clipboard,
    ]);
}
