import { FC } from 'react';

interface IconProps {
    className?: string;
    size?: number;
}

// Windows 11 style Folder Icon
export const FolderIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <path d="M4 10C4 7.79086 5.79086 6 8 6H18.3431C19.404 6 20.4214 6.42143 21.1716 7.17157L24 10H40C42.2091 10 44 11.7909 44 14V38C44 40.2091 42.2091 42 40 42H8C5.79086 42 4 40.2091 4 38V10Z" fill="var(--color-folder)" />
        <path d="M4 14H44V38C44 40.2091 42.2091 42 40 42H8C5.79086 42 4 40.2091 4 38V14Z" fill="var(--color-folder-front)" />
    </svg>
);

// File Icon
export const FileIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <path d="M12 4C9.79086 4 8 5.79086 8 8V40C8 42.2091 9.79086 44 12 44H36C38.2091 44 40 42.2091 40 40V16L28 4H12Z" fill="#e4e4e4" />
        <path d="M28 4V12C28 14.2091 29.7909 16 32 16H40L28 4Z" fill="#b4b4b4" />
    </svg>
);

// Document Icon
export const DocumentIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <path d="M12 4C9.79086 4 8 5.79086 8 8V40C8 42.2091 9.79086 44 12 44H36C38.2091 44 40 42.2091 40 40V16L28 4H12Z" fill="#4a9cdc" />
        <path d="M28 4V12C28 14.2091 29.7909 16 32 16H40L28 4Z" fill="#3085c9" />
        <path d="M14 24H34M14 30H30M14 36H26" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Image Icon
export const ImageIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect x="6" y="8" width="36" height="32" rx="4" fill="#4eb36c" />
        <circle cx="16" cy="18" r="4" fill="#ffe066" />
        <path d="M6 32L16 22L26 32H6Z" fill="#3da55d" />
        <path d="M22 36L32 24L42 36C42 38.2091 40.2091 40 38 40H26L22 36Z" fill="#2d8a4e" />
    </svg>
);

// Video Icon  
export const VideoIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect x="4" y="10" width="40" height="28" rx="4" fill="#9b59b6" />
        <path d="M20 18V30L32 24L20 18Z" fill="white" />
    </svg>
);

// Audio Icon
export const AudioIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect x="6" y="6" width="36" height="36" rx="4" fill="#e74c3c" />
        <path d="M18 16V28M24 12V36M30 18V30" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

// Archive Icon
export const ArchiveIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <path d="M12 4C9.79086 4 8 5.79086 8 8V40C8 42.2091 9.79086 44 12 44H36C38.2091 44 40 42.2091 40 40V16L28 4H12Z" fill="#795548" />
        <path d="M28 4V12C28 14.2091 29.7909 16 32 16H40L28 4Z" fill="#5d4037" />
        <rect x="20" y="20" width="8" height="4" fill="#ffc107" />
        <rect x="20" y="26" width="8" height="4" fill="#ffc107" />
        <rect x="20" y="32" width="8" height="4" fill="#ffc107" />
    </svg>
);

// Code Icon
export const CodeIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <path d="M12 4C9.79086 4 8 5.79086 8 8V40C8 42.2091 9.79086 44 12 44H36C38.2091 44 40 42.2091 40 40V16L28 4H12Z" fill="#546e7a" />
        <path d="M28 4V12C28 14.2091 29.7909 16 32 16H40L28 4Z" fill="#455a64" />
        <path d="M16 26L12 30L16 34M32 26L36 30L32 34M22 38L26 22" stroke="#81d4fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Exe Icon
export const ExeIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect x="6" y="6" width="36" height="36" rx="4" fill="#2196f3" />
        <rect x="12" y="12" width="10" height="10" rx="2" fill="white" fillOpacity="0.9" />
        <rect x="26" y="12" width="10" height="10" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="12" y="26" width="10" height="10" rx="2" fill="white" fillOpacity="0.7" />
        <rect x="26" y="26" width="10" height="10" rx="2" fill="white" fillOpacity="0.5" />
    </svg>
);

