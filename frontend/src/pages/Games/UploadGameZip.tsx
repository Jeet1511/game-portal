import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileArchive } from 'lucide-react';
import api from '../../utils/api';

export default function UploadGameZip() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'action',
        difficulty: 'medium',
        tags: '',
    });
    const [gameZip, setGameZip] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gameZip) {
            setError('Please select a game ZIP file');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('difficulty', formData.difficulty);
            data.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())));
            data.append('gameZip', gameZip);
            if (thumbnail) {
                data.append('thumbnail', thumbnail);
            }

            await api.post('/admin/games/upload-zip', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Game uploaded successfully!');
            navigate('/admin/games');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to upload game';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload HTML Game (ZIP)</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Upload a complete HTML5 game as a ZIP file. The ZIP must contain an index.html file.
                </p>
            </div>

            {/* Security Error Modal */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                                🔒 Security Validation Failed
                            </h3>
                            <div className="text-red-700 dark:text-red-300 whitespace-pre-wrap font-mono text-sm">
                                {error}
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="card max-w-3xl">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Game Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="input"
                            >
                                <option value="action">Action</option>
                                <option value="puzzle">Puzzle</option>
                                <option value="strategy">Strategy</option>
                                <option value="arcade">Arcade</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Difficulty
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="input"
                            placeholder="html5, multiplayer, fun"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Game ZIP File * (must contain index.html)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                            <FileArchive className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <input
                                type="file"
                                accept=".zip"
                                onChange={(e) => setGameZip(e.target.files?.[0] || null)}
                                className="hidden"
                                id="gameZip"
                            />
                            <label htmlFor="gameZip" className="cursor-pointer text-primary-600 hover:text-primary-700">
                                {gameZip ? gameZip.name : 'Click to select ZIP file'}
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Thumbnail Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            className="input"
                        />
                        {thumbnail && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{thumbnail.name}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full justify-center"
                    >
                        <Upload className="w-5 h-5" />
                        {loading ? 'Uploading...' : 'Upload Game'}
                    </button>
                </div>
            </form>
        </div>
    );
}
