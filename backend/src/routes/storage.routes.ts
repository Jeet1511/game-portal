import { Router, Request, Response } from 'express';
import multer from 'multer';
import { uploadFile, downloadFile, deleteFile, getFileMetadata, listFiles } from '../services/storage.service';
import { config } from '../config';

const router = Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: config.storage.maxFileSize,
    },
    fileFilter: (req, file, cb) => {
        // Allow common file types for games and assets
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'audio/mpeg',
            'audio/wav',
            'audio/ogg',
            'video/mp4',
            'video/webm',
            'application/json',
            'text/plain',
            'application/zip',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type ${file.mimetype} not allowed`));
        }
    },
});

/**
 * @route   POST /api/storage/upload
 * @desc    Upload a file to GridFS
 * @access  Private (requires authentication)
 */
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        // TODO: Add authentication middleware to verify user is logged in
        // For now, we'll allow uploads but you should add auth later

        const result = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            data: result,
        });
    } catch (error) {
        console.error('Upload error:', error);

        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: 'Failed to upload file' });
    }
});

/**
 * @route   GET /api/storage/:fileId
 * @desc    Download/stream a file from GridFS
 * @access  Public
 */
router.get('/:fileId', async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;

        const { stream, metadata } = await downloadFile(fileId);

        // Set appropriate headers
        res.setHeader('Content-Type', metadata.mimetype);
        res.setHeader('Content-Disposition', `inline; filename="${metadata.filename}"`);
        res.setHeader('Content-Length', metadata.size);

        // Stream the file
        stream.pipe(res);

        stream.on('error', (error: Error) => {
            console.error('Stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to stream file' });
            }
        });
    } catch (error) {
        console.error('Download error:', error);

        if (error instanceof Error && error.message === 'File not found') {
            return res.status(404).json({ error: 'File not found' });
        }

        if (error instanceof Error && error.message === 'Invalid file ID') {
            return res.status(400).json({ error: 'Invalid file ID' });
        }

        res.status(500).json({ error: 'Failed to download file' });
    }
});

/**
 * @route   GET /api/storage/:fileId/metadata
 * @desc    Get file metadata without downloading
 * @access  Public
 */
router.get('/:fileId/metadata', async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;
        const metadata = await getFileMetadata(fileId);

        res.json({
            success: true,
            data: metadata,
        });
    } catch (error) {
        console.error('Metadata error:', error);

        if (error instanceof Error && error.message === 'File not found') {
            return res.status(404).json({ error: 'File not found' });
        }

        if (error instanceof Error && error.message === 'Invalid file ID') {
            return res.status(400).json({ error: 'Invalid file ID' });
        }

        res.status(500).json({ error: 'Failed to get file metadata' });
    }
});

/**
 * @route   DELETE /api/storage/:fileId
 * @desc    Delete a file from GridFS
 * @access  Private (admin only)
 */
router.delete('/:fileId', async (req: Request, res: Response) => {
    try {
        const { fileId } = req.params;

        // TODO: Add admin authentication middleware
        // For now, we'll allow deletions but you should add admin auth later

        await deleteFile(fileId);

        res.json({
            success: true,
            message: 'File deleted successfully',
        });
    } catch (error) {
        console.error('Delete error:', error);

        if (error instanceof Error && error.message.includes('not found')) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.status(500).json({ error: 'Failed to delete file' });
    }
});

/**
 * @route   GET /api/storage
 * @desc    List all files with pagination
 * @access  Private (admin only)
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = parseInt(req.query.skip as string) || 0;

        // TODO: Add admin authentication middleware

        const files = await listFiles(limit, skip);

        res.json({
            success: true,
            data: files,
            pagination: {
                limit,
                skip,
            },
        });
    } catch (error) {
        console.error('List files error:', error);
        res.status(500).json({ error: 'Failed to list files' });
    }
});

export default router;
