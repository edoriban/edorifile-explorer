// Hook for keyboard navigation in file browser
// Handles arrow keys, Enter, Backspace, Delete, F2, Ctrl+A, type-ahead search

import { useEffect, useCallback, useRef } from 'react';
import { useTabStore } from '@store';
import type { FileEntry } from '@types';

interface KeyboardNavigationOptions {
    onOpen: (file: FileEntry) => void;
    onGoUp: () => void;
    onDeleteRequest: () => void;
    onRenameRequest: () => void;
    onSelectAll: () => void;
    isDialogOpen: boolean;
}

export function useKeyboardNavigation({
    onOpen,
    onGoUp,
    onDeleteRequest,
    onRenameRequest,
    onSelectAll,
    isDialogOpen,
}: KeyboardNavigationOptions) {
    const typeAheadRef = useRef<string>('');
    const typeAheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Don't handle if dialog is open or if typing in an input
        if (isDialogOpen) return;
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

        const { activeTabId, tabStates, getCurrentFiles, setSelectedPaths } = useTabStore.getState();
        const currentState = tabStates[activeTabId];
        const currentFiles = getCurrentFiles();

        if (currentFiles.length === 0) return;

        const { selectedPaths } = currentState;
        const lastSelected = selectedPaths.length > 0 ? selectedPaths[selectedPaths.length - 1] : null;
        const currentIndex = lastSelected ? currentFiles.findIndex(f => f.path === lastSelected) : -1;

        switch (e.key) {
            case 'ArrowDown': {
                e.preventDefault();
                const nextIndex = currentIndex < currentFiles.length - 1 ? currentIndex + 1 : 0;
                const nextFile = currentFiles[nextIndex];

                if (e.shiftKey && lastSelected) {
                    // Extend selection
                    if (!selectedPaths.includes(nextFile.path)) {
                        setSelectedPaths(activeTabId, [...selectedPaths, nextFile.path], nextFile.path);
                    } else {
                        // Shrink selection (moving back)
                        const newPaths = selectedPaths.filter((_, i) => i !== selectedPaths.length - 1);
                        setSelectedPaths(activeTabId, newPaths, nextFile.path);
                    }
                } else {
                    setSelectedPaths(activeTabId, [nextFile.path], nextFile.path);
                }
                break;
            }

            case 'ArrowUp': {
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentFiles.length - 1;
                const prevFile = currentFiles[prevIndex];

                if (e.shiftKey && lastSelected) {
                    // Extend selection
                    if (!selectedPaths.includes(prevFile.path)) {
                        setSelectedPaths(activeTabId, [...selectedPaths, prevFile.path], prevFile.path);
                    } else {
                        // Shrink selection
                        const newPaths = selectedPaths.filter((_, i) => i !== selectedPaths.length - 1);
                        setSelectedPaths(activeTabId, newPaths, prevFile.path);
                    }
                } else {
                    setSelectedPaths(activeTabId, [prevFile.path], prevFile.path);
                }
                break;
            }

            case 'Enter': {
                e.preventDefault();
                if (selectedPaths.length === 1) {
                    const selectedFile = currentFiles.find(f => f.path === selectedPaths[0]);
                    if (selectedFile) {
                        onOpen(selectedFile);
                    }
                }
                break;
            }

            case 'Backspace': {
                e.preventDefault();
                onGoUp();
                break;
            }

            case 'Delete': {
                e.preventDefault();
                if (selectedPaths.length > 0) {
                    onDeleteRequest();
                }
                break;
            }

            case 'F2': {
                e.preventDefault();
                if (selectedPaths.length === 1) {
                    onRenameRequest();
                }
                break;
            }

            case 'a':
            case 'A': {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    onSelectAll();
                }
                break;
            }

            case 'Home': {
                e.preventDefault();
                if (currentFiles.length > 0) {
                    setSelectedPaths(activeTabId, [currentFiles[0].path], currentFiles[0].path);
                }
                break;
            }

            case 'End': {
                e.preventDefault();
                if (currentFiles.length > 0) {
                    const lastFile = currentFiles[currentFiles.length - 1];
                    setSelectedPaths(activeTabId, [lastFile.path], lastFile.path);
                }
                break;
            }

            default: {
                // Type-ahead search: single character jumps to matching file
                if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();

                    // Accumulate typed characters
                    typeAheadRef.current += e.key.toLowerCase();

                    // Clear timeout and set new one
                    if (typeAheadTimeoutRef.current) {
                        clearTimeout(typeAheadTimeoutRef.current);
                    }
                    typeAheadTimeoutRef.current = setTimeout(() => {
                        typeAheadRef.current = '';
                    }, 500);

                    // Find file starting with typed characters
                    const searchStr = typeAheadRef.current;
                    const matchingFile = currentFiles.find(f =>
                        f.name.toLowerCase().startsWith(searchStr)
                    );

                    if (matchingFile) {
                        setSelectedPaths(activeTabId, [matchingFile.path], matchingFile.path);
                    }
                }
                break;
            }
        }
    }, [isDialogOpen, onOpen, onGoUp, onDeleteRequest, onRenameRequest, onSelectAll]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (typeAheadTimeoutRef.current) {
                clearTimeout(typeAheadTimeoutRef.current);
            }
        };
    }, [handleKeyDown]);
}
