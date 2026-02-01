import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import api from '../../utils/api';

export default function AddGame() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'action',
        difficulty: 'medium',
        engine: 'phaser',
        assetUrl: '',
    });

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('difficulty', formData.difficulty);
            data.append('engine', formData.engine);
            data.append('assetUrl', formData.assetUrl);
            if (thumbnail) {
                data.append('thumbnail', thumbnail);
            }

            await api.post('/admin/games', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/games');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create game');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/games')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Game</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Upload a new game to your portal
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="card space-y-6">
                    {/* Game Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Game Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            placeholder="Enter game name"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input min-h-[120px]"
                            placeholder="Enter game description"
                        />
                    </div>

                    {/* Category & Difficulty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="input"
                            >
                                <option value="action">Action</option>
                                <option value="puzzle">Puzzle</option>
                                <option value="arcade">Arcade</option>
                                <option value="strategy">Strategy</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Difficulty *
                            </label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="input"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Engine */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Game Engine *
                        </label>
                        <select
                            value={formData.engine}
                            onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                            className="input"
                        >
                            <option value="phaser">Phaser</option>
                            <option value="canvas">Canvas</option>
                            <option value="three">Three.js</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    {/* Asset URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Game URL *
                        </label>
                        <input
                            type="url"
                            required
                            value={formData.assetUrl}
                            onChange={(e) => setFormData({ ...formData, assetUrl: e.target.value })}
                            className="input"
                            placeholder="https://example.com/game.html"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            URL where the game is hosted
                        </p>
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Thumbnail Image *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-6 text-center">
                            {thumbnailPreview ? (
                                <div className="space-y-4">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Preview"
                                        className="max-h-64 mx-auto rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setThumbnail(null);
                                            setThumbnailPreview('');
                                        }}
                                        className="btn-secondary"
                                    >
                                        Change Image
                                    </button>
                                </div>
                            ) : (
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                        required
                                    />
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        Click to upload thumbnail
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        PNG, JPG up to 5MB
                                    </p>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Game'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/games')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
