// Types for clipboard operations

import type { FileEntry } from './file.types';

export type ClipboardOperation = 'copy' | 'cut';

export interface ClipboardState {
    items: FileEntry[];
    operation: ClipboardOperation;
}
