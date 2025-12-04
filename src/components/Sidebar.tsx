import { FC } from 'react';
import { FileEntry, DriveInfo } from '../types';
import { DriveIcon, getQuickAccessIcon } from '../utils/icons';

interface SidebarProps {
    drives: DriveInfo[];
    quickAccess: FileEntry[];
    currentPath: string;
    onNavigate: (path: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({ drives, quickAccess, currentPath, onNavigate }) => {
    return (
        <aside className="w-48 flex-shrink-0 bg-[var(--color-bg-surface)] flex flex-col overflow-hidden border-r border-[var(--color-border)]">
            {/* Favorites */}
            <div className="py-3 px-1">
                <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Favorites
                </div>
                <nav className="mt-1">
                    {quickAccess.map((folder) => {
                        const isActive = currentPath === folder.path;
                        return (
                            <button
                                key={folder.path}
                                onClick={() => onNavigate(folder.path)}
                                className={`sidebar-link relative w-full flex items-center gap-3 px-3 py-1.5 text-[13px] transition-all
                  ${isActive
                                        ? 'active'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                                    }`}
                            >
                                <span className="w-4 flex justify-center">
                                    {getQuickAccessIcon(folder.name, 16)}
                                </span>
                                <span className="truncate">{folder.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-border)] mx-3" />

            {/* This PC */}
            <div className="py-3 px-1 flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    This PC
                </div>
                <nav className="mt-1">
                    {drives.map((drive) => {
                        const isActive = currentPath.toLowerCase().startsWith(drive.path.toLowerCase());
                        const letter = drive.path.charAt(0);
                        return (
                            <button
                                key={drive.path}
                                onClick={() => onNavigate(drive.path)}
                                className={`sidebar-link relative w-full flex items-center gap-3 px-3 py-1.5 text-[13px] transition-all
                  ${isActive
                                        ? 'active'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                                    }`}
                            >
                                <span className="w-4 flex justify-center">
                                    <DriveIcon size={16} />
                                </span>
                                <span className="truncate">Local Disk ({letter}:)</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};