// PDF Icon
export const PdfIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <path d="M12 4C9.79086 4 8 5.79086 8 8V40C8 42.2091 9.79086 44 12 44H36C38.2091 44 40 42.2091 40 40V16L28 4H12Z" fill="#e53935" />
        <path d="M28 4V12C28 14.2091 29.7909 16 32 16H40L28 4Z" fill="#c62828" />
        <text x="24" y="34" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Segoe UI">PDF</text>
    </svg>
);

// Drive Icon
export const DriveIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect x="4" y="12" width="40" height="24" rx="4" fill="#607d8b" />
        <rect x="8" y="16" width="24" height="8" rx="2" fill="#90a4ae" />
        <circle cx="38" cy="28" r="3" fill="#4caf50" />
    </svg>
);

// Quick access icons
export const DesktopIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 21H16M12 17V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const DownloadIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 3V15M12 15L7 10M12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const DocumentsIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M7 3C5.34315 3 4 4.34315 4 6V18C4 19.6569 5.34315 21 7 21H17C18.6569 21 20 19.6569 20 18V9L14 3H7Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 3V7C14 8.10457 14.8954 9 16 9H20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 13H16M8 17H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const PicturesIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 15L8 10L13 15M13 15L16 12L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MusicIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="7" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 17V5L20 3V15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

export const VideosIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 9V15L15 12L10 9Z" fill="currentColor" />
    </svg>
);

// Navigation Icons
export const ChevronLeftIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ChevronRightIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ChevronUpIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SearchIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const GridIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

export const ListIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M8 6H21M8 12H21M8 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="4" cy="6" r="1" fill="currentColor" />
        <circle cx="4" cy="12" r="1" fill="currentColor" />
        <circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
);

export const RefreshIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 12C4 7.58172 7.58172 4 12 4C15.0736 4 17.7467 5.67113 19.2 8.16667M20 12C20 16.4183 16.4183 20 12 20C8.92636 20 6.25329 18.3289 4.8 15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 8H20V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 16H4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Action Icons
export const PlusIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const CutIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 4L8.5 15.5M20 20L8.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const CopyIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 8V6C16 4.89543 15.1046 4 14 4H6C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16H8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

export const PasteIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="4" y="6" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 6V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 13H16M8 17H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const RenameIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M17 3L21 7L8 20H4V16L17 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 6L18 10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

export const DeleteIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SortIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 6H14M4 12H10M4 18H7M16 6V18M16 18L13 15M16 18L19 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MoreIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="6" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
);

export const NewFolderIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 7C3 5.34315 4.34315 4 6 4H10.1716C10.702 4 11.2107 4.21071 11.5858 4.58579L13 6H18C19.6569 6 21 7.34315 21 9V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V7Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 11V17M9 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Get icon component based on file extension
export const getFileIcon = (extension: string, isDir: boolean, size: number = 24) => {
    if (isDir) {
        return <FolderIcon size={size} />;
    }

    const ext = extension.toLowerCase();

    if (['pdf'].includes(ext)) return <PdfIcon size={size} />;
    if (['doc', 'docx', 'txt', 'rtf', 'md', 'odt'].includes(ext)) return <DocumentIcon size={size} />;
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp', 'tiff'].includes(ext)) return <ImageIcon size={size} />;
    if (['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv'].includes(ext)) return <VideoIcon size={size} />;
    if (['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac', 'wma'].includes(ext)) return <AudioIcon size={size} />;
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) return <ArchiveIcon size={size} />;
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'rs', 'go', 'java', 'c', 'cpp', 'h', 'cs', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'toml', 'sh', 'ps1', 'bat'].includes(ext)) return <CodeIcon size={size} />;
    if (['exe', 'msi', 'dll', 'app'].includes(ext)) return <ExeIcon size={size} />;

    return <FileIcon size={size} />;
};

// Get quick access icon
export const getQuickAccessIcon = (name: string, size: number = 18) => {
    const icons: Record<string, JSX.Element> = {
        'Desktop': <DesktopIcon size={size} />,
        'Downloads': <DownloadIcon size={size} />,
        'Documents': <DocumentsIcon size={size} />,
        'Pictures': <PicturesIcon size={size} />,
        'Music': <MusicIcon size={size} />,
        'Videos': <VideosIcon size={size} />,
    };
    return icons[name] || <FolderIcon size={size} />;
};
