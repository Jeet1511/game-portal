import { useState, useEffect } from 'react';
import { Users, Gamepad2, Activity, TrendingUp, Plus, Eye, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

interface Stats {
    totalUsers: number;
    totalGames: number;
    activePlayers: number;
    playsToday: number;
    userGrowth: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/analytics/overview');
            setStats(response.data.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-4">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Welcome back! Here's what's happening with your game portal.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats?.totalUsers.toLocaleString() || 0}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                +{stats?.userGrowth || 0}% from last month
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Games</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats?.totalGames || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                            <Gamepad2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Players</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats?.activePlayers || 0}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Last 24 hours</p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Plays Today</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats?.playsToday.toLocaleString() || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/games/new" className="btn-primary justify-center">
                        <Plus className="w-5 h-5" />
                        Add New Game
                    </Link>
                    <Link to="/users" className="btn-secondary justify-center">
                        <Eye className="w-5 h-5" />
                        Manage Users
                    </Link>
                    <Link to="/leaderboards" className="btn-secondary justify-center">
                        <Trophy className="w-5 h-5" />
                        View Leaderboards
                    </Link>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    Activity feed will be displayed here. Implement by fetching from /api/admin/analytics/activity
                </p>
            </div>
        </div>
    );
}
