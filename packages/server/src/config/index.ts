import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '8080', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    database: {
        mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gameportal',
        redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    },

    discord: {
        clientId: process.env.DISCORD_CLIENT_ID || '',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
        redirectUri: process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/auth/callback',
        oauthUrl: 'https://discord.com/api/oauth2/authorize',
        tokenUrl: 'https://discord.com/api/oauth2/token',
        userUrl: 'https://discord.com/api/users/@me',
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
        expiry: process.env.JWT_EXPIRY || '7d',
    },

    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'change_this_password',
    },

    storage: {
        type: 'gridfs', // Using MongoDB GridFS (free, no external service needed)
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
    },

    cors: {
        allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },

    eliteZero: {
        webhookSecret: process.env.ELITEZERO_WEBHOOK_SECRET || '',
        apiKey: process.env.ELITEZERO_API_KEY || '',
    },

    monitoring: {
        sentryDsn: process.env.SENTRY_DSN || '',
    },
};

// Validate required config
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'DISCORD_CLIENT_ID',
    'DISCORD_CLIENT_SECRET',
];

if (config.nodeEnv === 'production') {
    const missing = requiredEnvVars.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}
