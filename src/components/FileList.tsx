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
            <div className="flex-1 flex items-center justify-center text-[var(--color-text-tertiary)]">
                <div className="text-center">
                    <p className="text-base">This folder is empty</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 grid grid-cols-[1fr_140px_140px_100px] gap-2 px-4 py-2 bg-[var(--color-bg-mica)] border-b border-[var(--color-divider)] text-[12px] text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-1">
                    Name
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="ml-1">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div>Date modified</div>
                <div>Type</div>
                <div className="text-right">Size</div>
            </div>

            {/* File rows */}
            <div>
                {files.map((file) => {
                    const isSelected = selectedPath === file.path;
                    return (
                        <button
                            key={file.path}
                            onClick={() => onSelect(file)}
                            onDoubleClick={() => onOpen(file)}
                            onContextMenu={(e) => onContextMenu(e, file)}
                            className={`w-full grid grid-cols-[1fr_140px_140px_100px] gap-2 px-4 py-1.5 items-center text-left transition-colors duration-75
                ${isSelected
                                    ? 'bg-[var(--color-bg-selected)]'
                                    : 'hover:bg-[var(--color-bg-card-hover)]'
                                }`}
                        >
                            {/* Name */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex-shrink-0">
                                    {getFileIcon(file.extension, file.is_dir, 20)}
                                </div>
                                <span className="truncate text-[13px]" title={file.name}>
                                    {file.name}
                                </span>
                            </div>

                            {/* Date modified */}
                            <div className="text-[12px] text-[var(--color-text-secondary)]">
                                {file.modified || '-'}
                            </div>

                            {/* Type */}
                            <div className="text-[12px] text-[var(--color-text-secondary)] truncate">
                                {getFileType(file.extension, file.is_dir)}
                            </div>

                            {/* Size */}
                            <div className="text-[12px] text-[var(--color-text-secondary)] text-right">
                                {file.is_dir ? '' : formatSize(file.size)}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
