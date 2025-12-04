import { FC, useState, useEffect, useRef } from 'react';
import { ViewMode } from '../types';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    SearchIcon,
    GridIcon,
    ListIcon,
    RefreshIcon,
    CutIcon,
    CopyIcon,
    PasteIcon,
    RenameIcon,
    DeleteIcon,
    NewFolderIcon
} from '../utils/icons';

interface ToolbarProps {
    currentPath: string;
    canGoBack: boolean;
    canGoForward: boolean;
    viewMode: ViewMode;
    searchQuery: string;
    hasSelection: boolean;
    hasClipboard: boolean;
    onBack: () => void;
    onForward: () => void;
    onUp: () => void;
    onRefresh: () => void;
    onNavigate: (path: string) => void;
    onViewModeChange: (mode: ViewMode) => void;
    onSearchChange: (query: string) => void;
    onNewFolder: () => void;
    onCut: () => void;
    onCopy: () => void;
    onPaste: () => void;
    onRename: () => void;
    onDelete: () => void;
}

interface NavButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    title: string;
}

const NavButton: FC<NavButtonProps> = ({ icon, onClick, disabled, title }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] 
      text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
      hover:bg-[var(--color-bg-hover)] disabled:opacity-30 disabled:hover:bg-transparent 
      disabled:hover:text-[var(--color-text-secondary)] transition-all"
    >
        {icon}
    </button>
);

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    danger?: boolean;
}

const ActionButton: FC<ActionButtonProps> = ({ icon, label, onClick, disabled, danger }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={label}
        className={`px-2.5 py-1.5 flex items-center gap-2 rounded-[var(--radius-md)] text-[12px] transition-all
      ${disabled
                ? 'opacity-30 cursor-not-allowed'
                : danger
                    ? 'text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] hover:bg-[rgba(248,81,73,0.1)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-hover)]'
            }`}
    >
        {icon}
        <span className="hidden sm:inline">{label}</span>
    </button>
);

