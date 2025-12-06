// Global application store using Zustand
// Manages drives, quick access, and view mode

import { create } from 'zustand';
import type { DriveInfo, FileEntry, ViewMode } from '../types';
import { systemService } from '../services';

interface AppState {
    // Data
    drives: DriveInfo[];
    quickAccess: FileEntry[];
    viewMode: ViewMode;
    isInitialized: boolean;

    // Actions
    setViewMode: (mode: ViewMode) => void;
    initialize: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Initial state
    drives: [],
    quickAccess: [],
    viewMode: 'list',
    isInitialized: false,

    // Actions
    setViewMode: (mode) => set({ viewMode: mode }),

    initialize: async () => {
        if (get().isInitialized) return;

        try {
            const [drives, quickAccess] = await Promise.all([
                systemService.getDrives(),
                systemService.getQuickAccess(),
            ]);
            set({ drives, quickAccess, isInitialized: true });
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    },
}));
