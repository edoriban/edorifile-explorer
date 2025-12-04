import { FC } from 'react';
import { FileEntry, DriveInfo } from '../types';
import { FolderIcon, DriveIcon } from '../utils/icons';

interface SidebarProps {
    drives: DriveInfo[];
    quickAccess: FileEntry[];
    currentPath: string;
    onNavigate: (path: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({ drives, quickAccess, currentPath, onNavigate }) => {
    return (
        <aside className="w-56 flex-shrink-0 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] flex flex-col overflow-hidden">
            {/* Quick Access */}
            <div className="p-3">
                <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2 px-2">
                    Quick Access
                </h2>
                <nav className="space-y-0.5">
                    {quickAccess.map((folder) => (
                        <button
                            key={folder.path}
                            onClick={() => onNavigate(folder.path)}
                            className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors duration-150
                ${currentPath === folder.path
                                    ? 'bg-[var(--color-bg-selected)] text-[var(--color-accent)]'
                                    : 'hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]'
                                }`}
                        >
                            <FolderIcon size={18} />
                            <span className="truncate">{folder.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Separator */}
            <div className="h-px bg-[var(--color-border)] mx-3" />

            {/* Drives */}
            <div className="p-3 flex-1 overflow-y-auto">
                <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2 px-2">
                    This PC
                </h2>
                <nav className="space-y-0.5">
                    {drives.map((drive) => (
                        <button
                            key={drive.path}
                            onClick={() => onNavigate(drive.path)}
                            className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors duration-150
                ${currentPath.startsWith(drive.path)
                                    ? 'bg-[var(--color-bg-selected)] text-[var(--color-accent)]'
                                    : 'hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]'
                                }`}
                        >
                            <DriveIcon size={18} />
                            <span className="truncate">{drive.name}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};