export const Toolbar: FC<ToolbarProps> = ({
    currentPath,
    canGoBack,
    canGoForward,
    viewMode,
    searchQuery,
    hasSelection,
    hasClipboard,
    onBack,
    onForward,
    onUp,
    onRefresh,
    onNavigate,
    onViewModeChange,
    onSearchChange,
    onNewFolder,
    onCut,
    onCopy,
    onPaste,
    onRename,
    onDelete,
}) => {
    const [pathInput, setPathInput] = useState(currentPath);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isEditing) {
            setPathInput(currentPath);
        }
    }, [currentPath, isEditing]);

    const handlePathSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pathInput.trim()) {
            onNavigate(pathInput.trim());
            setIsEditing(false);
        }
    };

    const handlePathKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setPathInput(currentPath);
            setIsEditing(false);
            inputRef.current?.blur();
        }
    };

    // Parse breadcrumbs
    const breadcrumbs = currentPath.split('\\').filter(Boolean);

    return (
        <header className="bg-[var(--color-bg-surface)] border-b border-[var(--color-border)]">
            {/* Main toolbar row */}
            <div className="h-11 flex items-center gap-2 px-3">
                {/* Navigation */}
                <div className="flex items-center gap-0.5">
                    <NavButton icon={<ChevronLeftIcon size={16} />} onClick={onBack} disabled={!canGoBack} title="Back" />
                    <NavButton icon={<ChevronRightIcon size={16} />} onClick={onForward} disabled={!canGoForward} title="Forward" />
                    <NavButton icon={<ChevronUpIcon size={16} />} onClick={onUp} title="Up" />
                    <NavButton icon={<RefreshIcon size={16} />} onClick={onRefresh} title="Refresh" />
                </div>

                {/* Separator */}
                <div className="w-px h-5 bg-[var(--color-divider)]" />

                {/* Breadcrumb / Path */}
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <form onSubmit={handlePathSubmit} className="w-full">
                            <input
                                ref={inputRef}
                                type="text"
                                value={pathInput}
                                onChange={(e) => setPathInput(e.target.value)}
                                onBlur={() => {
                                    setTimeout(() => {
                                        setIsEditing(false);
                                        setPathInput(currentPath);
                                    }, 150);
                                }}
                                onKeyDown={handlePathKeyDown}
                                className="w-full h-7 px-3 text-[13px] bg-[var(--color-bg-base)] border border-[var(--color-accent)] 
                  rounded-[var(--radius-md)] text-[var(--color-text-primary)]"
                                autoFocus
                                spellCheck={false}
                            />
                        </form>
                    ) : (
                        <div
                            onClick={() => setIsEditing(true)}
                            className="h-7 flex items-center gap-0.5 px-2 bg-[var(--color-bg-base)] rounded-[var(--radius-md)] 
                border border-[var(--color-border)] hover:border-[var(--color-border-hover)] 
                cursor-text transition-colors overflow-hidden"
                        >
                            {breadcrumbs.map((segment, index) => (
                                <div key={index} className="flex items-center flex-shrink-0">
                                    {index > 0 && (
                                        <ChevronRightIcon size={12} className="mx-0.5 text-[var(--color-text-muted)] flex-shrink-0" />
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const path = breadcrumbs.slice(0, index + 1).join('\\') + '\\';
                                            onNavigate(path);
                                        }}
                                        className="px-1.5 py-0.5 text-[12px] text-[var(--color-text-secondary)] rounded 
                      hover:text-[var(--color-accent)] hover:bg-[var(--color-bg-hover)] transition-colors"
                                    >
                                        {segment}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="relative w-48">
                    <SearchIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search..."
                        className="w-full h-7 pl-8 pr-3 text-[12px] bg-[var(--color-bg-base)] border border-[var(--color-border)] 
              rounded-[var(--radius-md)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
              focus:border-[var(--color-accent)] transition-colors"
                    />
                </div>
            </div>

            {/* Actions row */}
            <div className="h-9 flex items-center gap-1 px-3 border-t border-[var(--color-divider)]">
                {/* Create */}
                <ActionButton
                    icon={<NewFolderIcon size={15} />}
                    label="New Folder"
                    onClick={onNewFolder}
                />

                {/* Separator */}
                <div className="w-px h-4 bg-[var(--color-divider)] mx-1" />

                {/* Edit actions */}
                <ActionButton icon={<CutIcon size={15} />} label="Cut" onClick={onCut} disabled={!hasSelection} />
                <ActionButton icon={<CopyIcon size={15} />} label="Copy" onClick={onCopy} disabled={!hasSelection} />
                <ActionButton icon={<PasteIcon size={15} />} label="Paste" onClick={onPaste} disabled={!hasClipboard} />

                {/* Separator */}
                <div className="w-px h-4 bg-[var(--color-divider)] mx-1" />

                <ActionButton icon={<RenameIcon size={15} />} label="Rename" onClick={onRename} disabled={!hasSelection} />
                <ActionButton icon={<DeleteIcon size={15} />} label="Delete" onClick={onDelete} disabled={!hasSelection} danger />

                {/* Spacer */}
                <div className="flex-1" />

                {/* View toggle */}
                <div className="flex items-center gap-0.5 p-0.5 bg-[var(--color-bg-base)] rounded-[var(--radius-md)]">
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`w-7 h-6 flex items-center justify-center rounded transition-colors ${viewMode === 'list'
                                ? 'bg-[var(--color-bg-hover)] text-[var(--color-accent)]'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                            }`}
                        title="List view"
                    >
                        <ListIcon size={14} />
                    </button>
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`w-7 h-6 flex items-center justify-center rounded transition-colors ${viewMode === 'grid'
                                ? 'bg-[var(--color-bg-hover)] text-[var(--color-accent)]'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                            }`}
                        title="Grid view"
                    >
                        <GridIcon size={14} />
                    </button>
                </div>
            </div>
        </header>
    );
};
