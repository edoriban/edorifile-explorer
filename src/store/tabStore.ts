// Tab store using Zustand
// Manages multi-tab functionality with per-tab state

import { create } from 'zustand';
import type { Tab, TabState, FileEntry } from '@types';
import { fileService } from '@services';

// Generate unique tab ID
const generateId = () => Math.random().toString(36).substring(2, 9);

interface TabStore {
    // State
    tabs: Tab[];
    activeTabId: string;
    tabStates: Record<string, TabState>;
    files: Record<string, FileEntry[]>; // files per tab

    // Tab management
    addTab: (path: string) => void;
    closeTab: (tabId: string) => void;
    setActiveTab: (tabId: string) => void;

    // Tab state updates
    updateTabState: (tabId: string, updates: Partial<TabState>) => void;
    setFiles: (tabId: string, files: FileEntry[]) => void;
    setSelectedPath: (tabId: string, path: string | null) => void;

    // Navigation
    navigateTo: (path: string, replaceHistory?: boolean) => void;
    goBack: () => void;
    goForward: () => void;

    // Computed
    getCurrentState: () => TabState;
    getCurrentFiles: () => FileEntry[];
    canGoBack: () => boolean;
    canGoForward: () => boolean;

    // Loading
    loadDirectory: (tabId: string, path: string) => Promise<void>;
    searchFiles: (query: string) => Promise<void>;
    refresh: () => void;

    // Initialize
    initializeFirstTab: (path: string) => void;
}

const createInitialTabState = (path: string): TabState => ({
    path,
    title: path.split('\\').filter(Boolean).pop() || path,
    history: [path],
    historyIndex: 0,
    selectedPath: null,
    isLoading: false,
    error: null,
    searchQuery: '',
    isSearching: false,
});

