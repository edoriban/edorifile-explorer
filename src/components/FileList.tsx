import { FC } from 'react';
import { FileEntry } from '../types';
import { getFileIcon } from '../utils/icons';
import { formatSize, getFileType } from '../utils/format';

interface FileListProps {
    files: FileEntry[];
    selectedPath: string | null;
    onSelect: (file: FileEntry) => void;
    onOpen: (file: FileEntry) => void;
    onContextMenu: (e: React.MouseEvent, file: FileEntry) => void;
}

export const FileList: FC<FileListProps> = ({ files, selectedPath, onSelect, onOpen, onContextMenu }) => {
    if (files.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-[var(--color-text-muted)]">
                <div className="text-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 opacity-50">
                        <path d="M3 7C3 5.34315 4.34315 4 6 4H10.1716C10.702 4 11.2107 4.21071 11.5858 4.58579L13 6H18C19.6569 6 21 7.34315 21 9V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V7Z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <p className="text-sm">This folder is empty</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 grid grid-cols-[1fr_130px_130px_90px] gap-3 px-4 py-2 bg-[var(--color-bg-surface)] border-b border-[var(--color-divider)] text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider z-10">
                <div>Name</div>
                <div>Modified</div>
                <div>Type</div>
                <div className="text-right">Size</div>
            </div>

            {/* File rows */}
            <div className="py-1">
                {files.map((file) => {
                    const isSelected = selectedPath === file.path;
                    return (
                        <button
                            key={file.path}
                            onClick={() => onSelect(file)}
                            onDoubleClick={() => onOpen(file)}
                            onContextMenu={(e) => onContextMenu(e, file)}
                            className={`file-item w-full grid grid-cols-[1fr_130px_130px_90px] gap-3 px-4 py-2 items-center text-left transition-all duration-100
                ${isSelected
                                    ? 'bg-[var(--color-bg-selected)]'
                                    : 'hover:bg-[var(--color-bg-hover)]'
                                }`}
                        >
                            {/* Name */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex-shrink-0 icon-glow">
                                    {getFileIcon(file.extension, file.is_dir, 18)}
                                </div>
                                <span
                                    className={`truncate text-[13px] ${isSelected ? 'text-[var(--color-accent)]' : ''}`}
                                    title={file.name}
                                >
                                    {file.name}
                                </span>
                            </div>

                            {/* Date modified */}
                            <div className="text-[12px] text-[var(--color-text-muted)]">
                                {file.modified || '-'}
                            </div>

                            {/* Type */}
                            <div className="text-[12px] text-[var(--color-text-muted)] truncate">
                                {getFileType(file.extension, file.is_dir)}
                            </div>

                            {/* Size */}
                            <div className="text-[12px] text-[var(--color-text-muted)] text-right">
                                {file.is_dir ? '-' : formatSize(file.size)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
