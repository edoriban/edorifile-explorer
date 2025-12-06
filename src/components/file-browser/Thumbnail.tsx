// Thumbnail component - displays image thumbnails with lazy loading
// Uses IntersectionObserver for viewport detection

import { FC, useState, useRef, useEffect } from 'react';
import { useThumbnail, isThumbnailSupported } from '@hooks/useThumbnail';
import { getFileIcon } from '@utils/icons';

interface ThumbnailProps {
    path: string;
    extension: string;
    isDir: boolean;
    size?: number;
}

export const Thumbnail: FC<ThumbnailProps> = ({ path, extension, isDir, size = 56 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Lazy loading with IntersectionObserver
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' } // Start loading 100px before visible
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    // Only use thumbnail hook for supported files
    const shouldLoadThumbnail = !isDir && isThumbnailSupported(extension);
    const { thumbnail, isLoading } = useThumbnail(path, extension, isVisible && shouldLoadThumbnail);

    // Show icon for directories or unsupported files
    if (isDir || !shouldLoadThumbnail) {
        return (
            <div ref={containerRef} className="w-14 h-14 flex items-center justify-center icon-glow">
                {getFileIcon(extension, isDir, size)}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-14 h-14 flex items-center justify-center overflow-hidden rounded-md">
            {thumbnail ? (
                <img
                    src={thumbnail}
                    alt=""
                    className="max-w-full max-h-full object-contain transition-opacity duration-200"
                    loading="lazy"
                />
            ) : isLoading ? (
                <div className="w-10 h-10 bg-[var(--color-bg-hover)] rounded animate-pulse" />
            ) : (
                // Fallback to icon
                getFileIcon(extension, isDir, size)
            )}
        </div>
    );
};
