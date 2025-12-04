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
        <div className="tab-bar-container">
            {/* Tabs */}
            {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                    <div
                        key={tab.id}
                        onClick={() => onTabClick(tab.id)}
                        className={`tab ${isActive ? 'active' : ''}`}
                        title={tab.path}
                    >
                        {/* Folder icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                            <path
                                d="M3 7C3 5.34315 4.34315 4 6 4H10.1716C10.702 4 11.2107 4.21071 11.5858 4.58579L13 6H18C19.6569 6 21 7.34315 21 9V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V7Z"
                                fill={isActive ? '#fbbf24' : 'currentColor'}
                                stroke={isActive ? '#b45309' : 'none'}
                                strokeWidth={isActive ? 1 : 0}
                            />
                        </svg>

                        {/* Title */}
                        <span className="truncate flex-1 text-left font-medium">{tab.title}</span>

                        {/* Close button */}
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabClose(tab.id);
                            }}
                            className="tab-close"
                            title="Close tab"
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M18 6L6 18M6 6L18 18" />
                            </svg>
                        </span>
                    </div>
                );
            })}

            {/* New tab button */}
            <button
                onClick={onNewTab}
                className="new-tab-btn"
                title="New tab (Ctrl+T)"
            >
                <PlusIcon size={16} />
            </button>
        </div>
    );
};
