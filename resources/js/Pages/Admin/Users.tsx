import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Shield, Ban, Trash2, UserCheck, Search } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    is_banned: boolean;
    banned_at: string | null;
    ban_reason: string | null;
    created_at: string;
    stats?: {
        post_count: number;
        xp: number;
    };
}

interface PaginatedUsers {
    data: User[];
    links: any[];
    current_page: number;
    last_page: number;
}

export default function AdminUsers({ users }: { users: PaginatedUsers }) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search, filter }, { preserveState: true });
    };

    const handleBan = (user: User) => {
        const reason = prompt('Enter ban reason (optional):');
        if (reason !== null) {
            router.post(`/admin/users/${user.id}/ban`, { reason }, {
                preserveScroll: true,
            });
        }
    };

    const handleUnban = (user: User) => {
        if (confirm(`Unban ${user.name}?`)) {
            router.post(`/admin/users/${user.id}/unban`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}? This will also delete all their posts and data.`)) {
            router.delete(`/admin/users/${user.id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleMakeAdmin = (user: User) => {
        if (confirm(`Make ${user.name} an admin?`)) {
            router.post(`/admin/users/${user.id}/make-admin`, {}, {
                preserveScroll: true,
            });
        }
    };

    const handleRemoveAdmin = (user: User) => {
        if (confirm(`Remove admin privileges from ${user.name}?`)) {
            router.post(`/admin/users/${user.id}/remove-admin`, {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Search and Filter */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Users</option>
                                <option value="banned">Banned</option>
                                <option value="admin">Admins</option>
                            </select>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className={user.is_banned ? 'bg-red-50' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                        {user.name}
                                                        {user.is_admin && (
                                                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Admin</span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.stats && (
                                                    <div>
                                                        <div>Posts: {user.stats.post_count}</div>
                                                        <div>XP: {user.stats.xp}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.is_banned ? (
                                                    <div>
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Banned
                                                        </span>
                                                        {user.ban_reason && (
                                                            <div className="text-xs text-gray-500 mt-1">{user.ban_reason}</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    {!user.is_admin && (
                                                        <button
                                                            onClick={() => handleMakeAdmin(user)}
                                                            className="text-purple-600 hover:text-purple-900"
                                                            title="Make Admin"
                                                        >
                                                            <UserCheck className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {user.is_admin && (
                                                        <button
                                                            onClick={() => handleRemoveAdmin(user)}
                                                            className="text-gray-600 hover:text-gray-900"
                                                            title="Remove Admin"
                                                        >
                                                            <UserCheck className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {user.is_banned ? (
                                                        <button
                                                            onClick={() => handleUnban(user)}
                                                            className="text-green-600 hover:text-green-900"
                                                            title="Unban"
                                                        >
                                                            <Ban className="w-5 h-5" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleBan(user)}
                                                            className="text-orange-600 hover:text-orange-900"
                                                            title="Ban"
                                                        >
                                                            <Ban className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {!user.is_admin && (
                                                        <button
                                                            onClick={() => handleDelete(user)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    Page {users.current_page} of {users.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {users.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.visit(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1 rounded ${
                                                link.active
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
