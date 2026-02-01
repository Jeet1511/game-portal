import { Search, Bell, User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [darkMode, setDarkMode] = useState(() => {
        // Load theme from localStorage on initial render
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const { admin, logout } = useAuthStore();
    const navigate = useNavigate();

    // Apply theme on mount and when darkMode changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to games page with search query
            navigate(`/admin/games?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="h-16 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 fixed top-0 right-0 left-64 z-40">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-2xl">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search games, users... (Press Enter)"
                            className="w-full pl-11 pr-4 py-2 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </form>
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
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                        >
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 py-2 max-h-96 overflow-y-auto">
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-700">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                </div>

                                {/* Sample Notifications */}
                                <div className="divide-y divide-gray-200 dark:divide-dark-700">
                                    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">New game uploaded</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">A new game "Space Adventure" was added</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                                    </div>
                                    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">User reported content</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">User @john flagged a game for review</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">5 hours ago</p>
                                    </div>
                                    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">System update</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Platform updated to v2.1.0</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 day ago</p>
                                    </div>
                                </div>

                                <div className="px-4 py-3 border-t border-gray-200 dark:border-dark-700">
                                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

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
                                    onClick={() => navigate('/admin/settings')}
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
