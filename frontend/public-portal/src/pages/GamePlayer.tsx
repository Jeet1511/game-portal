import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import api from '../utils/api';

interface Game {
    _id: string;
    title: string;
    description: string;
    category: string;
    gameUrl: string;
    stats: {
        plays: number;
        averageScore: number;
    };
}

export default function GamePlayer() {
    const { id } = useParams();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGame();
    }, [id]);

    const loadGame = async () => {
        try {
            const response = await api.get(`/public/games/${id}`);
            setGame(response.data.data.game);
        } catch (error) {
            console.error('Error loading game:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading game...</div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Gamepad2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-4">Game not found</p>
                    <Link to="/games" className="text-purple-400 hover:text-purple-300">
                        Back to Games
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
                <div className="container mx-auto flex items-center justify-between">
                    <Link
                        to="/games"
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Games
                    </Link>
                    <h1 className="text-xl font-semibold text-white">{game.title}</h1>
                    <div className="text-gray-400 text-sm">
                        {game.stats.plays} plays
                    </div>
                </div>
            </div>

            {/* Game iframe */}
            <div className="container mx-auto p-4">
                <div className="bg-black rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
                    <iframe
                        src={`http://localhost:8080${game.gameUrl}`}
                        className="w-full h-full border-0"
                        title={game.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
