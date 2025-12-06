// File operations service - encapsulates all Tauri file-related API calls
// Follows Dependency Inversion Principle: components depend on this abstraction

import { invoke } from '@tauri-apps/api/core';
import type { FileEntry } from '../types';

export interface FileProperties {
    created: string;
    accessed: string;
    modified: string;
    readonly: boolean;
    hidden: boolean;
}

export interface FileService {
    readDirectory: (path: string) => Promise<FileEntry[]>;
    createFolder: (path: string, name: string) => Promise<void>;
    deleteItem: (path: string) => Promise<void>;
    renameItem: (oldPath: string, newName: string) => Promise<void>;
    copyItem: (source: string, destination: string) => Promise<void>;
    moveItem: (source: string, destination: string) => Promise<void>;
    searchFiles: (path: string, query: string, maxResults?: number) => Promise<FileEntry[]>;
    getFileProperties: (path: string) => Promise<FileProperties>;
}

export const fileService: FileService = {
    readDirectory: (path: string) =>
        invoke<FileEntry[]>('read_directory', { path }),

    createFolder: (path: string, name: string) =>
        invoke('create_folder', { path, name }),

    deleteItem: (path: string) =>
        invoke('delete_item', { path }),

    renameItem: (oldPath: string, newName: string) =>
        invoke('rename_item', { oldPath, newName }),

    copyItem: (source: string, destination: string) =>
        invoke('copy_item', { source, destination }),

    moveItem: (source: string, destination: string) =>
        invoke('move_item', { source, destination }),

    searchFiles: (path: string, query: string, maxResults = 100) =>
        invoke<FileEntry[]>('search_files', { path, query, maxResults }),

    getFileProperties: (path: string) =>
        invoke<FileProperties>('get_file_properties', { path }),
};
