import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    discordId: string;
    username: string;
    discriminator: string;
    avatar: string;
    email?: string;
    role: 'user' | 'admin' | 'moderator';
    stats: {
        totalGames: number;
        totalScore: number;
        achievements: string[];
    };
    preferences: {
        theme: 'light' | 'dark';
        notifications: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date;
}

const UserSchema = new Schema<IUser>(
    {
        discordId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        username: {
            type: String,
            required: true,
        },
        discriminator: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            sparse: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'moderator'],
            default: 'user',
        },
        stats: {
            totalGames: {
                type: Number,
                default: 0,
            },
            totalScore: {
                type: Number,
                default: 0,
            },
            achievements: {
                type: [String],
                default: [],
            },
        },
        preferences: {
            theme: {
                type: String,
                enum: ['light', 'dark'],
                default: 'dark',
            },
            notifications: {
                type: Boolean,
                default: true,
            },
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for performance
UserSchema.index({ discordId: 1 });
UserSchema.index({ 'stats.totalScore': -1 });

export const User = mongoose.model<IUser>('User', UserSchema);
