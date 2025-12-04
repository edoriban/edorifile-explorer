import { FC } from 'react';
import { FileEntry } from '../types';
import { getFileIcon } from '../utils/icons';
import { formatSize, getFileType } from '../utils/format';

interface FileListProps {
    files: FileEntry[];
    selectedPath: string | null;
    onSelect: (file: FileEntry) => void;
    onOpen: (file: FileEntry) => void;
}

export const FileList: FC<FileListProps> = ({ files, selectedPath, onSelect, onOpen }) => {
    if (files.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-[var(--color-text-tertiary)]">
                <div className="text-center">
                    <p className="text-lg">This folder is empty</p>
                    <p className="text-sm mt-1">No files or folders to display</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 grid grid-cols-[1fr_120px_180px_100px] gap-4 px-4 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
                <div>Name</div>
                <div>Type</div>
                <div>Date Modified</div>
                <div className="text-right">Size</div>
            </div>

            {/* File rows */}
            <div className="divide-y divide-[var(--color-border)]">
                {files.map((file) => (
                    <button
                        key={file.path}
                        onClick={() => onSelect(file)}
                        onDoubleClick={() => onOpen(file)}
                        className={`w-full grid grid-cols-[1fr_120px_180px_100px] gap-4 px-4 py-2 items-center text-left transition-colors duration-150
              ${selectedPath === file.path
                                ? 'bg-[var(--color-bg-selected)]'
                                : 'hover:bg-[var(--color-bg-hover)]'
                            }`}
                    >
                        {/* Name */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex-shrink-0">
                                {getFileIcon(file.extension, file.is_dir, 20)}
                            </div>
                            <span className="truncate text-sm" title={file.name}>
                                {file.name}
                            </span>
                        </div>

                        {/* Type */}
                        <div className="text-sm text-[var(--color-text-secondary)] truncate">
                            {getFileType(file.extension, file.is_dir)}
                        </div>

                        {/* Date modified */}
                        <div className="text-sm text-[var(--color-text-secondary)]">
                            {file.modified || '-'}
                        </div>

                        {/* Size */}
                        <div className="text-sm text-[var(--color-text-secondary)] text-right">
                            {file.is_dir ? '-' : formatSize(file.size)}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
