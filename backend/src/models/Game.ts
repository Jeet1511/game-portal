import mongoose, { Schema, Document } from 'mongoose';

export interface IGame extends Document {
    name: string;
    slug: string;
    description: string;
    category: 'action' | 'puzzle' | 'arcade' | 'strategy';
    difficulty: 'easy' | 'medium' | 'hard';
    engine: 'phaser' | 'canvas' | 'three' | 'custom';
    assetUrl: string;
    thumbnailUrl: string;
    version: string;
    isActive: boolean;
    isFeatured: boolean;
    controls: {
        keyboard?: string[];
        mouse?: boolean;
        touch?: boolean;
    };
    metadata: {
        author: string;
        averagePlayTime: number;
        minPlayers: number;
        maxPlayers: number;
    };
    stats: {
        totalPlays: number;
        uniquePlayers: number;
        averageScore: number;
        highScore: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['action', 'puzzle', 'arcade', 'strategy'],
            required: true,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium',
        },
        engine: {
            type: String,
            enum: ['phaser', 'canvas', 'three', 'custom'],
            required: true,
        },
        assetUrl: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
            required: true,
        },
        version: {
            type: String,
            default: '1.0.0',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        controls: {
            keyboard: [String],
            mouse: Boolean,
            touch: Boolean,
        },
        metadata: {
            author: {
                type: String,
                default: 'Game Portal',
            },
            averagePlayTime: {
                type: Number,
                default: 0,
            },
            minPlayers: {
                type: Number,
                default: 1,
            },
            maxPlayers: {
                type: Number,
                default: 1,
            },
        },
        stats: {
            totalPlays: {
                type: Number,
                default: 0,
            },
            uniquePlayers: {
                type: Number,
                default: 0,
            },
            averageScore: {
                type: Number,
                default: 0,
            },
            highScore: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
GameSchema.index({ slug: 1 });
GameSchema.index({ isActive: 1, isFeatured: -1 });
GameSchema.index({ category: 1 });

export const Game = mongoose.model<IGame>('Game', GameSchema);
