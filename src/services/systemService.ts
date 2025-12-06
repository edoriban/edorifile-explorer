// System service - encapsulates all Tauri system-related API calls
// Drives, quick access, context menu, terminal, properties, etc.

import { invoke } from '@tauri-apps/api/core';
import type { DriveInfo, FileEntry } from '../types';

export interface ContextMenuParams {
    x: number;
    y: number;
    filePath: string | null;
    isFile: boolean;
    hasClipboard: boolean;
}

export interface SystemService {
    getDrives: () => Promise<DriveInfo[]>;
    getQuickAccess: () => Promise<FileEntry[]>;
    getParentDirectory: (path: string) => Promise<string | null>;
    showContextMenu: (params: ContextMenuParams) => Promise<void>;
    openInTerminal: (path: string) => Promise<void>;
    showNativeProperties: (path: string) => Promise<void>;
}

export const systemService: SystemService = {
    getDrives: () =>
        invoke<DriveInfo[]>('get_drives'),

    getQuickAccess: () =>
        invoke<FileEntry[]>('get_quick_access'),

    getParentDirectory: (path: string) =>
        invoke<string | null>('get_parent_directory', { path }),

    showContextMenu: (params: ContextMenuParams) =>
        invoke('show_context_menu', {
            x: params.x,
            y: params.y,
            filePath: params.filePath,
            isFile: params.isFile,
            hasClipboard: params.hasClipboard,
        }),

    openInTerminal: (path: string) =>
        invoke('open_in_terminal', { path }),

    showNativeProperties: (path: string) =>
        invoke('show_native_properties', { path }),
};
