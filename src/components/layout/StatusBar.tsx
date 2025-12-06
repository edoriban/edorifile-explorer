// StatusBar component - shows file count, selection, and clipboard status
import { FC } from 'react';
import type { FileEntry, ClipboardState } from '../../types';

interface StatusBarProps {
    fileCount: number;
    selectedFile: FileEntry | null;
    clipboard: ClipboardState | null;
}

export const StatusBar: FC<StatusBarProps> = ({ fileCount, selectedFile, clipboard }) => {
    return (
        <footer className="h-6 flex items-center px-4 bg-[var(--color-bg-base)] border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)]">
            <span>{fileCount} items</span>
            {selectedFile && (
                <>
                    <span className="mx-2">|</span>
                    <span className="truncate">{selectedFile.name}</span>
                </>
            )}
            {clipboard && (
                <>
                    <span className="flex-1" />
                    <span className="text-[var(--color-accent)]">
                        {clipboard.operation === 'copy' ? 'Copied' : 'Cut'}: {clipboard.items.length} item(s)
                    </span>
                </>
            )}
        </footer>
    );
};
