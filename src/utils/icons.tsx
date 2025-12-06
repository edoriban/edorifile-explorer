import React, { FC } from 'react';

interface IconProps {
    className?: string;
    size?: number;
}

// Modern Folder Icon (Windows 11 style)
export const FolderIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M2 6C2 4.89543 2.89543 4 4 4H9.17157C9.70201 4 10.2107 4.21071 10.5858 4.58579L12 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" fill="#fbbf24" />
        <path d="M2 9H22V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V9Z" fill="#fcd34d" />
    </svg>
);

// File Icon
export const FileIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6Z" fill="#94a3b8" />
        <path d="M14 2V6C14 7.10457 14.8954 8 16 8H20L14 2Z" fill="#64748b" />
    </svg>
);

// Document Icon
export const DocumentIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6Z" fill="#3b82f6" />
        <path d="M14 2V6C14 7.10457 14.8954 8 16 8H20L14 2Z" fill="#1d4ed8" />
        <path d="M7 12H17M7 15H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Image Icon
export const ImageIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="4" width="18" height="16" rx="2" fill="#10b981" />
        <circle cx="8" cy="9" r="2" fill="#fde047" />
        <path d="M3 16L8 11L11 14L16 9L21 14V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V16Z" fill="#059669" />
    </svg>
);

// Video Icon  
export const VideoIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="5" width="20" height="14" rx="2" fill="#8b5cf6" />
        <path d="M10 9V15L15 12L10 9Z" fill="white" />
    </svg>
);

// Audio Icon
export const AudioIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#ec4899" />
        <path d="M9 8V14M12 6V18M15 9V15" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Archive Icon
export const ArchiveIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6Z" fill="#a855f7" />
        <path d="M14 2V6C14 7.10457 14.8954 8 16 8H20L14 2Z" fill="#7c3aed" />
        <rect x="10" y="10" width="4" height="2" fill="white" />
        <rect x="10" y="13" width="4" height="2" fill="white" />
        <rect x="10" y="16" width="4" height="2" fill="white" />
    </svg>
);

// Code Icon
export const CodeIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6Z" fill="#475569" />
        <path d="M14 2V6C14 7.10457 14.8954 8 16 8H20L14 2Z" fill="#334155" />
        <path d="M8 13L6 15L8 17M16 13L18 15L16 17M11 19L13 11" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Exe Icon
export const ExeIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#0ea5e9" />
        <rect x="6" y="6" width="5" height="5" rx="1" fill="white" fillOpacity="0.9" />
        <rect x="13" y="6" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
        <rect x="6" y="13" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
        <rect x="13" y="13" width="5" height="5" rx="1" fill="white" fillOpacity="0.4" />
    </svg>
);

// PDF Icon
export const PdfIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6Z" fill="#ef4444" />
        <path d="M14 2V6C14 7.10457 14.8954 8 16 8H20L14 2Z" fill="#b91c1c" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="system-ui">PDF</text>
    </svg>
);

// Drive Icon
export const DriveIcon: FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="6" width="20" height="12" rx="2" fill="#475569" />
        <rect x="4" y="9" width="12" height="4" rx="1" fill="#94a3b8" />
        <circle cx="18" cy="14" r="2" fill="#22c55e" />
    </svg>
);

// Quick Access Icons
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
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const GridIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

export const ListIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M8 6H21M8 12H21M8 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="4" cy="6" r="1.5" fill="currentColor" />
        <circle cx="4" cy="12" r="1.5" fill="currentColor" />
        <circle cx="4" cy="18" r="1.5" fill="currentColor" />
    </svg>
);

export const RefreshIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 12C4 7.58172 7.58172 4 12 4C15.0736 4 17.7467 5.67113 19.2 8.16667M20 12C20 16.4183 16.4183 20 12 20C8.92636 20 6.25329 18.3289 4.8 15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 8H20V4M8 16H4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

export const NewFolderIcon: FC<IconProps> = ({ className = '', size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 7C3 5.34315 4.34315 4 6 4H10.1716C10.702 4 11.2107 4.21071 11.5858 4.58579L13 6H18C19.6569 6 21 7.34315 21 9V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V7Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 11V17M9 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Get icon based on extension
export const getFileIcon = (extension: string, isDir: boolean, size: number = 24) => {
    if (isDir) return <FolderIcon size={size} />;

    const ext = extension.toLowerCase();

    if (['pdf'].includes(ext)) return <PdfIcon size={size} />;
    if (['doc', 'docx', 'txt', 'rtf', 'md', 'odt'].includes(ext)) return <DocumentIcon size={size} />;
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp'].includes(ext)) return <ImageIcon size={size} />;
    if (['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv'].includes(ext)) return <VideoIcon size={size} />;
    if (['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac'].includes(ext)) return <AudioIcon size={size} />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <ArchiveIcon size={size} />;
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'rs', 'go', 'java', 'c', 'cpp', 'h', 'cs', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'toml', 'sh', 'ps1', 'bat'].includes(ext)) return <CodeIcon size={size} />;
    if (['exe', 'msi', 'dll'].includes(ext)) return <ExeIcon size={size} />;

    return <FileIcon size={size} />;
};

// Get quick access icon
export const getQuickAccessIcon = (name: string, size: number = 18): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
        'Desktop': <DesktopIcon size={size} />,
        'Downloads': <DownloadIcon size={size} />,
        'Documents': <DocumentsIcon size={size} />,
        'Pictures': <PicturesIcon size={size} />,
        'Music': <MusicIcon size={size} />,
        'Videos': <VideosIcon size={size} />,
    };
    return icons[name] || <FolderIcon size={size} />;
};
