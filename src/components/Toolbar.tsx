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
    PlusIcon,
    CutIcon,
    CopyIcon,
    PasteIcon,
    RenameIcon,
    DeleteIcon,
    NewFolderIcon,
    MoreIcon
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

interface ToolbarButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    danger?: boolean;
}

const ToolbarButton: FC<ToolbarButtonProps> = ({ icon, label, onClick, disabled, danger }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] transition-all duration-100
      ${disabled
                ? 'opacity-40 cursor-not-allowed'
                : danger
                    ? 'hover:bg-red-500/10 text-[var(--color-danger)]'
                    : 'hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-primary)]'
            }`}
        title={label}
    >
        {icon}
        <span className="text-[11px]">{label}</span>
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

    // Parse breadcrumbs from path
    const breadcrumbs = currentPath.split('\\').filter(Boolean);

    return (
        <header className="bg-[var(--color-bg-card)] border-b border-[var(--color-border)]">
            {/* Navigation row */}
            <div className="h-11 flex items-center gap-1 px-2">
                {/* Navigation buttons */}
                <div className="flex items-center">
                    <button
                        onClick={onBack}
                        disabled={!canGoBack}
                        className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-card-hover)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Back (Alt+Left)"
                    >
                        <ChevronLeftIcon size={16} />
                    </button>
                    <button
                        onClick={onForward}
                        disabled={!canGoForward}
                        className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-card-hover)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Forward (Alt+Right)"
                    >
                        <ChevronRightIcon size={16} />
                    </button>
                    <button
                        onClick={onUp}
                        className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-card-hover)] transition-colors"
                        title="Up (Alt+Up)"
                    >
                        <ChevronUpIcon size={16} />
                    </button>
                    <button
                        onClick={onRefresh}
                        className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-card-hover)] transition-colors"
                        title="Refresh (F5)"
                    >
                        <RefreshIcon size={16} />
                    </button>
                </div>

                {/* Breadcrumb / Path bar */}
                <div className="flex-1 min-w-0 mx-2">
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
                                className="w-full h-8 px-3 text-[13px] bg-[var(--color-bg-mica)] border border-[var(--color-accent)] 
                  rounded-[var(--radius-md)] outline-none text-[var(--color-text-primary)]"
                                autoFocus
                                spellCheck={false}
                            />
                        </form>
                    ) : (
                        <div
                            onClick={() => setIsEditing(true)}
                            className="h-8 flex items-center gap-1 px-2 bg-[var(--color-bg-mica)] rounded-[var(--radius-md)] 
                border border-[var(--color-border)] hover:border-[var(--color-border-hover)] cursor-text transition-colors"
                        >
                            {breadcrumbs.map((segment, index) => (
                                <div key={index} className="flex items-center">
                                    {index > 0 && <ChevronRightIcon size={14} className="mx-0.5 text-[var(--color-text-tertiary)]" />}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const path = breadcrumbs.slice(0, index + 1).join('\\') + '\\';
                                            onNavigate(path);
                                        }}
                                        className="px-1.5 py-0.5 text-[13px] rounded hover:bg-[var(--color-bg-card-hover)] transition-colors"
                                    >
                                        {segment}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="relative w-56">
                    <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search"
                        className="w-full h-8 pl-9 pr-3 text-[13px] bg-[var(--color-bg-mica)] border border-[var(--color-border)] 
              rounded-[var(--radius-md)] outline-none transition-colors
              focus:border-[var(--color-accent)]
              text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
                    />
                </div>
            </div>

            {/* Command bar */}
            <div className="h-14 flex items-center gap-1 px-2 border-t border-[var(--color-divider)]">
                {/* New button with dropdown style */}
                <button
                    onClick={onNewFolder}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-card-hover)] transition-colors"
                >
                    <PlusIcon size={16} />
                    <span className="text-[13px]">New</span>
                    <ChevronRightIcon size={12} className="rotate-90 ml-1 text-[var(--color-text-tertiary)]" />
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-[var(--color-divider)] mx-1" />

                {/* File operations */}
                <ToolbarButton icon={<CutIcon size={18} />} label="Cut" onClick={onCut} disabled={!hasSelection} />
                <ToolbarButton icon={<CopyIcon size={18} />} label="Copy" onClick={onCopy} disabled={!hasSelection} />
                <ToolbarButton icon={<PasteIcon size={18} />} label="Paste" onClick={onPaste} disabled={!hasClipboard} />
                <ToolbarButton icon={<RenameIcon size={18} />} label="Rename" onClick={onRename} disabled={!hasSelection} />
                <ToolbarButton icon={<DeleteIcon size={18} />} label="Delete" onClick={onDelete} disabled={!hasSelection} danger />

                {/* Spacer */}
                <div className="flex-1" />

                {/* View options */}
                <div className="flex items-center gap-1 px-2">
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-2 rounded-[var(--radius-md)] transition-colors ${viewMode === 'list'
                                ? 'bg-[var(--color-bg-selected)] text-[var(--color-accent)]'
                                : 'hover:bg-[var(--color-bg-card-hover)]'
                            }`}
                        title="Details view"
                    >
                        <ListIcon size={18} />
                    </button>
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-2 rounded-[var(--radius-md)] transition-colors ${viewMode === 'grid'
                                ? 'bg-[var(--color-bg-selected)] text-[var(--color-accent)]'
                                : 'hover:bg-[var(--color-bg-card-hover)]'
                            }`}
                        title="Grid view"
                    >
                        <GridIcon size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};
