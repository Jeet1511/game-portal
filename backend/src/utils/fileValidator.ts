// File Security Validator for Game Uploads
import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
    isValid: boolean;
    reason?: string;
    details?: string[];
}

export class GameFileValidator {
    // Dangerous file extensions that should be blocked
    private static BLOCKED_EXTENSIONS = [
        '.exe', '.dll', '.bat', '.cmd', '.com', '.scr', '.vbs', '.vbe',
        '.ws', '.wsf', '.wsh', '.msi', '.msp', '.app', '.deb',
        '.rpm', '.dmg', '.pkg', '.sh', '.bash', '.ps1', '.psm1'
    ];

    // Suspicious patterns - ONLY actual malware/attacks (NOT game dev features)
    private static MALICIOUS_PATTERNS = [
        // Data exfiltration to suspicious domains (allow CDNs and common services)
        /fetch\s*\(\s*['"`]https?:\/\/(?!.*(?:cdnjs|unpkg|jsdelivr|googleapis|cloudflare|github|rawgit|three\.org))/gi,

        // Actual malicious system access (not game engines)
        /require\s*\(\s*['"`]child_process/gi,
        /require\s*\(\s*['"`]net/gi,

        // SQL injection attempts
        /DROP\s+TABLE/gi,
        /DELETE\s+FROM.*WHERE.*1\s*=\s*1/gi,
        /UNION\s+SELECT.*FROM/gi,

        // XSS attempts targeting cookies for theft
        /<script[^>]*>.*document\.cookie.*location/gi,
        /javascript:.*document\.cookie.*location/gi,

        // Heavy obfuscation (common in malware)
        /String\.fromCharCode\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+/gi, // 5+ consecutive
        /eval\s*\(\s*atob\s*\(/gi, // eval(atob()) is very suspicious
        /eval\s*\(\s*unescape\s*\(/gi
    ];

    // Allowed file extensions for games (comprehensive list)
    private static ALLOWED_EXTENSIONS = [
        // Web files
        '.html', '.htm', '.css', '.js', '.json', '.xml', '.ts', '.jsx', '.tsx',
        // Images
        '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp', '.tiff', '.tga',
        // Audio
        '.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.opus', '.weba',
        // Video
        '.mp4', '.webm', '.ogv', '.mov', '.avi', '.mkv',
        // Fonts
        '.ttf', '.otf', '.woff', '.woff2', '.eot',
        // Data & Config
        '.txt', '.md', '.csv', '.yaml', '.yml', '.toml', '.ini', '.cfg',
        // 3D models & Game Assets
        '.obj', '.fbx', '.gltf', '.glb', '.dae', '.blend', '.stl', '.3ds', '.max',
        // Shaders
        '.glsl', '.vert', '.frag', '.shader', '.hlsl',
        // Game Dev Languages (Python, Lua, C#, C++, GDScript, etc.)
        '.py', '.lua', '.cs', '.cpp', '.c', '.h', '.hpp', '.gdscript', '.gd', '.rs',
        // Archives (for nested assets)
        '.zip', '.tar', '.gz', '.rar', '.7z',
        // Other
        '.pdf', '.map', '.wasm' // Source maps, WebAssembly
    ];

    /**
     * Validate a single file
     */
    static async validateFile(filePath: string, fileName: string): Promise<ValidationResult> {
        const ext = path.extname(fileName).toLowerCase();

        // Check if extension is blocked
        if (this.BLOCKED_EXTENSIONS.includes(ext)) {
            return {
                isValid: false,
                reason: 'Blocked File Type',
                details: [`Executable files (${ext}) are not allowed for security reasons.`]
            };
        }

        // Check if extension is allowed
        if (!this.ALLOWED_EXTENSIONS.includes(ext) && ext !== '') {
            return {
                isValid: false,
                reason: 'Unsupported File Type',
                details: [`File type ${ext} is not supported. Allowed types: ${this.ALLOWED_EXTENSIONS.join(', ')}`]
            };
        }

        // For text-based files, scan content
        const textExtensions = ['.html', '.htm', '.js', '.css', '.json', '.txt', '.md',
            '.ts', '.jsx', '.tsx', '.py', '.lua', '.cs', '.cpp',
            '.c', '.h', '.hpp', '.xml', '.yaml', '.yml', '.gd'];

        if (textExtensions.includes(ext)) {
            try {
                const content = await fs.promises.readFile(filePath, 'utf-8');
                const contentValidation = this.validateFileContent(content);
                if (!contentValidation.isValid) {
                    return contentValidation;
                }
            } catch (error) {
                // If file can't be read as text, it might be binary - skip content validation
            }
        }

        // Check file size (max 50MB per file)
        const stats = await fs.promises.stat(filePath);
        if (stats.size > 50 * 1024 * 1024) {
            return {
                isValid: false,
                reason: 'File Too Large',
                details: [`File ${fileName} exceeds 50MB limit (${(stats.size / 1024 / 1024).toFixed(2)}MB)`]
            };
        }

        return { isValid: true };
    }

    /**
     * Validate file content for malicious patterns ONLY
     * Does NOT warn about localStorage, external APIs, or game dev features
     */
    private static validateFileContent(content: string): ValidationResult {
        const suspiciousFindings: string[] = [];

        // Check for ACTUAL malicious patterns only
        for (const pattern of this.MALICIOUS_PATTERNS) {
            const matches = content.match(pattern);
            if (matches && matches.length > 0) {
                suspiciousFindings.push(`Suspicious code pattern detected: ${matches[0].substring(0, 50)}...`);
            }
        }

        // Only block if actual malicious patterns found
        if (suspiciousFindings.length > 0) {
            return {
                isValid: false,
                reason: 'Potentially Malicious Content',
                details: suspiciousFindings
            };
        }

        return { isValid: true };
    }

    /**
     * Validate entire ZIP file
     */
    static async validateZipContents(extractedPath: string): Promise<ValidationResult> {
        const allFiles = await this.getAllFiles(extractedPath);
        const issues: string[] = [];

        // Check total size
        let totalSize = 0;
        for (const file of allFiles) {
            const stats = await fs.promises.stat(file);
            totalSize += stats.size;
        }

        if (totalSize > 200 * 1024 * 1024) { // 200MB total limit
            return {
                isValid: false,
                reason: 'Upload Too Large',
                details: [`Total upload size exceeds 200MB limit (${(totalSize / 1024 / 1024).toFixed(2)}MB)`]
            };
        }

        // Validate each file
        for (const filePath of allFiles) {
            const fileName = path.basename(filePath);
            const validation = await this.validateFile(filePath, fileName);

            if (!validation.isValid) {
                issues.push(`${fileName}: ${validation.reason} - ${validation.details?.join(', ')}`);
            }
        }

        if (issues.length > 0) {
            return {
                isValid: false,
                reason: 'Security Validation Failed',
                details: issues
            };
        }

        // Check for required index.html
        const hasIndexHtml = allFiles.some(f => path.basename(f).toLowerCase() === 'index.html');
        if (!hasIndexHtml) {
            return {
                isValid: false,
                reason: 'Missing Entry Point',
                details: ['Game must contain an index.html file as the entry point']
            };
        }

        return { isValid: true };
    }

    /**
     * Get all files recursively
     */
    private static async getAllFiles(dirPath: string, arrayOfFiles: string[] = []): Promise<string[]> {
        const files = await fs.promises.readdir(dirPath);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = await fs.promises.stat(filePath);

            if (stat.isDirectory()) {
                arrayOfFiles = await this.getAllFiles(filePath, arrayOfFiles);
            } else {
                arrayOfFiles.push(filePath);
            }
        }

        return arrayOfFiles;
    }

    /**
     * Sanitize file name
     */
    static sanitizeFileName(fileName: string): string {
        // Remove path traversal attempts
        fileName = fileName.replace(/\.\./g, '');
        fileName = fileName.replace(/[\/\\]/g, '-');

        // Remove special characters
        fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

        return fileName;
    }
}
