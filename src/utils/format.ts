// Format file size to human readable format
export function formatSize(bytes: number): string {
    if (bytes === 0) return '-';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

// Format date string
export function formatDate(dateStr: string): string {
    if (!dateStr || dateStr === '-') return '-';
    return dateStr;
}

// Get file type description
export function getFileType(extension: string, isDir: boolean): string {
    if (isDir) return 'Folder';
    if (!extension) return 'File';

    const types: Record<string, string> = {
        // Documents
        pdf: 'PDF Document',
        doc: 'Word Document',
        docx: 'Word Document',
        txt: 'Text File',
        rtf: 'Rich Text',
        md: 'Markdown',

        // Spreadsheets
        xls: 'Excel Spreadsheet',
        xlsx: 'Excel Spreadsheet',
        csv: 'CSV File',

        // Images
        jpg: 'JPEG Image',
        jpeg: 'JPEG Image',
        png: 'PNG Image',
        gif: 'GIF Image',
        svg: 'SVG Image',
        webp: 'WebP Image',
        ico: 'Icon',
        bmp: 'Bitmap Image',

        // Videos
        mp4: 'MP4 Video',
        mkv: 'MKV Video',
        avi: 'AVI Video',
        mov: 'QuickTime Video',
        webm: 'WebM Video',

        // Audio
        mp3: 'MP3 Audio',
        wav: 'WAV Audio',
        flac: 'FLAC Audio',
        ogg: 'OGG Audio',
        m4a: 'M4A Audio',

        // Archives
        zip: 'ZIP Archive',
        rar: 'RAR Archive',
        '7z': '7-Zip Archive',
        tar: 'TAR Archive',
        gz: 'GZip Archive',

        // Code
        js: 'JavaScript',
        ts: 'TypeScript',
        jsx: 'React JSX',
        tsx: 'React TSX',
        py: 'Python',
        rs: 'Rust',
        go: 'Go',
        java: 'Java',
        c: 'C',
        cpp: 'C++',
        h: 'C Header',
        cs: 'C#',
        html: 'HTML',
        css: 'CSS',
        json: 'JSON',
        xml: 'XML',
        yaml: 'YAML',
        yml: 'YAML',
        toml: 'TOML',

        // Executables
        exe: 'Application',
        msi: 'Installer',
        dll: 'DLL Library',
        bat: 'Batch File',
        ps1: 'PowerShell',
        sh: 'Shell Script',

        // Other
        iso: 'Disk Image',
        dmg: 'macOS Disk Image',
        torrent: 'Torrent',
    };

    return types[extension.toLowerCase()] || `${extension.toUpperCase()} File`;
}
