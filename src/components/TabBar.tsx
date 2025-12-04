import { FC } from 'react';
import { PlusIcon } from '../utils/icons';

export interface Tab {
    id: string;
    path: string;
    title: string;
}

interface TabBarProps {
    tabs: Tab[];
    activeTabId: string;
    onTabClick: (tabId: string) => void;
    onTabClose: (tabId: string) => void;
    onNewTab: () => void;
}

export const TabBar: FC<TabBarProps> = ({
    tabs,
    activeTabId,
    onTabClick,
    onTabClose,
    onNewTab,
}) => {
    return (
        <div className="h-9 flex items-center bg-[var(--color-bg-base)] border-b border-[var(--color-border)]">
            {/* Tabs */}
            <div className="flex-1 flex items-center overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTabId;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabClick(tab.id)}
                            className={`tab ${isActive ? 'active' : ''}`}
                        >
                            {/* Folder icon */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                                <path
                                    d="M3 7C3 5.34315 4.34315 4 6 4H10.1716C10.702 4 11.2107 4.21071 11.5858 4.58579L13 6H18C19.6569 6 21 7.34315 21 9V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V7Z"
                                    fill={isActive ? 'var(--color-accent)' : 'var(--color-text-muted)'}
                                />
                            </svg>

                            {/* Title */}
                            <span className="truncate flex-1 text-left">{tab.title}</span>

                            {/* Close button */}
                            {tabs.length > 1 && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTabClose(tab.id);
                                    }}
                                    className="tab-close flex items-center justify-center w-4 h-4"
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* New tab button */}
            <button
                onClick={onNewTab}
                className="h-full px-3 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                title="New tab"
            >
                <PlusIcon size={14} />
            </button>
        </div>
    );
};
