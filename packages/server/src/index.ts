import { createApp } from './app';
import { connectDatabase } from './utils/database';
import { config } from './config';
import { logger } from './utils/logger';

const startServer = async () => {
    try {
        // Connect to database
        await connectDatabase();

        // Initialize GridFS for file storage
        const { initializeGridFS } = await import('./services/storage.service');
        initializeGridFS();

        // Create Express app
        const app = createApp();

        // Start server
        const server = app.listen(config.port, () => {
            logger.info(`🚀 Server running on port ${config.port}`);
            logger.info(`📝 Environment: ${config.nodeEnv}`);
            logger.info(`🌐 CORS enabled for: ${config.cors.allowedOrigins.join(', ')}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('SIGTERM received, shutting down gracefully');
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT received, shutting down gracefully');
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
