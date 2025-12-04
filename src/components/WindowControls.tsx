import { FC, useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface WindowControlsProps {
    className?: string;
}

export const WindowControls: FC<WindowControlsProps> = ({ className = '' }) => {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        const checkMaximized = async () => {
            try {
                const maximized = await invoke<boolean>('is_maximized');
                setIsMaximized(maximized);
            } catch (e) {
                console.error('Failed to check maximize state:', e);
            }
        };
        checkMaximized();

        // Check periodically for window state changes
        const interval = setInterval(checkMaximized, 200);
        return () => clearInterval(interval);
    }, []);

    const handleMinimize = async () => {
        try {
            await invoke('minimize_window');
        } catch (e) {
            console.error('Failed to minimize:', e);
        }
    };

    const handleMaximize = async () => {
        try {
            await invoke('maximize_window');
            setIsMaximized(!isMaximized);
        } catch (e) {
            console.error('Failed to maximize:', e);
        }
    };

    const handleClose = async () => {
        try {
            await invoke('close_window');
        } catch (e) {
            console.error('Failed to close:', e);
        }
    };

    return (
        <div className={`window-controls ${className}`}>
            {/* Minimize */}
            <button
                onClick={handleMinimize}
                className="window-control-btn"
                title="Minimize"
            >
                <svg width="10" height="1" viewBox="0 0 10 1">
                    <rect width="10" height="1" fill="currentColor" />
                </svg>
            </button>

            {/* Maximize/Restore */}
            <button
                onClick={handleMaximize}
                className="window-control-btn"
                title={isMaximized ? 'Restore' : 'Maximize'}
            >
                {isMaximized ? (
                    // Restore icon (two overlapping rectangles)
                    <svg width="10" height="10" viewBox="0 0 10 10">
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            d="M2 0h6v6H2zM0 2h6v6H0z"
                        />
                    </svg>
                ) : (
                    // Maximize icon (single rectangle)
                    <svg width="10" height="10" viewBox="0 0 10 10">
                        <rect
                            x="0.5"
                            y="0.5"
                            width="9"
                            height="9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </svg>
                )}
            </button>

            {/* Close */}
            <button
                onClick={handleClose}
                className="window-control-btn close"
                title="Close"
            >
                <svg width="10" height="10" viewBox="0 0 10 10">
                    <path
                        d="M1 1L9 9M9 1L1 9"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </div>
    );
};
