// Thumbnail service - handles thumbnail generation requests
// Follows Single Responsibility Principle: only handles thumbnails

import { invoke } from '@tauri-apps/api/core';

// Supported extensions for thumbnails
const THUMBNAIL_EXTENSIONS = new Set([
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico', 'tiff', 'tif'
]);

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
