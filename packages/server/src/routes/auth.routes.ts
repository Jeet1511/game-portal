import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from '../middleware/errorHandler';
import { authLimiter } from '../middleware/rateLimiter';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/auth/discord
 * @desc    Redirect to Discord OAuth
 * @access  Public
 */
router.get('/discord', authLimiter, (req, res) => {
    const { discord } = require('../config').config;
    const authUrl = `${discord.oauthUrl}?client_id=${discord.clientId}&redirect_uri=${encodeURIComponent(discord.redirectUri)}&response_type=code&scope=identify%20email`;
    res.redirect(authUrl);
});

/**
 * @route   POST /api/auth/callback
 * @desc    Handle Discord OAuth callback
 * @access  Public
 */
router.post('/callback', authLimiter, async (req, res, next) => {
    try {
        const { code } = req.body;

        if (!code) {
            throw new AppError('Authorization code required', 400);
        }

        const result = await AuthService.handleDiscordCallback(code);

        // Set HTTP-only cookie
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            success: true,
            data: {
                token: result.token,
                user: result.user,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', verifyToken, async (req: AuthRequest, res, next) => {
    try {
        const { User } = require('../models/User');
        const user = await User.findById(req.user!.id).select('-__v');

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', verifyToken, (req, res) => {
    res.clearCookie('token');
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
});

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/admin/login', authLimiter, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError('Email and password required', 400);
        }

        // Development credentials (replace with database lookup in production)
        const validEmail = 'admin@gameportal.com';
        const validPassword = 'admin123';

        if (email !== validEmail || password !== validPassword) {
            throw new AppError('Invalid credentials', 401);
        }

        // Create admin user object
        const admin = {
            id: 'admin-001',
            username: 'Admin',
            email: validEmail,
            role: 'super_admin' as const,
            permissions: [
                'manage_users',
                'manage_games',
                'manage_admins',
                'manage_leaderboards',
                'manage_achievements',
                'manage_tournaments',
                'view_analytics',
                'server_management',
            ],
        };

        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const { config } = require('../config');
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiry }
        );

        // Set HTTP-only cookie
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            success: true,
            admin,
            token,
        });
    } catch (error) {
        next(error);
    }
});


export default router;
