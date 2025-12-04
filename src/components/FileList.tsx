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
            {/* Header */}
            <div className="sticky top-0 z-10 grid grid-cols-[1fr_150px_150px_100px] gap-4 px-4 py-2 bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                <div className="pl-1">Name</div>
                <div>Modified</div>
                <div>Type</div>
                <div className="text-right pr-2">Size</div>
            </div>

            {/* Rows */}
            <div>
                {files.map((file) => {
                    const isSelected = selectedPath === file.path;
                    return (
                        <button
                            key={file.path}
                            onClick={() => onSelect(file)}
                            onDoubleClick={() => onOpen(file)}
                            onContextMenu={(e) => onContextMenu(e, file)}
                            className={`file-row w-full grid grid-cols-[1fr_150px_150px_100px] gap-4 px-4 py-2 items-center text-left transition-colors
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
