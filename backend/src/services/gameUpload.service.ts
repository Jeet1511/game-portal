import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs/promises';
import { AppError } from '../middleware/errorHandler';
import { GameFileValidator } from '../utils/fileValidator';
import os from 'os';

export class GameUploadService {
    private gamesDirectory = path.join(__dirname, '../../public/games');

    async uploadGameZip(file: Express.Multer.File, gameId: string): Promise<string> {
        let tempDir: string | null = null;

        try {
            // Ensure games directory exists
            await fs.mkdir(this.gamesDirectory, { recursive: true });

            const gameDir = path.join(this.gamesDirectory, gameId);

            // Create temporary directory for validation
            tempDir = path.join(os.tmpdir(), `game-upload-${gameId}-${Date.now()}`);
            await fs.mkdir(tempDir, { recursive: true });

            // Extract ZIP to temp directory first
            const zip = new AdmZip(file.buffer);
            const zipEntries = zip.getEntries();

            // Basic security check - prevent path traversal
            for (const entry of zipEntries) {
                const entryPath = path.normalize(entry.entryName);
                if (entryPath.startsWith('..') || path.isAbsolute(entryPath)) {
                    throw new AppError('Invalid file path in ZIP: Path traversal detected', 400);
                }
            }

            // Extract to temp directory
            zip.extractAllTo(tempDir, true);

            // SECURITY VALIDATION
            console.log('🔒 Running security validation on uploaded game...');
            const validationResult = await GameFileValidator.validateZipContents(tempDir);

            if (!validationResult.isValid) {
                // Clean up temp directory
                await fs.rm(tempDir, { recursive: true, force: true });

                // Throw detailed error
                const errorMessage = `Upload rejected: ${validationResult.reason}`;
                const errorDetails = validationResult.details?.join('\n• ') || '';

                throw new AppError(
                    `${errorMessage}\n\nDetails:\n• ${errorDetails}`,
                    400
                );
            }

            console.log('✅ Security validation passed');

            // Create game directory
            await fs.mkdir(gameDir, { recursive: true });

            // Move validated files to game directory
            await this.moveDirectory(tempDir, gameDir);

            // Clean up temp directory
            await fs.rm(tempDir, { recursive: true, force: true });

            // Return the game URL path
            return `/games/${gameId}/index.html`;
        } catch (error) {
            // Clean up temp directory if it exists
            if (tempDir) {
                try {
                    await fs.rm(tempDir, { recursive: true, force: true });
                } catch (cleanupError) {
                    console.error('Error cleaning up temp directory:', cleanupError);
                }
            }

            // Clean up game directory on error
            const gameDir = path.join(this.gamesDirectory, gameId);
            try {
                await fs.rm(gameDir, { recursive: true, force: true });
            } catch (cleanupError) {
                console.error('Error cleaning up game directory:', cleanupError);
            }

            throw error;
        }
    }

    /**
     * Move directory contents recursively
     */
    private async moveDirectory(source: string, destination: string): Promise<void> {
        await fs.mkdir(destination, { recursive: true });

        const entries = await fs.readdir(source, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(source, entry.name);
            const destPath = path.join(destination, entry.name);

            if (entry.isDirectory()) {
                await this.moveDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    async deleteGame(gameId: string): Promise<void> {
        const gameDir = path.join(this.gamesDirectory, gameId);
        await fs.rm(gameDir, { recursive: true, force: true });
    }

    async gameExists(gameId: string): Promise<boolean> {
        const gameDir = path.join(this.gamesDirectory, gameId);
        try {
            await fs.access(gameDir);
            return true;
        } catch {
            return false;
        }
    }
}

export const gameUploadService = new GameUploadService();
