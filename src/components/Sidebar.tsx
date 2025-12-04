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
        <aside className="w-52 flex-shrink-0 bg-[var(--color-bg-card)] flex flex-col overflow-hidden border-r border-[var(--color-border)]">
            {/* Quick Access */}
            <div className="py-2 px-2">
                <h2 className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider px-3 py-2">
                    Quick Access
                </h2>
                <nav className="space-y-0.5">
                    {quickAccess.map((folder) => {
                        const isActive = currentPath === folder.path;
                        return (
                            <button
                                key={folder.path}
                                onClick={() => onNavigate(folder.path)}
                                className={`w-full flex items-center gap-3 px-3 py-[6px] rounded-[var(--radius-md)] text-[13px] transition-all duration-100
                  ${isActive
                                        ? 'bg-[var(--color-bg-selected)] text-[var(--color-accent)]'
                                        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)]'
                                    }`}
                            >
                                <span className={isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}>
                                    {getQuickAccessIcon(folder.name, 18)}
                                </span>
                                <span className="truncate">{folder.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-divider)] mx-4 my-1" />

            {/* This PC section */}
            <div className="py-2 px-2 flex-1 overflow-y-auto">
                <h2 className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider px-3 py-2">
                    This PC
                </h2>
                <nav className="space-y-0.5">
                    {drives.map((drive) => {
                        const isActive = currentPath.toLowerCase().startsWith(drive.path.toLowerCase());
                        return (
                            <button
                                key={drive.path}
                                onClick={() => onNavigate(drive.path)}
                                className={`w-full flex items-center gap-3 px-3 py-[6px] rounded-[var(--radius-md)] text-[13px] transition-all duration-100
                  ${isActive
                                        ? 'bg-[var(--color-bg-selected)] text-[var(--color-accent)]'
                                        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)]'
                                    }`}
                            >
                                <DriveIcon size={18} />
                                <span className="truncate">{drive.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};
