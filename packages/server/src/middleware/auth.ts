import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errorHandler';
import { User } from '../models/User';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        discordId: string;
        role: string;
    };
}

export const verifyToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

        if (!token) {
            throw new AppError('No authentication token provided', 401);
        }

        const decoded = jwt.verify(token, config.jwt.secret) as {
            userId: string;
            discordId: string;
        };

        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = {
            id: user._id.toString(),
            discordId: user.discordId,
            role: user.role,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AppError('Invalid token', 401));
        } else {
            next(error);
        }
    }
};

export const verifyAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        return next(new AppError('Authentication required', 401));
    }

    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        return next(new AppError('Admin access required', 403));
    }

    next();
};
