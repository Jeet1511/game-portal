import { Link } from 'react-router-dom';
import { Gamepad2, TrendingUp, Play, Star } from 'lucide-react';

interface GameTemplate {
    id: number;
    name: string;
    description: string;
    category: string;
    playUrl: string;
    thumbnail: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
    featured: boolean;
}

export default function Home() {
    // All available template games
    const allGames: GameTemplate[] = [
        {
            id: 1,
            name: 'Platform Adventure',
            description: 'Jump through platforms, collect coins, and avoid enemies in this classic platformer!',
            category: 'Platformer',
            playUrl: '/templates/platformer-game/index.html',
            thumbnail: '/templates/platformer-preview.png',
            difficulty: 'Medium',
            tags: ['2D', 'Action', 'Casual'],
            featured: true
        },
        {
            id: 2,
            name: 'Match-3 Puzzle',
            description: 'Match colorful gems in this addictive puzzle game. How high can you score?',
            category: 'Puzzle',
            playUrl: '/templates/puzzle-template.html',
            thumbnail: '/templates/puzzle-preview.png',
            difficulty: 'Easy',
            tags: ['Puzzle', 'Casual', 'Strategy'],
            featured: true
        },
        {
            id: 3,
            name: 'Space Shooter',
            description: 'Defend against waves of enemies in this intense space shooter!',
            category: 'Shooter',
            playUrl: '/templates/shooter-template.html',
            thumbnail: '/templates/shooter-preview.png',
            difficulty: 'Medium',
            tags: ['2D', 'Action', 'Shooter'],
            featured: true
        },
        {
            id: 4,
            name: 'Endless Runner',
            description: 'Run, jump, and dodge obstacles in this fast-paced endless runner!',
            category: 'Runner',
            playUrl: '/templates/runner-template.html',
            thumbnail: '/templates/runner-preview.png',
            difficulty: 'Easy',
            tags: ['2D', 'Action', 'Casual'],
            featured: false
        },
        {
            id: 5,
            name: '3D FPS Shooter',
            description: 'Immersive 3D first-person shooter with realistic graphics and intense combat!',
            category: 'Shooter',
            playUrl: '/templates/3d-fps-shooter/index.html',
            thumbnail: '/templates/fps-preview.png',
            difficulty: 'Hard',
            tags: ['3D', 'FPS', 'Action'],
            featured: true
        }
    ];

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
                        <div className="text-2xl font-bold text-white flex items-center gap-2">
                            <Gamepad2 className="w-8 h-8" />
                            Game Portal
                        </div>
                        <div className="flex gap-4">
                            <Link
                                to="/games"
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                            >
                                Browse Games
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
            </div>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in">
                        Welcome to Game Portal
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Play {allGames.length} amazing HTML5 games right in your browser - No downloads required!
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/games"
                            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105"
                        >
                            Browse All Games
                        </Link>
                        <a
                            href="#all-games"
                            className="inline-block bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition"
                        >
                            Play Now ↓
                        </a>
                    </div>
                </div>

                {/* Featured Games */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <Star className="w-8 h-8 text-yellow-400" />
                        Featured Games
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allGames.filter(g => g.featured).map((game) => (
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
                                        <a
                                            href={game.playUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 transition"
                                        >
                                            <Play className="w-5 h-5" />
                                            Play Now
                                        </a>
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
                                    <a
                                        href={game.playUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-center rounded-lg font-semibold transition"
                                    >
                                        Play Game
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Games Section */}
                <div id="all-games" className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8" />
                        All Available Games
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allGames.map((game) => (
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
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}>
                                            {game.difficulty}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <a
                                            href={game.playUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 transition"
                                        >
                                            <Play className="w-5 h-5" />
                                            Play Now
                                        </a>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition mb-2">
                                        {game.name}
                                    </h3>

                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                        {game.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs">
                                            {game.category}
                                        </span>
                                        {game.tags.slice(0, 2).map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Play Button */}
                                    <a
                                        href={game.playUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-center rounded-lg font-semibold transition"
                                    >
                                        Play Game
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Want to add your own games?
                    </h2>
                    <p className="text-gray-300 mb-6 text-lg">
                        Download our game templates and create your own amazing games!
                    </p>
                    <Link
                        to="/admin/dev-center"
                        className="inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-green-700 hover:to-teal-700 transition transform hover:scale-105"
                    >
                        Visit Dev Center
                    </Link>
                </div>
            </div>
        </div>
    );
}
