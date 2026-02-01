import { useState, useEffect } from 'react';
import { Trophy, Calendar } from 'lucide-react';
import api from '../utils/api';

interface LeaderboardEntry {
    _id: string;
    username: string;
    avatar: string;
    totalScore: number;
    totalPlays: number;
    avgScore: number;
}

export default function Leaderboards() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('all');

    useEffect(() => {
        fetchLeaderboard();
    }, [period]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/leaderboards?period=${period}&limit=50`);
            setLeaderboard(response.data.data.leaderboard);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboards</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Top players across all games
                    </p>
                </div>
            </div>

            {/* Period Filter */}
            <div className="card">
                <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="input w-48"
                    >
                        <option value="all">All Time</option>
                        <option value="monthly">This Month</option>
                        <option value="weekly">This Week</option>
                    </select>
                </div>
            </div>

            {/* Leaderboard */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Loading leaderboard...</p>
                </div>
            ) : leaderboard.length === 0 ? (
                <div className="card text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No scores yet</p>
                </div>
            ) : (
                <div className="card">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-dark-700">
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Rank</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Player</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Total Score</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Games Played</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Avg Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, index) => (
                                <tr key={entry._id} className="border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {index < 3 ? (
                                                <Trophy className={`w-5 h-5 ${index === 0 ? 'text-yellow-500' :
                                                    index === 1 ? 'text-gray-400' :
                                                        'text-orange-600'
                                                    }`} />
                                            ) : (
                                                <span className="text-gray-600 dark:text-gray-400 font-medium w-5 text-center">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={entry.avatar || `https://ui-avatars.com/api/?name=${entry.username}`}
                                                alt={entry.username}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <span className="font-medium text-gray-900 dark:text-white">{entry.username}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-right font-bold text-primary-600 dark:text-primary-400">
                                        {entry.totalScore.toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                                        {entry.totalPlays}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                                        {Math.round(entry.avgScore)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
