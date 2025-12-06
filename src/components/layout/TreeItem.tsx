// TreeItem component - expandable tree item for sidebar navigation
// Loads children lazily on expand

import { FC, useState, useCallback } from 'react';
import { fileService } from '@services';
import type { FileEntry } from '@types';

interface TreeItemProps {
    name: string;
    path: string;
    icon: React.ReactNode;
    depth: number;
    isActive: boolean;
    currentPath: string;
    onNavigate: (path: string) => void;
}

// Chevron icon for expand/collapse
const ChevronIcon: FC<{ expanded: boolean; size?: number }> = ({ expanded, size = 14 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
    >
        <path
            d="M9 6L15 12L9 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// Folder icon
const FolderIcon: FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
            d="M3 7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z"
            fill="#F5C842"
            stroke="#E0A800"
            strokeWidth="1"
        />
    </svg>
);

export const TreeItem: FC<TreeItemProps> = ({
    name,
    path,
    icon,
    depth,
    isActive,
    currentPath,
    onNavigate,
}) => {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasChildren, setHasChildren] = useState<boolean | null>(null);

    const loadChildren = useCallback(async () => {
        if (children.length > 0 || loading) return;

        setLoading(true);
        try {
            const result = await fileService.getFolderChildren(path);
            setChildren(result);
            setHasChildren(result.length > 0);
        } catch (error) {
            console.error('Failed to load children:', error);
            setHasChildren(false);
        } finally {
            setLoading(false);
        }
    }, [path, children.length, loading]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!expanded) {
            await loadChildren();
        }
        setExpanded(!expanded);
    };

    const handleClick = () => {
        onNavigate(path);
    };

    // Check if any child is in the current path (for highlighting ancestors)
    const isAncestor = currentPath.toLowerCase().startsWith(path.toLowerCase() + '\\');

    const paddingLeft = 8 + depth * 16;

    return (
        <div>
            <button
                onClick={handleClick}
                className={`sidebar-item w-full relative ${isActive ? 'active' : ''}`}
                style={{ paddingLeft }}
                title={path}
            >
                {/* Expand/Collapse toggle */}
                <span
                    className={`w-4 flex justify-center shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer ${hasChildren === false ? 'invisible' : ''
                        }`}
                    onClick={handleToggle}
                >
                    {loading ? (
                        <span className="w-3 h-3 border-2 border-[var(--color-text-muted)] border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <ChevronIcon expanded={expanded} />
                    )}
                </span>

                {/* Icon */}
                <span className="w-5 flex justify-center shrink-0">
                    {icon}
                </span>

                {/* Name */}
                <span className={`truncate font-medium ${isAncestor ? 'text-[var(--color-accent)]' : ''}`}>
                    {name}
                </span>
            </button>

            {/* Children */}
            {expanded && children.length > 0 && (
                <div>
                    {children.map((child) => (
                        <TreeItem
                            key={child.path}
                            name={child.name}
                            path={child.path}
                            icon={<FolderIcon size={16} />}
                            depth={depth + 1}
                            isActive={currentPath.toLowerCase() === child.path.toLowerCase()}
                            currentPath={currentPath}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
