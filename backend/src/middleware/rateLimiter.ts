import rateLimit from 'express-rate-limit';
import { config } from '../config';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
        success: false,
        error: {
            message: 'Too many requests, please try again later',
            statusCode: 429,
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for score submission
export const scoreLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: {
        success: false,
        error: {
            message: 'Too many score submissions, please wait',
            statusCode: 429,
        },
    },
});

// Auth endpoint limiter
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        error: {
            message: 'Too many authentication attempts, please try again later',
            statusCode: 429,
        },
    },
});
