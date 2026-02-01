import { Download, Code, Gamepad2, Puzzle, Target, Zap } from 'lucide-react';

export default function DevCenter() {
    const gameTemplates = [
        {
            id: 1,
            name: 'Platform Adventure',
            description: 'Complete platformer with multiple levels, enemies, coins, and lives system. Includes modular JS files.',
            icon: Gamepad2,
            features: ['2 Levels', 'Enemy AI', 'Coin Collection', 'Lives System', 'Modular Code', 'Responsive'],
            size: '~8 files',
            downloadUrl: '/templates/platformer-game.zip',
            color: 'blue',
            status: 'complete',
            type: 'multi-file'
        },
        {
            id: 2,
            name: 'Match-3 Puzzle',
            description: 'Grid-based puzzle game with matching mechanics, animations, and move counter. Single HTML file.',
            icon: Puzzle,
            features: ['Grid System', 'Match Detection', 'Animations', 'Move Counter', 'Score System', 'Responsive'],
            size: '1 file',
            downloadUrl: '/templates/puzzle-game.zip',
            color: 'purple',
            status: 'complete',
            type: 'single-file'
        },
        {
            id: 3,
            name: 'Space Shooter',
            description: 'Action shooter with enemy waves, bullet system, and health tracking. Single HTML file.',
            icon: Target,
            features: ['Ship Controls', 'Enemy Waves', 'Bullet System', 'Health Bar', 'Score System', 'Responsive'],
            size: '1 file',
            downloadUrl: '/templates/space-shooter.zip',
            color: 'red',
            status: 'complete',
            type: 'single-file'
        },
        {
            id: 4,
            name: 'Endless Runner',
            description: 'Infinite runner with procedural generation, obstacles, and increasing difficulty. Single HTML file.',
            icon: Zap,
            features: ['Infinite Scroll', 'Procedural Gen', 'Jump Mechanics', 'Score System', 'Difficulty Curve', 'Responsive'],
            size: '1 file',
            downloadUrl: '/templates/endless-runner.zip',
            color: 'green',
            status: 'complete',
            type: 'single-file'
        },
        {
            id: 5,
            name: '3D FPS Shooter',
            description: '3D first-person shooter with Three.js. Realistic graphics, enemy AI, and shooting mechanics.',
            icon: Target,
            features: ['3D Graphics', 'FPS Controls', 'Enemy AI', 'Weapon System', 'Health/Ammo', 'Three.js'],
            size: '~7 files',
            downloadUrl: '/templates/3d-fps-shooter.zip',
            color: 'red',
            status: 'complete',
            type: 'multi-file-3d'
        },
    ];

    const handleDownload = (template: typeof gameTemplates[0]) => {
        // All templates are now ZIP files - download directly
        const link = document.createElement('a');
        link.href = template.downloadUrl;
        link.download = template.downloadUrl.split('/').pop() || 'game-template.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const colorClasses = {
        blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
        green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Game Development Center</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Download pre-built game templates to kickstart your development
                </p>
            </div>

            {/* Info Banner */}
            <div className="card bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Ready-to-Download Game Templates
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                            All templates are packaged as ZIP files for instant download. Extract, customize, and upload to your portal!
                        </p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>✓ Download as ZIP file (one click)</li>
                            <li>✓ Extract and customize</li>
                            <li>✓ Test locally in browser</li>
                            <li>✓ Re-ZIP and upload to portal</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gameTemplates.map((template) => (
                    <div key={template.id} className="card hover:shadow-xl transition-shadow">
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-lg ${colorClasses[template.color as keyof typeof colorClasses]}`}>
                                <template.icon className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {template.name}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${template.type === 'multi-file'
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                        }`}>
                                        {template.type === 'multi-file' ? 'MULTI-FILE' : 'SINGLE-FILE'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {template.description}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Features:
                            </h4>
                            <ul className="grid grid-cols-2 gap-2">
                                {template.features.map((feature, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {template.size}
                                </span>
                                <span className={`ml-3 text-xs ${template.type === 'multi-file'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-purple-600 dark:text-purple-400'
                                    }`}>
                                    {template.type === 'multi-file' ? '📁 Multi-file' : '📄 Single-file'}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDownload(template)}
                                className="btn-primary"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Documentation Section */}
            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Getting Started
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div>
                        <h3 className="font-semibold mb-2">1. Download a Template</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Choose a template that matches your game idea and click the download button.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">2. Extract the ZIP File</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Extract the downloaded ZIP file to your development folder. The template includes all necessary files.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">3. Customize Your Game</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Edit the HTML, CSS, and JavaScript files to customize the game. Replace assets with your own graphics and sounds.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">4. Test Locally</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Open index.html in your browser to test the game. Make sure everything works before uploading.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">5. Upload to Portal</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Once ready, ZIP your modified game folder and upload it using the "Upload ZIP Game" feature.
                        </p>
                    </div>
                </div>
            </div>

            {/* Additional Resources */}
            <div className="card bg-gray-50 dark:bg-dark-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Additional Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="https://developer.mozilla.org/en-US/docs/Games"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-white dark:bg-dark-900 rounded-lg hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">MDN Game Development</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Comprehensive guides and tutorials for HTML5 game development
                        </p>
                    </a>
                    <a
                        href="https://phaser.io/tutorials"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-white dark:bg-dark-900 rounded-lg hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phaser Framework</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Popular HTML5 game framework with extensive documentation
                        </p>
                    </a>
                    <a
                        href="https://opengameart.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-white dark:bg-dark-900 rounded-lg hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Free Game Assets</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Download free sprites, sounds, and music for your games
                        </p>
                    </a>
                </div>
            </div>
        </div>
    );
}
