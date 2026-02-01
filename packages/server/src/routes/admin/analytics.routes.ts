import { Router } from 'express';
import { User } from '../models/User';
import { Game } from '../models/Game';
import { Score } from '../models/Score';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/admin/analytics/overview
 * @desc    Get dashboard overview statistics
 * @access  Private (Admin)
 */
router.get('/overview', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalGames = await Game.countDocuments({ isActive: true });

        // Get active players (played in last 24 hours)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const activePlayers = await Score.distinct('userId', {
            playedAt: { $gte: oneDayAgo },
        });

        // Get total plays today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const playsToday = await Score.countDocuments({
            playedAt: { $gte: today },
        });

        // Calculate growth (last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const usersLast30 = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
        });
        const usersPrevious30 = await User.countDocuments({
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
        });

        const userGrowth = usersPrevious30 > 0
            ? ((usersLast30 - usersPrevious30) / usersPrevious30) * 100
            : 100;

        res.json({
            success: true,
            data: {
                totalUsers,
                totalGames,
                activePlayers: activePlayers.length,
                playsToday,
                userGrowth: Math.round(userGrowth * 10) / 10,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/admin/analytics/users
 * @desc    Get user analytics
 * @access  Private (Admin)
 */
router.get('/users', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        // User growth over last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({
            success: true,
            data: { userGrowth },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/admin/analytics/games
 * @desc    Get game analytics
 * @access  Private (Admin)
 */
router.get('/games', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        // Most played games
        const gamePopularity = await Game.find({ isActive: true })
            .select('name stats.totalPlays stats.averageScore')
            .sort({ 'stats.totalPlays': -1 })
            .limit(10);

        res.json({
            success: true,
            data: { gamePopularity },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/admin/analytics/activity
 * @desc    Get recent activity
 * @access  Private (Admin)
 */
router.get('/activity', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        // Recent scores
        const recentScores = await Score.find()
            .populate('userId', 'username avatar')
            .populate('gameId', 'name thumbnailUrl')
            .sort({ playedAt: -1 })
            .limit(20);

        // Recent user registrations
        const recentUsers = await User.find()
            .select('username avatar createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            data: {
                recentScores,
                recentUsers,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
