import { FC, useState, useRef, useEffect } from 'react';

interface DialogProps {
    title: string;
    initialValue?: string;
    placeholder?: string;
    confirmLabel?: string;
    confirmDanger?: boolean;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}

export const InputDialog: FC<DialogProps> = ({
    title,
    initialValue = '',
    placeholder = '',
    confirmLabel = 'OK',
    confirmDanger = false,
    onConfirm,
    onCancel,
}) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onConfirm(value.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="dialog-overlay" onClick={onCancel}>
            <div className="dialog animate-slideUp" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="dialog-input"
                        spellCheck={false}
                    />
                    <div className="dialog-buttons">
                        <button type="button" onClick={onCancel} className="dialog-btn dialog-btn-secondary">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`dialog-btn ${confirmDanger ? 'dialog-btn-danger' : 'dialog-btn-primary'}`}
                            disabled={!value.trim()}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel?: string;
    confirmDanger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
    title,
    message,
    confirmLabel = 'OK',
    confirmDanger = false,
    onConfirm,
    onCancel,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter') onConfirm();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onCancel, onConfirm]);

    return (
        <div className="dialog-overlay" onClick={onCancel}>
            <div className="dialog animate-slideUp" onClick={(e) => e.stopPropagation()}>
                <h2 className="dialog-title">{title}</h2>
                <p className="text-[13px] text-[var(--color-text-secondary)] mb-4">{message}</p>
                <div className="dialog-buttons">
                    <button onClick={onCancel} className="dialog-btn dialog-btn-secondary">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`dialog-btn ${confirmDanger ? 'dialog-btn-danger' : 'dialog-btn-primary'}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
