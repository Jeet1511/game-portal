import axios from 'axios';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';

interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    email?: string;
}

export class AuthService {
    /**
     * Exchange Discord OAuth code for access token
     */
    static async getDiscordToken(code: string): Promise<string> {
        try {
            const response = await axios.post(
                config.discord.tokenUrl,
                new URLSearchParams({
                    client_id: config.discord.clientId,
                    client_secret: config.discord.clientSecret,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: config.discord.redirectUri,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            return response.data.access_token;
        } catch (error) {
            throw new AppError('Failed to exchange Discord code', 400);
        }
    }

    /**
     * Get Discord user data from access token
     */
    static async getDiscordUser(accessToken: string): Promise<DiscordUser> {
        try {
            const response = await axios.get(config.discord.userUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        } catch (error) {
            throw new AppError('Failed to fetch Discord user', 400);
        }
    }

    /**
     * Create or update user from Discord data
     */
    static async createOrUpdateUser(discordUser: DiscordUser) {
        let user = await User.findOne({ discordId: discordUser.id });

        if (user) {
            // Update existing user
            user.username = discordUser.username;
            user.discriminator = discordUser.discriminator;
            user.avatar = discordUser.avatar;
            user.lastLogin = new Date();
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                discordId: discordUser.id,
                username: discordUser.username,
                discriminator: discordUser.discriminator,
                avatar: discordUser.avatar,
                email: discordUser.email,
                role: 'user',
                lastLogin: new Date(),
            });
        }

        return user;
    }

    /**
     * Generate JWT token for user
     */
    static generateToken(userId: string, discordId: string): string {
        return jwt.sign(
            { userId, discordId },
            config.jwt.secret,
            { expiresIn: config.jwt.expiry }
        );
    }

    /**
     * Complete Discord OAuth flow
     */
    static async handleDiscordCallback(code: string) {
        // Exchange code for access token
        const accessToken = await this.getDiscordToken(code);

        // Get Discord user data
        const discordUser = await this.getDiscordUser(accessToken);

        // Create or update user in database
        const user = await this.createOrUpdateUser(discordUser);

        // Generate JWT token
        const token = this.generateToken(user._id.toString(), user.discordId);

        return {
            token,
            user: {
                id: user._id,
                discordId: user.discordId,
                username: user.username,
                avatar: user.avatar,
                role: user.role,
            },
        };
    }
}
