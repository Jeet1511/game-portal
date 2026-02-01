import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Search, Filter, Star, Play } from 'lucide-react';

interface GameTemplate {
    id: number;
    name: string;
    description: string;
    category: string;
    thumbnail: string;
    playUrl: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
}

export default function PublicGames() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // All available games (templates)
    const games: GameTemplate[] = [
        {
            id: 1,
            name: 'Platform Adventure',
            description: 'Jump through platforms, collect coins, and avoid enemies in this classic platformer!',
            category: 'Platformer',
            thumbnail: '/templates/platformer-preview.png',
            playUrl: '/templates/platformer-game/index.html',
            difficulty: 'Medium',
            tags: ['2D', 'Action', 'Casual']
        },
        {
            id: 2,
            name: 'Match-3 Puzzle',
            description: 'Match colorful gems in this addictive puzzle game. How high can you score?',
            category: 'Puzzle',
            thumbnail: '/templates/puzzle-preview.png',
            playUrl: '/templates/puzzle-template.html',
            difficulty: 'Easy',
            tags: ['Puzzle', 'Casual', 'Strategy']
        },
        {
            id: 3,
            name: 'Space Shooter',
            description: 'Defend against waves of enemies in this intense space shooter!',
            category: 'Shooter',
            thumbnail: '/templates/shooter-preview.png',
            playUrl: '/templates/shooter-template.html',
            difficulty: 'Medium',
            tags: ['2D', 'Action', 'Shooter']
        },
        {
            id: 4,
            name: 'Endless Runner',
            description: 'Run, jump, and dodge obstacles in this fast-paced endless runner!',
            category: 'Runner',
            thumbnail: '/templates/runner-preview.png',
            playUrl: '/templates/runner-template.html',
            difficulty: 'Easy',
            tags: ['2D', 'Action', 'Casual']
        },
        {
            id: 5,
            name: '3D FPS Shooter',
            description: 'Immersive 3D first-person shooter with realistic graphics and intense combat!',
            category: 'Shooter',
            thumbnail: '/templates/fps-preview.png',
            playUrl: '/templates/3d-fps-shooter/index.html',
            difficulty: 'Hard',
            tags: ['3D', 'FPS', 'Action']
        }
    ];

    const categories = ['All', ...Array.from(new Set(games.map(g => g.category)))];

    const filteredGames = games.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-900/30';
            case 'Medium': return 'text-yellow-400 bg-yellow-900/30';
            case 'Hard': return 'text-red-400 bg-red-900/30';
            default: return 'text-gray-400 bg-gray-900/30';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Header */}
            <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
                            <Gamepad2 className="w-8 h-8" />
                            Game Portal
                        </Link>
                        <Link
                            to="/admin/login"
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Page Title */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Browse Games
                    </h1>
                    <p className="text-xl text-gray-300">
                        {filteredGames.length} amazing games to play
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search games..."
                            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${selectedCategory === category
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Games Grid */}
                {filteredGames.length === 0 ? (
                    <div className="text-center py-20">
                        <Gamepad2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-xl text-gray-400">No games found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGames.map((game) => (
                            <div
                                key={game.id}
                                className="group bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/15 transition border border-white/10 hover:border-purple-500/50"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-video bg-gradient-to-br from-purple-900 to-blue-900 relative overflow-hidden">
                                    <img
                                        src={game.thumbnail}
                                        alt={game.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <Link
                                            to={game.playUrl}
                                            target="_blank"
                                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 transition"
                                        >
                                            <Play className="w-5 h-5" />
                                            Play Now
                                        </Link>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                                            {game.name}
                                        </h3>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}>
                                            {game.difficulty}
                                        </span>
                                    </div>

                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                        {game.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {game.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Play Button */}
                                    <Link
                                        to={game.playUrl}
                                        target="_blank"
                                        className="block w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-center rounded-lg font-semibold transition"
                                    >
                                        Play Game
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
