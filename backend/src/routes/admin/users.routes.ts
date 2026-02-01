import { Router } from 'express';
import { User } from '../../models/User';
import { Score } from '../../models/Score';
import { verifyToken, AuthRequest } from '../../middleware/auth';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin)
 */
router.get('/', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const { page = 1, limit = 20, search, status } = req.query;

        const query: any = {};

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { discordId: { $regex: search, $options: 'i' } },
            ];
        }

        if (status === 'banned') {
            query.isBanned = true;
        } else if (status === 'active') {
            query.isBanned = false;
        }

        const users = await User.find(query)
            .select('-__v')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
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
 * @route   GET /api/admin/users/:id
 * @desc    Get user details
 * @access  Private (Admin)
 */
router.get('/:id', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-__v');

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Get user's game history
        const recentScores = await Score.find({ userId: user._id })
            .populate('gameId', 'name thumbnailUrl')
            .sort({ playedAt: -1 })
            .limit(10);

        res.json({
            success: true,
            data: {
                user,
                recentScores,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/admin/users/:id/stats
 * @desc    Get user statistics
 * @access  Private (Admin)
 */
router.get('/:id/stats', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Get total plays
        const totalPlays = await Score.countDocuments({ userId: user._id });

        // Get total score
        const scoreAgg = await Score.aggregate([
            { $match: { userId: user._id } },
            { $group: { _id: null, totalScore: { $sum: '$score' }, avgScore: { $avg: '$score' } } },
        ]);

        const stats = {
            totalPlays,
            totalScore: scoreAgg[0]?.totalScore || 0,
            averageScore: scoreAgg[0]?.avgScore || 0,
        };

        res.json({
            success: true,
            data: { stats },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/admin/users/:id/ban
 * @desc    Ban user
 * @access  Private (Admin)
 */
router.put('/:id/ban', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        user.isBanned = true;
        await user.save();

        res.json({
            success: true,
            message: 'User banned successfully',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/admin/users/:id/unban
 * @desc    Unban user
 * @access  Private (Admin)
 */
router.put('/:id/unban', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        user.isBanned = false;
        await user.save();

        res.json({
            success: true,
            message: 'User unbanned successfully',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private (Admin)
 */
router.delete('/:id', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Delete all user's scores
        await Score.deleteMany({ userId: user._id });

        // Delete user
        await user.deleteOne();

        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

export default router;
