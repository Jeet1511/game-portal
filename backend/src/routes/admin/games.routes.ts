import { Router } from 'express';
import { Game } from '../../models/Game';
import { verifyToken, AuthRequest } from '../../middleware/auth';
import { AppError } from '../../middleware/errorHandler';
import multer from 'multer';
import { uploadFile, deleteFile } from '../../services/storage.service';
import { gameUploadService } from '../../services/gameUpload.service';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   GET /api/admin/games
 * @desc    Get all games
 * @access  Private (Admin)
 */
router.get('/', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const { page = 1, limit = 20, search, category, status } = req.query;

        const query: any = {};

        if (search) {
            query.$text = { $search: search as string };
        }

        if (category) {
            query.category = category;
        }

        if (status) {
            query.isActive = status === 'active';
        }

        const games = await Game.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Game.countDocuments(query);

        res.json({
            success: true,
            data: {
                games,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/admin/games/:id
 * @desc    Get single game
 * @access  Private (Admin)
 */
router.get('/:id', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            throw new AppError('Game not found', 404);
        }

        res.json({
            success: true,
            data: { game },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/admin/games
 * @desc    Create new game
 * @access  Private (Admin)
 */
router.post(
    '/',
    verifyToken,
    upload.single('thumbnail'),
    async (req: AuthRequest, res, next) => {
        try {
            const {
                name,
                description,
                category,
                difficulty,
                engine,
                assetUrl,
            } = req.body;

            // Upload thumbnail to GridFS
            let thumbnailUrl = '';
            if (req.file) {
                const result = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
                thumbnailUrl = result.fileId;
            }

            // Create slug from name
            const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

            const game = await Game.create({
                name,
                slug,
                description,
                category,
                difficulty,
                engine,
                assetUrl,
                thumbnailUrl,
            });

            res.status(201).json({
                success: true,
                data: { game },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   PUT /api/admin/games/:id
 * @desc    Update game
 * @access  Private (Admin)
 */
router.put(
    '/:id',
    verifyToken,
    upload.single('thumbnail'),
    async (req: AuthRequest, res, next) => {
        try {
            const game = await Game.findById(req.params.id);

            if (!game) {
                throw new AppError('Game not found', 404);
            }

            const {
                name,
                description,
                category,
                difficulty,
                engine,
                assetUrl,
                isActive,
                isFeatured,
            } = req.body;

            // Upload new thumbnail if provided
            if (req.file) {
                // Delete old thumbnail
                if (game.thumbnailUrl) {
                    await deleteFile(game.thumbnailUrl);
                }

                const result = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
                game.thumbnailUrl = result.fileId;
            }

            // Update fields
            if (name) game.name = name;
            if (description) game.description = description;
            if (category) game.category = category;
            if (difficulty) game.difficulty = difficulty;
            if (engine) game.engine = engine;
            if (assetUrl) game.assetUrl = assetUrl;
            if (typeof isActive !== 'undefined') game.isActive = isActive;
            if (typeof isFeatured !== 'undefined') game.isFeatured = isFeatured;

            await game.save();

            res.json({
                success: true,
                data: { game },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @route   DELETE /api/admin/games/:id
 * @desc    Delete game
 * @access  Private (Admin)
 */
router.delete('/:id', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            throw new AppError('Game not found', 404);
        }

        // Delete thumbnail from GridFS
        if (game.thumbnailUrl) {
            await deleteFile(game.thumbnailUrl);
        }

        await game.deleteOne();

        res.json({
            success: true,
            message: 'Game deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/admin/games/:id/stats
 * @desc    Get game statistics
 * @access  Private (Admin)
 */
router.get('/:id/stats', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            throw new AppError('Game not found', 404);
        }

        res.json({
            success: true,
            data: {
                stats: game.stats,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
