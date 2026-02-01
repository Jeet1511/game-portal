import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserX, Eye, Ban, Trash2 } from 'lucide-react';
import api from '../../utils/api';

interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    discordId: string;
    isBanned: boolean;
    createdAt: string;
    lastActive: string;
}

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [search, statusFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);

            const response = await api.get(`/admin/users?${params.toString()}`);
            setUsers(response.data.data.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (id: string, isBanned: boolean) => {
        const action = isBanned ? 'unban' : 'ban';
        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            await api.put(`/admin/users/${id}/${action}`);
            fetchUsers();
        } catch (error) {
            console.error(`Failed to ${action} user:`, error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage all users in your portal
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name, email, or Discord ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-11"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input w-48"
                    >
                        <option value="">All Users</option>
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Loading users...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="card text-center py-12">
                    <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No users found</p>
                </div>
            ) : (
                <div className="card">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-dark-700">
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Discord ID</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Joined</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
                                                alt={user.username}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 font-mono text-sm">
                                        {user.discordId}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs rounded ${user.isBanned
                                                ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                                : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                            }`}>
                                            {user.isBanned ? 'Banned' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/users/${user._id}`}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            </Link>
                                            <button
                                                onClick={() => handleBan(user._id, user.isBanned)}
                                                className={`p-2 rounded transition-colors ${user.isBanned
                                                        ? 'hover:bg-green-100 dark:hover:bg-green-900/20'
                                                        : 'hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                                                    }`}
                                                title={user.isBanned ? 'Unban User' : 'Ban User'}
                                            >
                                                <Ban className={`w-4 h-4 ${user.isBanned
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-yellow-600 dark:text-yellow-400'
                                                    }`} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                                                title="Delete User"
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
