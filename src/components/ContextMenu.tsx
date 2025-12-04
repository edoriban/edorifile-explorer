import { FC, useEffect, useRef } from 'react';
import {
    CutIcon,
    CopyIcon,
    PasteIcon,
    RenameIcon,
    DeleteIcon,
    NewFolderIcon,
    CodeIcon,
    DocumentIcon
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
    onOpenInTerminal: () => void;
    onCopyPath: () => void;
    onProperties: () => void;
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
    onOpenInTerminal,
    onCopyPath,
    onProperties,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);

    // Adjust position to keep in viewport
    const style = {
        top: y,
        left: x,
    };

    if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        if (y + rect.height > window.innerHeight) {
            style.top = y - rect.height;
        }
        if (x + rect.width > window.innerWidth) {
            style.left = x - rect.width;
        }
    }

    return (
        <div
            ref={menuRef}
            className="context-menu flex flex-col gap-1 min-w-[240px]"
            style={style}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Primary Actions */}
            {isOnFile && (
                <>
                    <button onClick={onOpen} className="context-menu-item font-semibold">
                        <span className="w-5 flex justify-center"><DocumentIcon size={16} /></span>
                        Open
                    </button>
                    <div className="context-menu-divider" />
                </>
            )}

            {/* File Operations */}
            <button onClick={onCut} disabled={!hasSelection} className="context-menu-item">
                <span className="w-5 flex justify-center"><CutIcon size={16} /></span>
                Cut
                <span className="shortcut">Ctrl+X</span>
            </button>
            <button onClick={onCopy} disabled={!hasSelection} className="context-menu-item">
                <span className="w-5 flex justify-center"><CopyIcon size={16} /></span>
                Copy
                <span className="shortcut">Ctrl+C</span>
            </button>
            <button onClick={onPaste} disabled={!hasClipboard} className="context-menu-item">
                <span className="w-5 flex justify-center"><PasteIcon size={16} /></span>
                Paste
                <span className="shortcut">Ctrl+V</span>
            </button>

            <div className="context-menu-divider" />

            {/* Advanced Actions */}
            <button onClick={onOpenInTerminal} className="context-menu-item">
                <span className="w-5 flex justify-center"><CodeIcon size={16} /></span>
                Open in Terminal
            </button>

            {isOnFile && (
                <button onClick={onCopyPath} className="context-menu-item">
                    <span className="w-5 flex justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M13.8284 10.1716L16.6569 7.34315C17.4379 6.5621 18.7043 6.5621 19.4853 7.34315C20.2663 8.1242 20.2663 9.39052 19.4853 10.1716L16.6569 13M10.1716 13.8284L7.34315 16.6569C6.5621 17.4379 5.29577 17.4379 4.51472 16.6569C3.73367 15.8758 3.73367 14.6095 4.51472 13.8284L7.34315 11" strokeLinecap="round" />
                        </svg>
                    </span>
                    Copy as path
                </button>
            )}

            <div className="context-menu-divider" />

            {/* Management */}
            <button onClick={onNewFolder} className="context-menu-item">
                <span className="w-5 flex justify-center"><NewFolderIcon size={16} /></span>
                New folder
                <span className="shortcut">Ctrl+Shift+N</span>
            </button>
            <button onClick={onRename} disabled={!hasSelection} className="context-menu-item">
                <span className="w-5 flex justify-center"><RenameIcon size={16} /></span>
                Rename
                <span className="shortcut">F2</span>
            </button>
            <button onClick={onDelete} disabled={!hasSelection} className="context-menu-item danger">
                <span className="w-5 flex justify-center"><DeleteIcon size={16} /></span>
                Delete
                <span className="shortcut">Del</span>
            </button>

            {isOnFile && (
                <>
                    <div className="context-menu-divider" />
                    <button onClick={onProperties} className="context-menu-item">
                        <span className="w-5 flex justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16V12M12 8H12.01" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        Properties
                    </button>
                </>
            )}
        </div>
    );
};
