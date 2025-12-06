// Types for tab management

export interface Tab {
    id: string;
    path: string;
    title: string;
}

export interface TabState {
    path: string;
    title: string;
    history: string[];
    historyIndex: number;
    selectedPath: string | null;
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    isSearching: boolean;
}
