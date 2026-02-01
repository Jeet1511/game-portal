import { Search, Bell, User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const { admin, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="h-16 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 fixed top-0 right-0 left-64 z-40">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search games, users..."
                            className="w-full pl-11 pr-4 py-2 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                    >
                        {darkMode ? (
                            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        )}
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
                        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                        >
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {admin?.username || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {admin?.role || 'Super Admin'}
                                </p>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-2">
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {admin?.username || 'Admin'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {admin?.email || 'admin@gameportal.com'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
