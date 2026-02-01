import mongoose from 'mongoose';
import { config } from '../config';

export const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(config.database.mongoUri);
        console.log('✅ MongoDB connected successfully');

        // Handle connection events
        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};
