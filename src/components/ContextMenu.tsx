import { FC, useEffect, useRef } from 'react';
import {
    CutIcon,
    CopyIcon,
    PasteIcon,
    RenameIcon,
    DeleteIcon,
    NewFolderIcon
} from '../utils/icons';

interface ContextMenuProps {
    x: number;
    y: number;
    hasSelection: boolean;
    hasClipboard: boolean;
    isOnFile: boolean;
    onClose: () => void;
    onNewFolder: () => void;
    onCut: () => void;
    onCopy: () => void;
    onPaste: () => void;
    onRename: () => void;
    onDelete: () => void;
    onOpen: () => void;
}

export const ContextMenu: FC<ContextMenuProps> = ({
    x,
    y,
    hasSelection,
    hasClipboard,
    isOnFile,
    onClose,
    onNewFolder,
    onCut,
    onCopy,
    onPaste,
    onRename,
    onDelete,
    onOpen,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    // Adjust position to keep menu in viewport
    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (rect.right > viewportWidth) {
                menuRef.current.style.left = `${x - rect.width}px`;
            }
            if (rect.bottom > viewportHeight) {
                menuRef.current.style.top = `${y - rect.height}px`;
            }
        }
    }, [x, y]);

    const MenuItem: FC<{
        icon: React.ReactNode;
        label: string;
        shortcut?: string;
        onClick: () => void;
        disabled?: boolean;
        danger?: boolean;
    }> = ({ icon, label, shortcut, onClick, disabled, danger }) => (
        <button
            onClick={() => {
                if (!disabled) {
                    onClick();
                    onClose();
                }
            }}
            disabled={disabled}
            className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] transition-colors
        ${disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : danger
                        ? 'hover:bg-red-500/10 text-[var(--color-danger)]'
                        : 'hover:bg-[var(--color-bg-card-hover)]'
                }`}
        >
            <span className="w-5 flex justify-center">{icon}</span>
            <span className="flex-1 text-left">{label}</span>
            {shortcut && (
                <span className="text-[11px] text-[var(--color-text-tertiary)]">{shortcut}</span>
            )}
        </button>
    );

    return (
        <div
            ref={menuRef}
            className="context-menu"
            style={{ left: x, top: y }}
        >
            {isOnFile && (
                <>
                    <MenuItem
                        icon={<span className="text-base">📂</span>}
                        label="Open"
                        onClick={onOpen}
                    />
                    <div className="context-menu-divider" />
                </>
            )}

            <MenuItem
                icon={<CutIcon size={16} />}
                label="Cut"
                shortcut="Ctrl+X"
                onClick={onCut}
                disabled={!hasSelection}
            />
            <MenuItem
                icon={<CopyIcon size={16} />}
                label="Copy"
                shortcut="Ctrl+C"
                onClick={onCopy}
                disabled={!hasSelection}
            />
            <MenuItem
                icon={<PasteIcon size={16} />}
                label="Paste"
                shortcut="Ctrl+V"
                onClick={onPaste}
                disabled={!hasClipboard}
            />

            <div className="context-menu-divider" />

            <MenuItem
                icon={<NewFolderIcon size={16} />}
                label="New folder"
                shortcut="Ctrl+Shift+N"
                onClick={onNewFolder}
            />

            {hasSelection && (
                <>
                    <div className="context-menu-divider" />
                    <MenuItem
                        icon={<RenameIcon size={16} />}
                        label="Rename"
                        shortcut="F2"
                        onClick={onRename}
                    />
                    <MenuItem
                        icon={<DeleteIcon size={16} />}
                        label="Delete"
                        shortcut="Del"
                        onClick={onDelete}
                        danger
                    />
                </>
            )}
        </div>
    );
};
