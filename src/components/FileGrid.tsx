import { FC } from 'react';
import { FileEntry } from '../types';
import { getFileIcon } from '../utils/icons';

interface FileGridProps {
    files: FileEntry[];
    selectedPath: string | null;
    onSelect: (file: FileEntry) => void;
    onOpen: (file: FileEntry) => void;
    onContextMenu: (e: React.MouseEvent, file: FileEntry) => void;
}

export const FileGrid: FC<FileGridProps> = ({ files, selectedPath, onSelect, onOpen, onContextMenu }) => {
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
        <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-1">
                {files.map((file) => {
                    const isSelected = selectedPath === file.path;
                    return (
                        <button
                            key={file.path}
                            onClick={() => onSelect(file)}
                            onDoubleClick={() => onOpen(file)}
                            onContextMenu={(e) => onContextMenu(e, file)}
                            className={`flex flex-col items-center p-2 rounded-[var(--radius-md)] transition-all duration-75 cursor-pointer
                ${isSelected
                                    ? 'bg-[var(--color-bg-selected)] ring-1 ring-[var(--color-accent)]/30'
                                    : 'hover:bg-[var(--color-bg-card-hover)]'
                                }`}
                        >
                            <div className="w-12 h-12 flex items-center justify-center mb-1">
                                {getFileIcon(file.extension, file.is_dir, 48)}
                            </div>
                            <span
                                className="text-[12px] text-center w-full px-1 leading-tight line-clamp-2"
                                title={file.name}
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {file.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
