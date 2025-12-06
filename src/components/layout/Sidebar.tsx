import { FC } from 'react';
import type { FileEntry, DriveInfo } from '@types';
import { DriveIcon, getQuickAccessIcon } from '@utils/icons';

interface SidebarProps {
    drives: DriveInfo[];
    quickAccess: FileEntry[];
    currentPath: string;
    onNavigate: (path: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({ drives, quickAccess, currentPath, onNavigate }) => {
    return (
        <aside className="w-56 flex-shrink-0 sidebar flex flex-col overflow-hidden">
            {/* Favorites */}
            <div className="py-2 px-2">
                <div className="px-4 py-2 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Favorites
                </div>
                <nav className="space-y-0.5">
                    {quickAccess.map((folder) => {
                        const isActive = currentPath === folder.path;
                        return (
                            <button
                                key={folder.path}
                                onClick={() => onNavigate(folder.path)}
                                className={`sidebar-item w-full relative ${isActive ? 'active' : ''}`}
                                title={folder.path}
                            >
                                <span className="w-5 flex justify-center flex-shrink-0">
                                    {getQuickAccessIcon(folder.name, 18)}
                                </span>
                                <span className="truncate font-medium">{folder.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-border)] mx-4 my-2 opacity-50" />

            {/* This PC */}
            <div className="py-2 px-2 flex-1 overflow-y-auto">
                <div className="px-4 py-2 text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    This PC
                </div>
                <nav className="space-y-0.5">
                    {drives.map((drive) => {
                        const isActive = currentPath.toLowerCase().startsWith(drive.path.toLowerCase());
                        const letter = drive.path.charAt(0);
                        return (
                            <button
                                key={drive.path}
                                onClick={() => onNavigate(drive.path)}
                                className={`sidebar-item w-full relative ${isActive ? 'active' : ''}`}
                                title={drive.path}
                            >
                                <span className="w-5 flex justify-center flex-shrink-0">
                                    <DriveIcon size={18} />
                                </span>
                                <span className="truncate font-medium">Local Disk ({letter}:)</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};