export const useTabStore = create<TabStore>((set, get) => ({
    // Initial state
    tabs: [],
    activeTabId: '',
    tabStates: {},
    files: {},

    // Initialize first tab
    initializeFirstTab: (path: string) => {
        const id = generateId();
        const title = path.split('\\').filter(Boolean).pop() || path;

        set({
            tabs: [{ id, path, title }],
            activeTabId: id,
            tabStates: { [id]: createInitialTabState(path) },
            files: { [id]: [] },
        });

        // Load directory
        get().loadDirectory(id, path);
    },

    // Tab management
    addTab: (path: string) => {
        const { tabs, files: currentFiles, tabStates, activeTabId } = get();
        const id = generateId();
        const title = path.split('\\').filter(Boolean).pop() || path;

        // Clone files from current tab
        const currentTabFiles = currentFiles[activeTabId] || [];

        set({
            tabs: [...tabs, { id, path, title }],
            activeTabId: id,
            tabStates: { ...tabStates, [id]: createInitialTabState(path) },
            files: { ...currentFiles, [id]: currentTabFiles },
        });
    },

    closeTab: (tabId: string) => {
        const { tabs, activeTabId, tabStates, files } = get();
        if (tabs.length <= 1) return;

        const index = tabs.findIndex((t) => t.id === tabId);
        const newTabs = tabs.filter((t) => t.id !== tabId);

        // Clean up state
        const { [tabId]: _state, ...restStates } = tabStates;
        const { [tabId]: _files, ...restFiles } = files;

        // Determine new active tab
        let newActiveId = activeTabId;
        if (tabId === activeTabId) {
            const newIndex = Math.min(index, newTabs.length - 1);
            newActiveId = newTabs[newIndex].id;
        }

        set({
            tabs: newTabs,
            activeTabId: newActiveId,
            tabStates: restStates,
            files: restFiles,
        });
    },

    setActiveTab: (tabId: string) => set({ activeTabId: tabId }),

    // State updates
    updateTabState: (tabId, updates) => {
        set((state) => ({
            tabStates: {
                ...state.tabStates,
                [tabId]: { ...state.tabStates[tabId], ...updates },
            },
        }));
    },

    setFiles: (tabId, newFiles) => {
        set((state) => ({
            files: { ...state.files, [tabId]: newFiles },
        }));
    },

    setSelectedPath: (tabId, path) => {
        get().updateTabState(tabId, { selectedPath: path });
    },

    // Navigation
    navigateTo: (path, replaceHistory = false) => {
        const { activeTabId, tabs, tabStates } = get();
        const title = path.split('\\').filter(Boolean).pop() || path;
        const current = tabStates[activeTabId];

        // Update tab
        set({
            tabs: tabs.map((t) => (t.id === activeTabId ? { ...t, path, title } : t)),
        });

        // Update history
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

        get().updateTabState(activeTabId, {
            path,
            title,
            history: newHistory,
            historyIndex: newHistoryIndex,
            searchQuery: '',
            isSearching: false,
        });

        get().loadDirectory(activeTabId, path);
    },

    goBack: () => {
        const { activeTabId, tabStates, tabs } = get();
        const current = tabStates[activeTabId];

        if (current.historyIndex > 0) {
            const newIndex = current.historyIndex - 1;
            const path = current.history[newIndex];
            const title = path.split('\\').filter(Boolean).pop() || path;

            set({
                tabs: tabs.map((t) => (t.id === activeTabId ? { ...t, path, title } : t)),
            });

            get().updateTabState(activeTabId, { historyIndex: newIndex, path });
            get().loadDirectory(activeTabId, path);
        }
    },

    goForward: () => {
        const { activeTabId, tabStates, tabs } = get();
        const current = tabStates[activeTabId];

        if (current.historyIndex < current.history.length - 1) {
            const newIndex = current.historyIndex + 1;
            const path = current.history[newIndex];
            const title = path.split('\\').filter(Boolean).pop() || path;

            set({
                tabs: tabs.map((t) => (t.id === activeTabId ? { ...t, path, title } : t)),
            });

            get().updateTabState(activeTabId, { historyIndex: newIndex, path });
            get().loadDirectory(activeTabId, path);
        }
    },

    // Computed getters
    getCurrentState: () => {
        const { activeTabId, tabStates } = get();
        return tabStates[activeTabId] || createInitialTabState('C:\\');
    },

    getCurrentFiles: () => {
        const { activeTabId, files } = get();
        return files[activeTabId] || [];
    },

    canGoBack: () => {
        const state = get().getCurrentState();
        return state.historyIndex > 0;
    },

    canGoForward: () => {
        const state = get().getCurrentState();
        return state.historyIndex < state.history.length - 1;
    },

    // Loading
    loadDirectory: async (tabId, path) => {
        get().updateTabState(tabId, { isLoading: true, error: null });

        try {
            const entries = await fileService.readDirectory(path);
            get().setFiles(tabId, entries);
            get().updateTabState(tabId, { selectedPath: null, isLoading: false });
        } catch (error) {
            get().updateTabState(tabId, {
                error: String(error),
                isLoading: false
            });
            get().setFiles(tabId, []);
        }
    },

    searchFiles: async (query) => {
        const { activeTabId } = get();
        const currentState = get().getCurrentState();

        get().updateTabState(activeTabId, { searchQuery: query });

        if (!query.trim()) {
            get().updateTabState(activeTabId, { isSearching: false });
            get().loadDirectory(activeTabId, currentState.path);
            return;
        }

        get().updateTabState(activeTabId, { isSearching: true, isLoading: true, error: null });

        try {
            const results = await fileService.searchFiles(currentState.path, query.trim());
            get().setFiles(activeTabId, results);
            get().updateTabState(activeTabId, { isLoading: false });
        } catch (error) {
            get().updateTabState(activeTabId, {
                error: String(error),
                isLoading: false
            });
            get().setFiles(activeTabId, []);
        }
    },

    refresh: () => {
        const { activeTabId } = get();
        const currentState = get().getCurrentState();

        if (currentState.isSearching && currentState.searchQuery) {
            get().searchFiles(currentState.searchQuery);
        } else {
            get().loadDirectory(activeTabId, currentState.path);
        }
    },
}));
