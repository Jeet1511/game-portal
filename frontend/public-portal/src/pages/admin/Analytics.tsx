import { useState, useEffect } from 'react';
import { TrendingUp, Users, Gamepad2, Activity } from 'lucide-react';
import api from '../utils/api';

interface OverviewStats {
    totalUsers: number;
    totalGames: number;
    activePlayers: number;
    playsToday: number;
    userGrowth: number;
}

interface GamePopularity {
    _id: string;
    name: string;
    stats: {
        totalPlays: number;
        averageScore: number;
    };
}

export default function Analytics() {
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [gamePopularity, setGamePopularity] = useState<GamePopularity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [overviewRes, gamesRes] = await Promise.all([
                api.get('/admin/analytics/overview'),
                api.get('/admin/analytics/games'),
            ]);

            setStats(overviewRes.data.data);
            setGamePopularity(gamesRes.data.data.gamePopularity);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-4">Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Insights and statistics about your portal
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats?.totalUsers.toLocaleString()}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                +{stats?.userGrowth}% this month
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Games</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats?.totalGames}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                            <Gamepad2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Players</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats?.activePlayers}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Last 24 hours</p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Plays Today</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats?.playsToday.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Popularity */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Most Popular Games
                </h2>
                <div className="space-y-4">
                    {gamePopularity.map((game, index) => (
                        <div key={game._id} className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-gray-400 w-8">
                                {index + 1}
                            </span>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">{game.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {game.stats.totalPlays.toLocaleString()} plays • Avg Score: {Math.round(game.stats.averageScore)}
                                </p>
                            </div>
                            <div className="w-32 bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full"
                                    style={{
                                        width: `${Math.min((game.stats.totalPlays / gamePopularity[0].stats.totalPlays) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
