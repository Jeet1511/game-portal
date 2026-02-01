import { useState } from 'react';
import { User, Lock, Bell, Globe, Save } from 'lucide-react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        username: 'admin',
        email: 'admin@gameportal.com',
        fullName: 'Admin User',
        bio: 'Game Portal Administrator',
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        gameUploads: true,
        userReports: true,
        systemUpdates: false,
    });

    const handleSaveProfile = () => {
        alert('Profile updated successfully!');
    };

    const handleChangePassword = () => {
        if (securityData.newPassword !== securityData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        alert('Password changed successfully!');
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleSaveNotifications = () => {
        alert('Notification settings saved!');
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'security', name: 'Security', icon: Lock },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'preferences', name: 'Preferences', icon: Globe },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Tabs Sidebar */}
                <div className="col-span-12 md:col-span-3">
                    <div className="card p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="font-medium">{tab.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="col-span-12 md:col-span-9">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="card">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        className="input"
                                        rows={3}
                                    />
                                </div>

                                <button onClick={handleSaveProfile} className="btn-primary">
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="card">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={securityData.currentPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={securityData.newPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={securityData.confirmPassword}
                                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                        className="input"
                                    />
                                </div>

                                <button onClick={handleChangePassword} className="btn-primary">
                                    <Lock className="w-5 h-5" />
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="card">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.emailNotifications}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Game Uploads</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Notify when new games are uploaded</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.gameUploads}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, gameUploads: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">User Reports</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Notify when users report content</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.userReports}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, userReports: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">System Updates</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Notify about system maintenance and updates</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={notificationSettings.systemUpdates}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, systemUpdates: e.target.checked })}
                                        className="w-5 h-5 text-primary-600 rounded"
                                    />
                                </div>

                                <button onClick={handleSaveNotifications} className="btn-primary">
                                    <Save className="w-5 h-5" />
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="card">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">General Preferences</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Language
                                    </label>
                                    <select className="input">
                                        <option>English</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                        <option>German</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Timezone
                                    </label>
                                    <select className="input">
                                        <option>UTC</option>
                                        <option>EST</option>
                                        <option>PST</option>
                                        <option>IST</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date Format
                                    </label>
                                    <select className="input">
                                        <option>MM/DD/YYYY</option>
                                        <option>DD/MM/YYYY</option>
                                        <option>YYYY-MM-DD</option>
                                    </select>
                                </div>

                                <button className="btn-primary">
                                    <Save className="w-5 h-5" />
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
