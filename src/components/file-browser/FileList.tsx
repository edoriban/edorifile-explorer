import { FC, useMemo } from 'react';
import type { FileEntry, SortBy, SortOrder } from '@types';
import { getFileIcon } from '@utils/icons';
import { formatSize, getFileType } from '@utils/format';

interface FileListProps {
    files: FileEntry[];
    selectedPath: string | null;
    sortBy: SortBy;
    sortOrder: SortOrder;
    onSort: (column: SortBy) => void;
    onSelect: (file: FileEntry) => void;
    onOpen: (file: FileEntry) => void;
    onContextMenu: (e: React.MouseEvent, file: FileEntry) => void;
}

// Flecha indicadora de ordenación
const SortArrow: FC<{ direction: SortOrder }> = ({ direction }) => (
    <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="ml-1 opacity-70"
    >
        <path d={direction === 'asc' ? 'M7 14l5-5 5 5H7z' : 'M7 10l5 5 5-5H7z'} />
    </svg>
);

// Header de columna clickeable
const ColumnHeader: FC<{
    label: string;
    column: SortBy;
    currentSort: SortBy;
    sortOrder: SortOrder;
    onClick: () => void;
    className?: string;
}> = ({ label, column, currentSort, sortOrder, onClick, className = '' }) => {
    const isActive = currentSort === column;

    return (
        <button
            onClick={onClick}
            className={`flex items-center text-left hover:text-[var(--color-text-primary)] transition-colors cursor-pointer select-none ${className} ${isActive ? 'text-[var(--color-text-primary)]' : ''}`}
        >
            {label}
            {isActive && <SortArrow direction={sortOrder} />}
        </button>
    );
};

export const FileList: FC<FileListProps> = ({
    files,
    selectedPath,
    sortBy,
    sortOrder,
    onSort,
    onSelect,
    onOpen,
    onContextMenu
}) => {
    // Ordenar archivos con memoización para evitar re-ordenar innecesariamente
    const sortedFiles = useMemo(() => {
        return [...files].sort((a, b) => {
            // Carpetas siempre primero
            if (a.is_dir !== b.is_dir) return a.is_dir ? -1 : 1;

            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
                    break;
                case 'date':
                    comparison = (a.modified || '').localeCompare(b.modified || '');
                    break;
                case 'size':
                    comparison = a.size - b.size;
                    break;
                case 'type':
                    const typeA = getFileType(a.extension, a.is_dir);
                    const typeB = getFileType(b.extension, b.is_dir);
                    comparison = typeA.localeCompare(typeB);
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [files, sortBy, sortOrder]);

    if (files.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-[var(--color-text-muted)]">
                <div className="text-center">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-3 opacity-40">
                        <path d="M8 12C8 9.79 9.79 8 12 8H20.69C21.75 8 22.77 8.42 23.52 9.17L26 12H36C38.21 12 40 13.79 40 16V36C40 38.21 38.21 40 36 40H12C9.79 40 8 38.21 8 36V12Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <p className="text-sm">This folder is empty</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header con columnas clickeables */}
            <div className="sticky top-0 z-10 grid grid-cols-[1fr_150px_150px_100px] gap-4 px-6 py-2 bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                <ColumnHeader
                    label="Name"
                    column="name"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onClick={() => onSort('name')}
                    className="pl-8"
                />
                <ColumnHeader
                    label="Modified"
                    column="date"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onClick={() => onSort('date')}
                />
                <ColumnHeader
                    label="Type"
                    column="type"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onClick={() => onSort('type')}
                />
                <ColumnHeader
                    label="Size"
                    column="size"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onClick={() => onSort('size')}
                    className="justify-end pr-2"
                />
            </div>

            {/* Rows */}
            <div>
                {sortedFiles.map((file) => {
                    const isSelected = selectedPath === file.path;
                    return (
                        <button
                            key={file.path}
                            onClick={() => onSelect(file)}
                            onDoubleClick={() => onOpen(file)}
                            onContextMenu={(e) => onContextMenu(e, file)}
                            className={`file-row w-full grid grid-cols-[1fr_150px_150px_100px] gap-4 px-6 py-2 items-center text-left transition-colors
                ${isSelected ? 'selected' : 'hover:bg-[var(--color-bg-hover)]'}`}
                        >
                            {/* Name with icon */}
                            <div className="flex items-center gap-3 min-w-0 pl-1">
                                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                    {getFileIcon(file.extension, file.is_dir, 20)}
                                </div>
                                <span
                                    className={`truncate text-[13px] ${isSelected ? 'text-[var(--color-accent)]' : ''}`}
                                    title={file.name}
                                >
                                    {file.name}
                                </span>
                            </div>

                            {/* Modified */}
                            <div className="text-[12px] text-[var(--color-text-secondary)]">
                                {file.modified || '-'}
                            </div>

                            {/* Type */}
                            <div className="text-[12px] text-[var(--color-text-secondary)] truncate">
                                {getFileType(file.extension, file.is_dir)}
                            </div>

                            {/* Size */}
                            <div className="text-[12px] text-[var(--color-text-secondary)] text-right pr-2">
                                {file.is_dir ? '-' : formatSize(file.size)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
