import AdminLayout from '@/Layouts/AdminLayout';
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
        <AdminLayout
            header={
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-accent-primary" />
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Search and Filter */}
                    <div className="bg-dark-700/60 backdrop-blur-sm border border-accent-primary/20 rounded-xl p-6">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-dark-800 border border-accent-secondary/30 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/20"
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 rounded-lg bg-dark-800 border border-accent-secondary/30 text-slate-100 focus:outline-none focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/20"
                            >
                                <option value="all">All Users</option>
                                <option value="banned">Banned</option>
                                <option value="admin">Admins</option>
                            </select>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-accent-primary to-accent-purple text-white rounded-lg transition hover:opacity-90"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-hidden border border-accent-primary/20 rounded-xl">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-accent-primary/20">
                                <thead className="bg-dark-800/60">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Stats</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-dark-800 divide-y divide-accent-primary/10">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className={user.is_banned ? 'bg-red-900/20' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-slate-100 flex items-center gap-2">
                                                        {user.name}
                                                        {user.is_admin && (
                                                            <span className="px-2 py-1 text-xs bg-accent-purple/20 text-accent-purple rounded border border-accent-purple/30">Admin</span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-400">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
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
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/20 text-red-300 border border-red-400/30">
                                                            Banned
                                                        </span>
                                                        {user.ban_reason && (
                                                            <div className="text-xs text-slate-400 mt-1">{user.ban_reason}</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    {!user.is_admin && (
                                                        <button
                                                            onClick={() => handleMakeAdmin(user)}
                                                            className="text-accent-purple hover:opacity-80"
                                                            title="Make Admin"
                                                        >
                                                            <UserCheck className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {user.is_admin && (
                                                        <button
                                                            onClick={() => handleRemoveAdmin(user)}
                                                            className="text-slate-300 hover:opacity-80"
                                                            title="Remove Admin"
                                                        >
                                                            <UserCheck className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {user.is_banned ? (
                                                        <button
                                                            onClick={() => handleUnban(user)}
                                                            className="text-emerald-400 hover:opacity-80"
                                                            title="Unban"
                                                        >
                                                            <Ban className="w-5 h-5" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleBan(user)}
                                                            className="text-orange-400 hover:opacity-80"
                                                            title="Ban"
                                                        >
                                                            <Ban className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {!user.is_admin && (
                                                        <button
                                                            onClick={() => handleDelete(user)}
                                                            className="text-red-400 hover:opacity-80"
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
                            <div className="px-6 py-4 border-t border-accent-primary/20 flex justify-between items-center bg-dark-800/60">
                                <div className="text-sm text-slate-400">
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
                                                    ? 'bg-gradient-to-r from-accent-primary to-accent-purple text-white'
                                                    : 'bg-dark-700 text-slate-300 hover:bg-dark-600 border border-accent-primary/20'
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
        </AdminLayout>
    );
}
