import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs/promises';
import { AppError } from '../middleware/errorHandler';

export class GameUploadService {
    private gamesDirectory = path.join(__dirname, '../../public/games');

    async uploadGameZip(file: Express.Multer.File, gameId: string): Promise<string> {
        try {
            // Ensure games directory exists
            await fs.mkdir(this.gamesDirectory, { recursive: true });

            const gameDir = path.join(this.gamesDirectory, gameId);

            // Create game directory
            await fs.mkdir(gameDir, { recursive: true });

            // Extract ZIP
            const zip = new AdmZip(file.buffer);
            const zipEntries = zip.getEntries();

            // Validate ZIP contains index.html
            const hasIndexHtml = zipEntries.some(entry =>
                entry.entryName.toLowerCase().endsWith('index.html')
            );

            if (!hasIndexHtml) {
                throw new AppError('ZIP must contain an index.html file', 400);
            }

            // Security check - prevent path traversal
            for (const entry of zipEntries) {
                const entryPath = path.normalize(entry.entryName);
                if (entryPath.startsWith('..') || path.isAbsolute(entryPath)) {
                    throw new AppError('Invalid file path in ZIP', 400);
                }
            }

            // Extract all files
            zip.extractAllTo(gameDir, true);

            // Return the game URL path
            return `/games/${gameId}/index.html`;
        } catch (error) {
            // Clean up on error
            const gameDir = path.join(this.gamesDirectory, gameId);
            try {
                await fs.rm(gameDir, { recursive: true, force: true });
            } catch (cleanupError) {
                console.error('Error cleaning up game directory:', cleanupError);
            }
            throw error;
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
