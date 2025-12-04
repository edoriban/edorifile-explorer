import { FC } from 'react';
import { FileEntry, DriveInfo } from '../types';
import { DriveIcon, getQuickAccessIcon, FolderIcon } from '../utils/icons';

interface SidebarProps {
    drives: DriveInfo[];
    quickAccess: FileEntry[];
    currentPath: string;
    onNavigate: (path: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({ drives, quickAccess, currentPath, onNavigate }) => {
    return (
        <aside className="w-48 flex-shrink-0 bg-[var(--color-bg-surface)] flex flex-col overflow-hidden border-r border-[var(--color-border)]">
            {/* Quick Access */}
            <div className="py-3 px-2">
                <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Favorites
                </div>
                <nav className="mt-1 space-y-0.5">
                    {quickAccess.map((folder) => {
                        const isActive = currentPath === folder.path;
                        return (
                            <button
                                key={folder.path}
                                onClick={() => onNavigate(folder.path)}
                                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-[var(--radius-md)] text-[13px] transition-all duration-100
                  ${isActive
                                        ? 'bg-[var(--color-bg-selected)] text-[var(--color-accent)]'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                                    }`}
                            >
                                <span className={`flex-shrink-0 ${isActive ? 'text-[var(--color-accent)]' : ''}`}>
                                    {getQuickAccessIcon(folder.name, 16)}
                                </span>
                                <span className="truncate">{folder.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-divider)] mx-3" />

            {/* This PC */}
            <div className="py-3 px-2 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 px-3 py-1 text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 21H16M12 17V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    This PC
                </div>
                <nav className="mt-1 space-y-0.5">
                    {drives.map((drive) => {
                        const isActive = currentPath.toLowerCase().startsWith(drive.path.toLowerCase());
                        // Extract drive letter
                        const driveLetter = drive.path.charAt(0);
                        return (
                            <button
                                key={drive.path}
                                onClick={() => onNavigate(drive.path)}
                                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-[var(--radius-md)] text-[13px] transition-all duration-100
                  ${isActive
                                        ? 'bg-[var(--color-bg-selected)] text-[var(--color-accent)]'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                                    }`}
                            >
                                <DriveIcon size={16} />
                                <span className="truncate">
                                    {drive.name.includes('(') ? drive.name : `${driveLetter}: Drive`}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};
