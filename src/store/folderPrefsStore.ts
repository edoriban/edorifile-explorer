// Folder preferences store using Zustand
// Remembers view settings per folder while app is running

import { create } from 'zustand';
import type { ViewMode, SortBy, SortOrder } from '@types';

interface FolderPrefs {
    viewMode: ViewMode;
    sortBy: SortBy;
    sortOrder: SortOrder;
}

interface FolderPrefsStore {
    // Map of folder path -> preferences
    prefs: Record<string, Partial<FolderPrefs>>;

    // Get prefs for a folder (returns undefined properties if not set)
    getPrefs: (path: string) => Partial<FolderPrefs> | undefined;

    // Set prefs for a folder
    setPrefs: (path: string, prefs: Partial<FolderPrefs>) => void;

    // Update specific pref for a folder
    setViewMode: (path: string, viewMode: ViewMode) => void;
    setSorting: (path: string, sortBy: SortBy, sortOrder: SortOrder) => void;
}

// Normalize path for consistent keys (lowercase, no trailing slash)
const normalizePath = (path: string): string =>
    path.toLowerCase().replace(/\\+$/, '');

export const useFolderPrefsStore = create<FolderPrefsStore>((set, get) => ({
    prefs: {},

    getPrefs: (path) => {
        return get().prefs[normalizePath(path)];
    },

    setPrefs: (path, newPrefs) => {
        const key = normalizePath(path);
        set((state) => ({
            prefs: {
                ...state.prefs,
                [key]: { ...state.prefs[key], ...newPrefs }
            }
        }));
    },

    setViewMode: (path, viewMode) => {
        get().setPrefs(path, { viewMode });
    },

    setSorting: (path, sortBy, sortOrder) => {
        get().setPrefs(path, { sortBy, sortOrder });
    },
}));
