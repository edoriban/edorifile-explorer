// Types for file entries and system information
// Matches the Rust structs in src-tauri

export interface FileEntry {
    name: string;
    path: string;
    is_dir: boolean;
    size: number;
    modified: string;
    extension: string;
    is_cloud_placeholder: boolean; // Cloud file not yet downloaded
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
