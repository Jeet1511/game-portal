import { Router } from 'express';
import { Score } from '../../models/Score';
import { Game } from '../../models/Game';
import { User } from '../../models/User';
import { verifyToken, AuthRequest } from '../../middleware/auth';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

/**
 * @route   GET /api/admin/leaderboards
 * @desc    Get global leaderboard
 * @access  Private (Admin)
 */
router.get('/', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const { limit = 100, period = 'all' } = req.query;

        let dateFilter = {};
        if (period === 'weekly') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            dateFilter = { playedAt: { $gte: weekAgo } };
        } else if (period === 'monthly') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            dateFilter = { playedAt: { $gte: monthAgo } };
        }

        const leaderboard = await Score.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$userId',
                    totalScore: { $sum: '$score' },
                    totalPlays: { $sum: 1 },
                    avgScore: { $avg: '$score' },
                },
            },
            { $sort: { totalScore: -1 } },
            { $limit: Number(limit) },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 1,
                    totalScore: 1,
                    totalPlays: 1,
                    avgScore: 1,
                    username: '$user.username',
                    avatar: '$user.avatar',
                },
            },
        ]);

        res.json({
            success: true,
            data: { leaderboard },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/admin/leaderboards/:gameId
 * @desc    Get game-specific leaderboard
 * @access  Private (Admin)
 */
router.get('/:gameId', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const { limit = 100, period = 'all' } = req.query;
        const { gameId } = req.params;

        const game = await Game.findById(gameId);
        if (!game) {
            throw new AppError('Game not found', 404);
        }

        let dateFilter: any = { gameId: game._id };
        if (period === 'weekly') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            dateFilter.playedAt = { $gte: weekAgo };
        } else if (period === 'monthly') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            dateFilter.playedAt = { $gte: monthAgo };
        }

        const leaderboard = await Score.find(dateFilter)
            .populate('userId', 'username avatar')
            .sort({ score: -1 })
            .limit(Number(limit));

        res.json({
            success: true,
            data: {
                game: {
                    id: game._id,
                    name: game.name,
                    thumbnailUrl: game.thumbnailUrl,
                },
                leaderboard,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/admin/leaderboards/:gameId/reset
 * @desc    Reset game leaderboard
 * @access  Private (Admin)
 */
router.delete('/:gameId/reset', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const { gameId } = req.params;

        const game = await Game.findById(gameId);
        if (!game) {
            throw new AppError('Game not found', 404);
        }

        // Delete all scores for this game
        const result = await Score.deleteMany({ gameId: game._id });

        // Reset game stats
        game.stats.totalPlays = 0;
        game.stats.averageScore = 0;
        game.stats.highScore = 0;
        await game.save();

        res.json({
            success: true,
            message: `Leaderboard reset successfully. ${result.deletedCount} scores deleted.`,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
