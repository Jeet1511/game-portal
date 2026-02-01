import { Router } from 'express';
import { Score } from '../models/Score';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { verifyToken, AuthRequest } from '../middleware/auth';
import { scoreLimiter } from '../middleware/rateLimiter';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/scores/submit
 * @desc    Submit game score
 * @access  Private
 */
router.post('/submit', verifyToken, scoreLimiter, async (req: AuthRequest, res, next) => {
    try {
        const { gameSlug, score, metadata } = req.body;

        if (!gameSlug || score === undefined) {
            throw new AppError('Game slug and score are required', 400);
        }

        const game = await Game.findOne({ slug: gameSlug });
        if (!game) {
            throw new AppError('Game not found', 404);
        }

        // Create score record
        const newScore = await Score.create({
            userId: req.user!.id,
            gameId: game._id,
            score,
            metadata: metadata || {},
            session: {
                source: 'web',
                ipAddress: req.ip || 'unknown',
                userAgent: req.headers['user-agent'] || 'unknown',
            },
        });

        // Update user stats
        await User.findByIdAndUpdate(req.user!.id, {
            $inc: {
                'stats.totalGames': 1,
                'stats.totalScore': score,
            },
        });

        // Update game stats
        await Game.findByIdAndUpdate(game._id, {
            $inc: { 'stats.totalPlays': 1 },
            $max: { 'stats.highScore': score },
        });

        res.json({
            success: true,
            data: { score: newScore },
            message: 'Score submitted successfully',
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/scores/leaderboard/:gameSlug
 * @desc    Get leaderboard for a game
 * @access  Public
 */
router.get('/leaderboard/:gameSlug', async (req, res, next) => {
    try {
        const { gameSlug } = req.params;
        const limit = parseInt(req.query.limit as string) || 10;

        const game = await Game.findOne({ slug: gameSlug });
        if (!game) {
            throw new AppError('Game not found', 404);
        }

        const scores = await Score.find({ gameId: game._id })
            .sort({ score: -1 })
            .limit(limit)
            .populate('userId', 'username avatar discordId')
            .select('-__v');

        res.json({
            success: true,
            data: { scores },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
