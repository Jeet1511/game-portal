import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Gamepad2,
    Users,
    Trophy,
    BarChart3,
    Settings,
    Plus,
    List,
    FolderOpen,
    UserX,
    ChevronLeft,
    ChevronRight,
    Code
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });

    // Save collapsed state to localStorage
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', collapsed.toString());
    }, [collapsed]);

    const navigation = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'Games',
            icon: Gamepad2,
            children: [
                { name: 'All Games', href: '/admin/games', icon: List },
                { name: 'Add New Game', href: '/admin/games/new', icon: Plus },
                { name: 'Upload ZIP Game', href: '/admin/games/upload-zip', icon: FolderOpen },
            ],
        },
        {
            name: 'Users',
            icon: Users,
            children: [
                { name: 'All Users', href: '/admin/users', icon: List },
                { name: 'Banned Users', href: '/admin/users/banned', icon: UserX },
            ],
        },
        {
            name: 'Leaderboards',
            href: '/admin/leaderboards',
            icon: Trophy,
        },
        {
            name: 'Analytics',
            href: '/admin/analytics',
            icon: BarChart3,
        },
        {
            name: 'Dev Center',
            href: '/admin/dev-center',
            icon: Code,
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: Settings,
        },
    ];

    const [openMenus, setOpenMenus] = useState<string[]>(['Games', 'Users']);

    const toggleMenu = (name: string) => {
        setOpenMenus(prev =>
            prev.includes(name)
                ? prev.filter(item => item !== name)
                : [...prev, name]
        );
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-dark-700">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <Gamepad2 className="w-8 h-8 text-primary-600" />
                        <span className="font-bold text-xl text-gray-900 dark:text-white">
                            Game Portal
                        </span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
                <ul className="space-y-2">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors ${collapsed ? 'justify-center' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            {!collapsed && <span className="font-medium">{item.name}</span>}
                                        </div>
                                        {!collapsed && (
                                            <ChevronRight
                                                className={`w-4 h-4 transition-transform ${openMenus.includes(item.name) ? 'rotate-90' : ''
                                                    }`}
                                            />
                                        )}
                                    </button>
                                    {!collapsed && openMenus.includes(item.name) && (
                                        <ul className="mt-2 ml-4 space-y-1">
                                            {item.children.map((child) => (
                                                <li key={child.name}>
                                                    <NavLink
                                                        to={child.href}
                                                        className={({ isActive }) =>
                                                            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
                                                            }`
                                                        }
                                                    >
                                                        <child.icon className="w-4 h-4" />
                                                        <span className="text-sm">{child.name}</span>
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                <NavLink
                                    to={item.href!}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                                        } ${collapsed ? 'justify-center' : ''}`
                                    }
                                >
                                    <item.icon className="w-5 h-5" />
                                    {!collapsed && <span className="font-medium">{item.name}</span>}
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
