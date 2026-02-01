import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Grid3x3, List, Edit, Trash2, Eye } from 'lucide-react';
import api from '../../utils/api';

interface Game {
    _id: string;
    name: string;
    description: string;
    category: string;
    difficulty: string;
    thumbnailUrl: string;
    isActive: boolean;
    isFeatured: boolean;
    stats: {
        totalPlays: number;
        averageScore: number;
    };
}

export default function GameList() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        fetchGames();
    }, [search, categoryFilter]);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (categoryFilter) params.append('category', categoryFilter);

            const response = await api.get(`/admin/games?${params.toString()}`);
            setGames(response.data.data.games);
        } catch (error) {
            console.error('Failed to fetch games:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this game?')) return;

        try {
            await api.delete(`/admin/games/${id}`);
            fetchGames();
        } catch (error) {
            console.error('Failed to delete game:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Games</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage all games in your portal
                    </p>
                </div>
                <Link
                    to="/games/new"
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5" />
                    Add New Game
                </Link>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-11"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="input w-48"
                    >
                        <option value="">All Categories</option>
                        <option value="action">Action</option>
                        <option value="puzzle">Puzzle</option>
                        <option value="arcade">Arcade</option>
                        <option value="strategy">Strategy</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600'
                                    : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600'
                                    : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Games Grid/List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Loading games...</p>
                </div>
            ) : games.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">No games found</p>
                    <Link to="/games/new" className="btn-primary mt-4 inline-flex">
                        <Plus className="w-5 h-5" />
                        Add Your First Game
                    </Link>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <div key={game._id} className="card hover:shadow-xl transition-shadow">
                            <img
                                src={`/api/storage/download/${game.thumbnailUrl}`}
                                alt={game.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {game.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                {game.description}
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs rounded">
                                    {game.category}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                                    {game.difficulty}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                                <span>{game.stats.totalPlays} plays</span>
                                <span>Avg: {Math.round(game.stats.averageScore)}</span>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    to={`/games/${game._id}`}
                                    className="flex-1 btn-secondary justify-center text-sm"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </Link>
                                <Link
                                    to={`/games/${game._id}/edit`}
                                    className="flex-1 btn-primary justify-center text-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(game._id)}
                                    className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-dark-700">
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Game</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Category</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Plays</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Avg Score</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map((game) => (
                                <tr key={game._id} className="border-b border-gray-200 dark:border-dark-700">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`/api/storage/download/${game.thumbnailUrl}`}
                                                alt={game.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{game.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{game.difficulty}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{game.category}</td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{game.stats.totalPlays}</td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{Math.round(game.stats.averageScore)}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs rounded ${game.isActive
                                                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                                : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {game.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/games/${game._id}/edit`} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors">
                                                <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(game._id)}
                                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            </button>
                                        </div>
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
