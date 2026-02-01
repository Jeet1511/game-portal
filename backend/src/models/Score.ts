import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IScore extends Document {
    userId: Types.ObjectId;
    gameId: Types.ObjectId;
    score: number;
    rank: number;
    metadata: {
        duration: number;
        level: number;
        achievements: string[];
    };
    session: {
        source: 'web' | 'discord';
        ipAddress: string;
        userAgent: string;
    };
    verified: boolean;
    createdAt: Date;
}

const ScoreSchema = new Schema<IScore>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        gameId: {
            type: Schema.Types.ObjectId,
            ref: 'Game',
            required: true,
            index: true,
        },
        score: {
            type: Number,
            required: true,
        },
        rank: {
            type: Number,
            default: 0,
        },
        metadata: {
            duration: {
                type: Number,
                default: 0,
            },
            level: {
                type: Number,
                default: 1,
            },
            achievements: {
                type: [String],
                default: [],
            },
        },
        session: {
            source: {
                type: String,
                enum: ['web', 'discord'],
                required: true,
            },
            ipAddress: {
                type: String,
                required: true,
            },
            userAgent: {
                type: String,
                required: true,
            },
        },
        verified: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Compound indexes for leaderboards
ScoreSchema.index({ gameId: 1, score: -1 });
ScoreSchema.index({ userId: 1, gameId: 1 });
ScoreSchema.index({ createdAt: -1 });

export const Score = mongoose.model<IScore>('Score', ScoreSchema);
