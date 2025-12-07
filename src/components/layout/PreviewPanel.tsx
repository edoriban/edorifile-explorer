// PreviewPanel component - shows file preview and metadata
// Displays on the right side when a file is selected

import { FC, useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { FileEntry } from '@types';
import { formatSize, getFileType } from '@utils/format';
import { Thumbnail } from '../file-browser/Thumbnail';

interface PreviewPanelProps {
    file: FileEntry | null;
    isVisible: boolean;
    onClose: () => void;
}

interface FilePreviewData {
    content?: string;
    lineCount?: number;
    isTruncated?: boolean;
}

// Image extensions that can be previewed
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'ico', 'svg'];

// Text extensions that can be previewed
const TEXT_EXTENSIONS = [
    'txt', 'md', 'json', 'js', 'ts', 'jsx', 'tsx', 'css', 'html', 'xml',
    'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'log', 'sh', 'bat', 'ps1',
    'py', 'rb', 'go', 'rs', 'c', 'cpp', 'h', 'hpp', 'java', 'kt', 'swift',
    'sql', 'graphql', 'vue', 'svelte', 'astro'
];

export const PreviewPanel: FC<PreviewPanelProps> = ({ file, isVisible, onClose }) => {
    const [previewData, setPreviewData] = useState<FilePreviewData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load preview when file changes
    useEffect(() => {
        if (!file || file.is_dir) {
            setPreviewData(null);
            return;
        }

        const ext = file.extension.toLowerCase();

        // Only load text preview for text files
        if (TEXT_EXTENSIONS.includes(ext)) {
            loadTextPreview(file.path);
        } else {
            setPreviewData(null);
        }
    }, [file?.path]);

    const loadTextPreview = async (path: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await invoke<FilePreviewData>('read_file_preview', {
                path,
                maxLines: 100
            });
            setPreviewData(result);
        } catch (err) {
            setError(String(err));
            setPreviewData(null);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isVisible) return null;

    const ext = file?.extension?.toLowerCase() || '';
    const isImage = IMAGE_EXTENSIONS.includes(ext);
    const isText = TEXT_EXTENSIONS.includes(ext);

    return (
        <div className="w-80 shrink-0 border-l border-[var(--color-border)] bg-[var(--color-bg-surface)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between h-11 px-4 border-b border-[var(--color-border)]">
                <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                    Preview
                </span>
                <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] transition-colors"
                    title="Close preview"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {!file ? (
                <div className="flex-1 flex items-center justify-center text-[var(--color-text-muted)] text-[13px] px-6">
                    <div className="text-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 opacity-40">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M3 15l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        <p>Select a file to preview</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {/* File Icon/Thumbnail - centered with proper padding */}
                    <div className="pt-8 pb-6 flex justify-center">
                        <div className={`${isImage ? 'w-44 h-44' : 'w-20 h-20'} flex items-center justify-center ${isImage ? 'rounded-xl overflow-hidden bg-[var(--color-bg-base)] border border-[var(--color-border)] shadow-sm' : ''}`}>
                            <Thumbnail
                                path={file.path}
                                extension={file.extension}
                                isDir={file.is_dir}
                                size={isImage ? 160 : 80}
                            />
                        </div>
                    </div>

                    {/* File Name - with better padding */}
                    <div className="px-5 pb-6 text-center">
                        <h3 className="text-[14px] font-medium text-[var(--color-text-primary)] break-words leading-relaxed">
                            {file.name}
                        </h3>
                    </div>

                    {/* Separator */}
                    <div className="mx-5 border-t border-[var(--color-border)]" />

                    {/* Metadata - improved spacing */}
                    <div className="px-5 py-5">
                        <table className="w-full text-[12px]">
                            <tbody className="[&_tr]:h-8">
                                <tr>
                                    <td className="text-[var(--color-text-muted)] align-middle">Type</td>
                                    <td className="text-[var(--color-text-secondary)] text-right align-middle">
                                        {getFileType(file.extension, file.is_dir)}
                                    </td>
                                </tr>
                                {!file.is_dir && (
                                    <tr>
                                        <td className="text-[var(--color-text-muted)] align-middle">Size</td>
                                        <td className="text-[var(--color-text-secondary)] text-right align-middle">
                                            {formatSize(file.size)}
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="text-[var(--color-text-muted)] align-middle">Modified</td>
                                    <td className="text-[var(--color-text-secondary)] text-right align-middle">
                                        {file.modified || '-'}
                                    </td>
                                </tr>
                                {previewData?.lineCount && (
                                    <tr>
                                        <td className="text-[var(--color-text-muted)] align-middle">Lines</td>
                                        <td className="text-[var(--color-text-secondary)] text-right align-middle">
                                            {previewData.lineCount}{previewData.isTruncated ? '+' : ''}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Text Preview */}
                    {isText && (
                        <>
                            {/* Separator */}
                            <div className="mx-5 border-t border-[var(--color-border)]" />

                            <div className="px-5 py-4">
                                <div className="text-[11px] text-[var(--color-text-muted)] mb-3 font-medium uppercase tracking-wide">
                                    Content
                                </div>
                                <div className="rounded-lg bg-[var(--color-bg-base)] border border-[var(--color-border)] p-3 max-h-56 overflow-auto">
                                    {isLoading ? (
                                        <div className="text-[var(--color-text-muted)] text-[12px] flex items-center gap-2">
                                            <div className="w-3 h-3 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
                                            Loading...
                                        </div>
                                    ) : error ? (
                                        <div className="text-[var(--color-danger)] text-[12px]">
                                            {error}
                                        </div>
                                    ) : previewData?.content ? (
                                        <pre className="text-[11px] text-[var(--color-text-secondary)] whitespace-pre-wrap break-words font-mono leading-relaxed">
                                            {previewData.content}
                                        </pre>
                                    ) : (
                                        <div className="text-[var(--color-text-muted)] text-[12px]">
                                            No preview available
                                        </div>
                                    )}
                                </div>
                                {previewData?.isTruncated && (
                                    <div className="text-[11px] text-[var(--color-text-muted)] mt-2 text-center opacity-70">
                                        Showing first 100 lines...
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
