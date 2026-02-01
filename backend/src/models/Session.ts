import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISession extends Document {
    tokenHash: string;
    userId: Types.ObjectId;
    gameId: Types.ObjectId;
    source: 'web' | 'discord';
    metadata: {
        ipAddress: string;
        userAgent: string;
    };
    used: boolean;
    expiresAt: Date;
    createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
    {
        tokenHash: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        gameId: {
            type: Schema.Types.ObjectId,
            ref: 'Game',
            required: true,
        },
        source: {
            type: String,
            enum: ['web', 'discord'],
            required: true,
        },
        metadata: {
            ipAddress: {
                type: String,
                required: true,
            },
            userAgent: {
                type: String,
                required: true,
            },
        },
        used: {
            type: Boolean,
            default: false,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// TTL index to auto-delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
