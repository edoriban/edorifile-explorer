// PropertiesDialog component - displays file/folder properties
// Refactored to use fileService (Dependency Inversion Principle)

import { FC, useEffect, useState } from 'react';
import { fileService, type FileProperties } from '../../services';
import type { FileEntry } from '../../types';
import { getFileIcon } from '../../utils/icons';
import { formatSize, getFileType } from '../../utils/format';

interface PropertiesDialogProps {
    file: FileEntry;
    onClose: () => void;
}

export const PropertiesDialog: FC<PropertiesDialogProps> = ({ file, onClose }) => {
    const [properties, setProperties] = useState<FileProperties | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const props = await fileService.getFileProperties(file.path);
                setProperties(props);
            } catch (err) {
                console.error('Failed to get properties:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, [file.path]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog w-[380px]" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 flex items-center justify-center">
                        {getFileIcon(file.extension, file.is_dir, 48)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold truncate" title={file.name}>{file.name}</h2>
                        <p className="text-[13px] text-[var(--color-text-secondary)]">{getFileType(file.extension, file.is_dir)}</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--color-border)] mb-4" />

                {/* Properties Grid */}
                <div className="space-y-3 text-[13px]">
                    <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="text-[var(--color-text-muted)]">Type:</span>
                        <span className="text-[var(--color-text-primary)]">{getFileType(file.extension, file.is_dir)}</span>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="text-[var(--color-text-muted)]">Location:</span>
                        <span className="text-[var(--color-text-primary)] truncate" title={file.path}>{file.path}</span>
                    </div>

                    <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="text-[var(--color-text-muted)]">Size:</span>
                        <span className="text-[var(--color-text-primary)]">
                            {file.is_dir ? '-' : formatSize(file.size)}
                            {!file.is_dir && <span className="text-[var(--color-text-muted)] ml-1">({file.size.toLocaleString()} bytes)</span>}
                        </span>
                    </div>

                    <div className="h-px bg-[var(--color-border)] my-2" />

                    {isLoading ? (
                        <div className="py-4 text-center text-[var(--color-text-muted)]">Loading details...</div>
                    ) : properties ? (
                        <>
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="text-[var(--color-text-muted)]">Created:</span>
                                <span className="text-[var(--color-text-primary)]">{properties.created}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="text-[var(--color-text-muted)]">Modified:</span>
                                <span className="text-[var(--color-text-primary)]">{properties.modified}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr] gap-2">
                                <span className="text-[var(--color-text-muted)]">Accessed:</span>
                                <span className="text-[var(--color-text-primary)]">{properties.accessed}</span>
                            </div>

                            <div className="h-px bg-[var(--color-border)] my-2" />

                            <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                                <span className="text-[var(--color-text-muted)]">Attributes:</span>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-not-allowed opacity-80">
                                        <input type="checkbox" checked={properties.readonly} readOnly className="accent-[var(--color-accent)]" />
                                        Read-only
                                    </label>
                                    <label className="flex items-center gap-2 cursor-not-allowed opacity-80">
                                        <input type="checkbox" checked={properties.hidden} readOnly className="accent-[var(--color-accent)]" />
                                        Hidden
                                    </label>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-[var(--color-danger)]">Failed to load properties</div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-1.5 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)] 
              text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
