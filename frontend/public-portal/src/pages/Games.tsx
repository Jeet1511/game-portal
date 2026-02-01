import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Gamepad2 } from 'lucide-react';
import api from '../utils/api';

interface Game {
    _id: string;
    title: string;
    description: string;
    category: string;
    thumbnailUrl: string;
    stats: {
        plays: number;
    };
}

export default function Games() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        loadGames();
    }, [search, category]);

    const loadGames = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);

            const response = await api.get(`/public/games?${params}`);
            setGames(response.data.data.games);
        } catch (error) {
            console.error('Error loading games:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-white mb-8">All Games</h1>

                {/* Filters */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">All Categories</option>
                        <option value="Action">Action</option>
                        <option value="Puzzle">Puzzle</option>
                        <option value="Strategy">Strategy</option>
                        <option value="Arcade">Arcade</option>
                        <option value="Adventure">Adventure</option>
                    </select>
                </div>

                {/* Games Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white/10 rounded-lg h-64 animate-pulse" />
                        ))}
                    </div>
                ) : games.length === 0 ? (
                    <div className="text-center py-20">
                        <Gamepad2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No games found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {games.map((game) => (
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
                                            <Gamepad2 className="w-12 h-12 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {game.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                                        {game.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">
                                            {game.stats.plays} plays
                                        </span>
                                        <span className="px-2 py-1 bg-purple-600/30 rounded text-purple-300 text-xs">
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
    );
}
