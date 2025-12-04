import { FC } from 'react';

interface IconProps {
    className?: string;
    size?: number;
}

// Folder Icon
export const FolderIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <path
            d="M2 6C2 4.89543 2.89543 4 4 4H9.17157C9.70201 4 10.2107 4.21071 10.5858 4.58579L12 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
            fill="var(--color-folder)"
            stroke="var(--color-folder-dark)"
            strokeWidth="1"
        />
        <path
            d="M2 8H22V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V8Z"
            fill="var(--color-folder)"
        />
    </svg>
);

// Generic File Icon
export const FileIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <path
            d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
            fill="#e8e8e8"
            stroke="#b0b0b0"
            strokeWidth="1"
        />
        <path
            d="M14 2V8H20"
            stroke="#b0b0b0"
            strokeWidth="1"
        />
    </svg>
);

// Document Icon (for text files, docs, etc)
export const DocumentIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <path
            d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
            fill="#4a90d9"
            stroke="#3a7bc8"
            strokeWidth="1"
        />
        <path d="M14 2V8H20" stroke="#3a7bc8" strokeWidth="1" />
        <path d="M8 13H16M8 17H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Image Icon
export const ImageIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#4caf50" stroke="#388e3c" strokeWidth="1" />
        <circle cx="8.5" cy="8.5" r="2" fill="#ffeb3b" />
        <path d="M21 15L16 10L8 18H21V15Z" fill="#81c784" />
        <path d="M3 18L8 13L12 17" fill="#66bb6a" />
    </svg>
);

// Video Icon
export const VideoIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#9c27b0" stroke="#7b1fa2" strokeWidth="1" />
        <path d="M10 8L16 12L10 16V8Z" fill="white" />
    </svg>
);

// Audio Icon
export const AudioIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#ff5722" stroke="#e64a19" strokeWidth="1" />
        <path d="M9 8V14M12 6V16M15 9V13" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Archive Icon
export const ArchiveIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <path
            d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
            fill="#795548"
            stroke="#5d4037"
            strokeWidth="1"
        />
        <path d="M14 2V8H20" stroke="#5d4037" strokeWidth="1" />
        <rect x="10" y="10" width="4" height="2" fill="#ffb74d" />
        <rect x="10" y="13" width="4" height="2" fill="#ffb74d" />
        <rect x="10" y="16" width="4" height="2" fill="#ffb74d" />
    </svg>
);

// Code Icon
export const CodeIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <path
            d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
            fill="#607d8b"
            stroke="#455a64"
            strokeWidth="1"
        />
        <path d="M14 2V8H20" stroke="#455a64" strokeWidth="1" />
        <path d="M9 13L7 15L9 17M15 13L17 15L15 17M11 18L13 12" stroke="#90caf9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Executable Icon
export const ExeIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#2196f3" stroke="#1976d2" strokeWidth="1" />
        <rect x="6" y="6" width="5" height="5" rx="1" fill="white" opacity="0.8" />
        <rect x="13" y="6" width="5" height="5" rx="1" fill="white" opacity="0.6" />
        <rect x="6" y="13" width="5" height="5" rx="1" fill="white" opacity="0.6" />
        <rect x="13" y="13" width="5" height="5" rx="1" fill="white" opacity="0.4" />
    </svg>
);

// PDF Icon
export const PdfIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <path
            d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
            fill="#f44336"
            stroke="#d32f2f"
            strokeWidth="1"
        />
        <path d="M14 2V8H20" stroke="#d32f2f" strokeWidth="1" />
        <text x="12" y="17" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">PDF</text>
    </svg>
);

// Drive Icon
export const DriveIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <rect x="2" y="6" width="20" height="12" rx="2" fill="#78909c" stroke="#546e7a" strokeWidth="1" />
        <rect x="4" y="8" width="12" height="4" rx="1" fill="#b0bec5" />
        <circle cx="18" cy="14" r="1.5" fill="#4caf50" />
    </svg>
);

// Navigation Icons
export const ChevronLeftIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ChevronRightIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ChevronUpIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SearchIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const GridIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const ListIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const RefreshIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Get icon component based on file extension
export const getFileIcon = (extension: string, isDir: boolean, size: number = 24) => {
    if (isDir) {
        return <FolderIcon size={size} />;
    }

    const ext = extension.toLowerCase();

    // Documents
    if (['pdf'].includes(ext)) {
        return <PdfIcon size={size} />;
    }
    if (['doc', 'docx', 'txt', 'rtf', 'md', 'odt'].includes(ext)) {
        return <DocumentIcon size={size} />;
    }

    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp', 'tiff'].includes(ext)) {
        return <ImageIcon size={size} />;
    }

    // Videos
    if (['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv'].includes(ext)) {
        return <VideoIcon size={size} />;
    }

    // Audio
    if (['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac', 'wma'].includes(ext)) {
        return <AudioIcon size={size} />;
    }

    // Archives
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) {
        return <ArchiveIcon size={size} />;
    }

    // Code
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'rs', 'go', 'java', 'c', 'cpp', 'h', 'cs', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'toml', 'sh', 'ps1', 'bat'].includes(ext)) {
        return <CodeIcon size={size} />;
    }

    // Executables
    if (['exe', 'msi', 'dll', 'app'].includes(ext)) {
        return <ExeIcon size={size} />;
    }

    return <FileIcon size={size} />;
};
