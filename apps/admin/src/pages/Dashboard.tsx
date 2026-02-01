import { useState, useEffect } from 'react';
import { Users, Gamepad2, Trophy, TrendingUp, Activity } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalGames: 0,
        activePlayers: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        // TODO: Fetch real stats from API
        // For now, using mock data
        setStats({
            totalUsers: 1234,
            totalGames: 42,
            activePlayers: 567,
            totalRevenue: 89012,
        });
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            change: '+12.5%',
        },
        {
            title: 'Total Games',
            value: stats.totalGames,
            icon: Gamepad2,
            color: 'from-purple-500 to-purple-600',
            change: '+3',
        },
        {
            title: 'Active Players',
            value: stats.activePlayers.toLocaleString(),
            icon: Activity,
            color: 'from-green-500 to-green-600',
            change: '+8.2%',
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: 'from-orange-500 to-orange-600',
            change: '+15.3%',
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Welcome back! Here's what's happening with your game portal.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="card hover:shadow-xl transition-shadow duration-200"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                        {stat.change} from last month
                                    </p>
                                </div>
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Placeholder for more content */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Activity feed will be displayed here. Implement this by fetching recent actions from your API.
                </p>
            </div>

            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="btn-primary justify-center">
                        <Gamepad2 className="w-5 h-5" />
                        Add New Game
                    </button>
                    <button className="btn-secondary justify-center">
                        <Users className="w-5 h-5" />
                        Manage Users
                    </button>
                    <button className="btn-secondary justify-center">
                        <Trophy className="w-5 h-5" />
                        View Leaderboards
                    </button>
                </div>
            </div>
        </div>
    );
}
