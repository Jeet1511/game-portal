import { Router } from 'express';
import { Game } from '../models/Game';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route   GET /api/games
 * @desc    Get all active games
 * @access  Public
 */
router.get('/', apiLimiter, async (req, res, next) => {
    try {
        const games = await Game.find({ isActive: true })
            .select('-__v')
            .sort({ isFeatured: -1, createdAt: -1 });

        res.json({
            success: true,
            data: { games },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/games/:slug
 * @desc    Get game by slug
 * @access  Public
 */
router.get('/:slug', apiLimiter, async (req, res, next) => {
    try {
        const game = await Game.findOne({ slug: req.params.slug, isActive: true });

        if (!game) {
            return res.status(404).json({
                success: false,
                error: { message: 'Game not found', statusCode: 404 },
            });
        }

        res.json({
            success: true,
            data: { game },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
