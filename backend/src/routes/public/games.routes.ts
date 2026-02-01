import { Router } from 'express';
import { Game } from '../../models/Game';

const router = Router();

/**
 * @route   GET /api/public/games
 * @desc    Get all active games
 * @access  Public
 */
router.get('/', async (req, res, next) => {
    try {
        const { category, search, sort = '-createdAt', limit = 20, page = 1 } = req.query;

        const query: any = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [games, total] = await Promise.all([
            Game.find(query)
                .sort(sort as string)
                .limit(Number(limit))
                .skip(skip),
            Game.countDocuments(query),
        ]);

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
 * @route   GET /api/public/games/:id
 * @desc    Get single game
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game || !game.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Game not found',
            });
        }

        // Increment play count
        game.stats.totalPlays += 1;
        await game.save();

        res.json({
            success: true,
            data: { game },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/public/games/featured/list
 * @desc    Get featured games
 * @access  Public
 */
router.get('/featured/list', async (req, res, next) => {
    try {
        const games = await Game.find({ isActive: true })
            .sort('-stats.totalPlays')
            .limit(6);

        res.json({
            success: true,
            data: { games },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
