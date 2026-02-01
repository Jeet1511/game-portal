import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@gameportal.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log('Email:', existingAdmin.email);
            console.log('Username:', existingAdmin.username);
            process.exit(0);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@gameportal.com',
            password: hashedPassword,
            discordId: 'admin_discord_id',
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',
            role: 'admin',
            isBanned: false,
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', adminUser.email);
        console.log('👤 Username:', adminUser.username);
        console.log('🔑 Password: admin123');
        console.log('\nYou can now login with these credentials!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
