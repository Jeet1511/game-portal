const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
    avatar: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    isBanned: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    stats: {
        totalGames: { type: Number, default: 0 },
        totalScore: { type: Number, default: 0 },
        achievements: { type: [String], default: [] }
    },
    preferences: {
        theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
        notifications: { type: Boolean, default: true }
    },
    lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const existing = await User.findOne({ email: 'admin@gameportal.com' });
        if (existing) {
            console.log('⚠️  Admin already exists!');
            console.log('Email: admin@gameportal.com');
            console.log('Password: admin123');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        await User.create({
            discordId: 'admin_' + Date.now(),
            username: 'Admin',
            discriminator: '0000',
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',
            email: 'admin@gameportal.com',
            password: hashedPassword,
            role: 'admin',
            isBanned: false
        });

        console.log('✅ Admin user created!');
        console.log('📧 Email: admin@gameportal.com');
        console.log('🔑 Password: admin123');
        console.log('\nYou can now login!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
