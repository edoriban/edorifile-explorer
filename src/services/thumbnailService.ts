// Thumbnail service - handles thumbnail generation requests
// Follows Single Responsibility Principle: only handles thumbnails

import { invoke } from '@tauri-apps/api/core';

// Supported extensions for thumbnails - images (via Rust image crate)
const IMAGE_EXTENSIONS = new Set([
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico', 'tiff', 'tif'
]);

// Extensions that Windows Shell can generate thumbnails for (videos, PDFs, etc)
const SHELL_THUMBNAIL_EXTENSIONS = new Set([
    'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'mpeg', 'mpg',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
]);

// All supported extensions
const THUMBNAIL_EXTENSIONS = new Set([...IMAGE_EXTENSIONS, ...SHELL_THUMBNAIL_EXTENSIONS]);

export interface ThumbnailService {
    getThumbnail: (path: string, size?: number) => Promise<string>;
    isThumbnailSupported: (extension: string) => boolean;
}

export const thumbnailService: ThumbnailService = {
    /**
     * Get a base64-encoded thumbnail for an image file
     * @param path - Absolute path to the file
     * @param size - Optional thumbnail size (default 96)
     * @returns Base64 data URL (data:image/png;base64,...)
     */
    getThumbnail: (path: string, size = 96) =>
        invoke<string>('get_thumbnail', { path, size }),

    /**
     * Check if a file extension supports thumbnail generation
     */
    isThumbnailSupported: (extension: string) =>
        THUMBNAIL_EXTENSIONS.has(extension.toLowerCase()),
};
