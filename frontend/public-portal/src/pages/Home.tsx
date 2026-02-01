import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, TrendingUp } from 'lucide-react';
import api from '../utils/api';

interface Game {
    _id: string;
    title: string;
    description: string;
    category: string;
    thumbnailUrl: string;
    stats: {
        plays: number;
        averageScore: number;
    };
}

export default function Home() {
    const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeaturedGames();
    }, []);

    const loadFeaturedGames = async () => {
        try {
            const response = await api.get('/public/games/featured/list');
            setFeaturedGames(response.data.data.games);
        } catch (error) {
            console.error('Error loading games:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold text-white mb-6">
                        Welcome to Game Portal
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Play amazing HTML5 games right in your browser
                    </p>
                    <Link
                        to="/games"
                        className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                    >
                        Browse All Games
                    </Link>
                </div>

                {/* Featured Games */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8" />
                        Featured Games
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white/10 rounded-lg h-64 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredGames.map((game) => (
                                <Link
                                    key={game._id}
                                    to={`/game/${game._id}`}
                                    className="group bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition"
                                >
                                    <div className="aspect-video bg-gray-800 relative overflow-hidden">
                                        {game.thumbnailUrl ? (
                                            <img
                                                src={game.thumbnailUrl}
                                                alt={game.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Gamepad2 className="w-16 h-16 text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {game.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                                            {game.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Gamepad2 className="w-4 h-4" />
                                                {game.stats.plays} plays
                                            </span>
                                            <span className="px-2 py-1 bg-purple-600/30 rounded text-purple-300">
                                                {game.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
