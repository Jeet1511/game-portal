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

        // Find admin user in database
        const { User } = require('../models/User');
        const bcrypt = require('bcryptjs');

        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.password) {
            throw new AppError('Invalid credentials', 401);
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new AppError('Invalid credentials', 401);
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            throw new AppError('Unauthorized - Admin access required', 403);
        }

        // Check if user is banned
        if (user.isBanned) {
            throw new AppError('Account has been banned', 403);
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const { config } = require('../config');
        const token = jwt.sign(
            {
                id: user._id.toString(),
                email: user.email,
                role: user.role
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiry }
        );

        // Set HTTP-only cookie (use 'token' not 'admin_token')
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
});


export default router;
