// Types for tab management

import type { SortBy, SortOrder } from './file.types';

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
    sortBy: SortBy;
    sortOrder: SortOrder;
}
