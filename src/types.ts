// TypeScript types matching Rust structs

export interface FileEntry {
    name: string;
    path: string;
    is_dir: boolean;
    size: number;
    modified: string;
    extension: string;
}

export interface DriveInfo {
    name: string;
    path: string;
    total_space: number;
    free_space: number;
}

export type ViewMode = 'grid' | 'list';

export type SortBy = 'name' | 'date' | 'size' | 'type';

export type SortOrder = 'asc' | 'desc';
