// Clipboard store using Zustand
// Manages copy/cut/paste operations

import { create } from 'zustand';
import type { FileEntry, ClipboardState, ClipboardOperation } from '../types';

interface ClipboardStore {
    clipboard: ClipboardState | null;

    // Actions
    copy: (items: FileEntry[]) => void;
    cut: (items: FileEntry[]) => void;
    clear: () => void;
    hasClipboard: () => boolean;
}

export const useClipboardStore = create<ClipboardStore>((set, get) => ({
    clipboard: null,

    copy: (items) => set({
        clipboard: { items, operation: 'copy' as ClipboardOperation }
    }),

    cut: (items) => set({
        clipboard: { items, operation: 'cut' as ClipboardOperation }
    }),

    clear: () => set({ clipboard: null }),

    hasClipboard: () => get().clipboard !== null,
}));
