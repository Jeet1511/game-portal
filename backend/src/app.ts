import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Import routes
import authRoutes from './routes/auth.routes';
import gameRoutes from './routes/game.routes';
import scoreRoutes from './routes/score.routes';
import storageRoutes from './routes/storage.routes';

// Admin routes
import adminGamesRoutes from './routes/admin/games.routes';
import adminUsersRoutes from './routes/admin/users.routes';
import adminLeaderboardsRoutes from './routes/admin/leaderboards.routes';
import adminAnalyticsRoutes from './routes/admin/analytics.routes';

// Public routes
import publicGamesRoutes from './routes/public/games.routes';

export const createApp = () => {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS
    app.use(cors({
        origin: config.cors.allowedOrigins,
        credentials: true,
    }));

    // Body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Compression
    app.use(compression());

    // Request logging
    app.use((req, res, next) => {
        logger.http(`${req.method} ${req.url}`);
        next();
    });

    // Health check
    app.get('/health', (req, res) => {
        res.json({
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
        });
    });

    // Serve static game files
    app.use('/games', express.static(path.join(__dirname, '../public/games')));

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/games', gameRoutes);
    app.use('/api/scores', scoreRoutes);
    app.use('/api/storage', storageRoutes);

    // Admin routes
    app.use('/api/admin/games', adminGamesRoutes);
    app.use('/api/admin/users', adminUsersRoutes);
    app.use('/api/admin/leaderboards', adminLeaderboardsRoutes);
    app.use('/api/admin/analytics', adminAnalyticsRoutes);

    // Public routes
    app.use('/api/public/games', publicGamesRoutes);

    // 404 handler
    app.use(notFoundHandler);

    // Error handler (must be last)
    app.use(errorHandler);

    return app;
};
