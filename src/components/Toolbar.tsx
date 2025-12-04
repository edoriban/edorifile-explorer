import { FC, useState, useEffect, useRef } from 'react';
import { ViewMode } from '../types';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    SearchIcon,
    GridIcon,
    ListIcon,
    RefreshIcon
} from '../utils/icons';

interface ToolbarProps {
    currentPath: string;
    canGoBack: boolean;
    canGoForward: boolean;
    viewMode: ViewMode;
    searchQuery: string;
    onBack: () => void;
    onForward: () => void;
    onUp: () => void;
    onRefresh: () => void;
    onNavigate: (path: string) => void;
    onViewModeChange: (mode: ViewMode) => void;
    onSearchChange: (query: string) => void;
}

export const Toolbar: FC<ToolbarProps> = ({
    currentPath,
    canGoBack,
    canGoForward,
    viewMode,
    searchQuery,
    onBack,
    onForward,
    onUp,
    onRefresh,
    onNavigate,
    onViewModeChange,
    onSearchChange,
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

    return (
        <header className="h-12 flex items-center gap-2 px-3 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
            {/* Navigation buttons */}
            <div className="flex items-center gap-1">
                <button
                    onClick={onBack}
                    disabled={!canGoBack}
                    className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Back"
                >
                    <ChevronLeftIcon size={18} />
                </button>
                <button
                    onClick={onForward}
                    disabled={!canGoForward}
                    className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Forward"
                >
                    <ChevronRightIcon size={18} />
                </button>
                <button
                    onClick={onUp}
                    className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] transition-colors"
                    title="Up one level"
                >
                    <ChevronUpIcon size={18} />
                </button>
                <button
                    onClick={onRefresh}
                    className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] transition-colors"
                    title="Refresh"
                >
                    <RefreshIcon size={16} />
                </button>
            </div>

            {/* Path bar */}
            <form onSubmit={handlePathSubmit} className="flex-1 min-w-0">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={pathInput}
                        onChange={(e) => setPathInput(e.target.value)}
                        onFocus={() => setIsEditing(true)}
                        onBlur={() => {
                            setTimeout(() => {
                                setIsEditing(false);
                                setPathInput(currentPath);
                            }, 150);
                        }}
                        onKeyDown={handlePathKeyDown}
                        className="w-full h-8 px-3 text-sm bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] 
              rounded-md outline-none transition-colors
              focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]
              text-[var(--color-text-primary)]"
                        spellCheck={false}
                    />
                </div>
            </form>

            {/* Search */}
            <div className="relative w-56">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search files..."
                    className="w-full h-8 pl-9 pr-3 text-sm bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] 
            rounded-md outline-none transition-colors
            focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]
            text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
                />
            </div>

            {/* View mode toggle */}
            <div className="flex items-center bg-[var(--color-bg-tertiary)] rounded-md border border-[var(--color-border)]">
                <button
                    onClick={() => onViewModeChange('grid')}
                    className={`p-1.5 rounded-l-md transition-colors ${viewMode === 'grid'
                            ? 'bg-[var(--color-bg-selected)] text-[var(--color-accent)]'
                            : 'hover:bg-[var(--color-bg-hover)]'
                        }`}
                    title="Grid view"
                >
                    <GridIcon size={18} />
                </button>
                <button
                    onClick={() => onViewModeChange('list')}
                    className={`p-1.5 rounded-r-md transition-colors ${viewMode === 'list'
                            ? 'bg-[var(--color-bg-selected)] text-[var(--color-accent)]'
                            : 'hover:bg-[var(--color-bg-hover)]'
                        }`}
                    title="List view"
                >
                    <ListIcon size={18} />
                </button>
            </div>
        </header>
    );
};
