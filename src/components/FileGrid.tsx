import { FC } from 'react';
import { FileEntry } from '../types';
import { getFileIcon } from '../utils/icons';

interface FileGridProps {
    files: FileEntry[];
    selectedPath: string | null;
    onSelect: (file: FileEntry) => void;
    onOpen: (file: FileEntry) => void;
}

export const FileGrid: FC<FileGridProps> = ({ files, selectedPath, onSelect, onOpen }) => {
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
        <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
                {files.map((file) => (
                    <button
                        key={file.path}
                        onClick={() => onSelect(file)}
                        onDoubleClick={() => onOpen(file)}
                        className={`flex flex-col items-center p-3 rounded-lg transition-all duration-150 cursor-pointer
              ${selectedPath === file.path
                                ? 'bg-[var(--color-bg-selected)] ring-1 ring-[var(--color-accent)]'
                                : 'hover:bg-[var(--color-bg-hover)]'
                            }`}
                    >
                        <div className="w-12 h-12 flex items-center justify-center mb-2">
                            {getFileIcon(file.extension, file.is_dir, 48)}
                        </div>
                        <span
                            className="text-xs text-center w-full truncate-name leading-tight px-1"
                            title={file.name}
                        >
                            {file.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
