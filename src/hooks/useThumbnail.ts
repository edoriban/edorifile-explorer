// useThumbnail hook - manages thumbnail loading with LRU cache
// Following Single Responsibility: handles thumbnail state management

import { useState, useEffect, useRef } from 'react';
import { thumbnailService } from '@services/thumbnailService';

// LRU Cache implementation
class LRUCache<K, V> {
    private cache = new Map<K, V>();
    private maxSize: number;

    constructor(maxSize: number) {
        this.maxSize = maxSize;
    }

    get(key: K): V | undefined {
        const value = this.cache.get(key);
        if (value !== undefined) {
            // Move to end (most recently used)
            this.cache.delete(key);
            this.cache.set(key, value);
        }
        return value;
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Remove oldest (first) entry
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }
        this.cache.set(key, value);
    }

    has(key: K): boolean {
        return this.cache.has(key);
    }
}

// Global cache shared across all hook instances
const thumbnailCache = new LRUCache<string, string>(200);
const pendingRequests = new Map<string, Promise<string>>();

// Request queue to limit concurrent requests
const MAX_CONCURRENT = 4;
let activeRequests = 0;
const requestQueue: Array<() => void> = [];

function processQueue() {
    while (activeRequests < MAX_CONCURRENT && requestQueue.length > 0) {
        const next = requestQueue.shift();
        if (next) {
            activeRequests++;
            next();
        }
    }
}

function queueRequest<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        const execute = () => {
            fn()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    activeRequests--;
                    processQueue();
                });
        };

        if (activeRequests < MAX_CONCURRENT) {
            activeRequests++;
            execute();
        } else {
            requestQueue.push(execute);
        }
    });
}

interface UseThumbnailResult {
    thumbnail: string | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook to load thumbnails with caching and lazy loading
 * @param path - File path
 * @param extension - File extension (to check if supported)
 * @param enabled - Whether to load thumbnail (for lazy loading)
 */
export function useThumbnail(
    path: string,
    extension: string,
    enabled = true
): UseThumbnailResult {
    const [thumbnail, setThumbnail] = useState<string | null>(() => {
        // Check cache on initial render
        return thumbnailCache.get(path) ?? null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        // Reset when path changes
        const cached = thumbnailCache.get(path);
        if (cached) {
            setThumbnail(cached);
            setIsLoading(false);
            setError(null);
            return;
        }

        // Don't load if disabled or not supported
        if (!enabled || !thumbnailService.isThumbnailSupported(extension)) {
            setThumbnail(null);
            setIsLoading(false);
            return;
        }

        // Check if request already pending
        const pending = pendingRequests.get(path);
        if (pending) {
            setIsLoading(true);
            pending
                .then((data) => {
                    if (mountedRef.current) {
                        setThumbnail(data);
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    if (mountedRef.current) {
                        setError(String(err));
                        setIsLoading(false);
                    }
                });
            return;
        }

        // Load thumbnail
        setIsLoading(true);
        setError(null);

        const request = queueRequest(() => thumbnailService.getThumbnail(path));
        pendingRequests.set(path, request);

        request
            .then((data) => {
                thumbnailCache.set(path, data);
                pendingRequests.delete(path);
                if (mountedRef.current) {
                    setThumbnail(data);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                pendingRequests.delete(path);
                if (mountedRef.current) {
                    setError(String(err));
                    setIsLoading(false);
                }
            });
    }, [path, extension, enabled]);

    return { thumbnail, isLoading, error };
}

/**
 * Check if a file supports thumbnails without loading
 */
export function isThumbnailSupported(extension: string): boolean {
    return thumbnailService.isThumbnailSupported(extension);
}
