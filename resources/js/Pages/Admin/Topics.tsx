import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Hash, Trash2, Search, TrendingUp, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Topic {
    id: number;
    name: string;
    slug: string;
    post_count: number;
    daily_post_count: number;
    view_count: number;
    daily_view_count: number;
    created_at: string;
    founder: {
        id: number;
        name: string;
    } | null;
}

interface PaginatedTopics {
    data: Topic[];
    links: any[];
    current_page: number;
    last_page: number;
}

export default function AdminTopics({ topics }: { topics: PaginatedTopics }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/topics', { search }, { preserveState: true });
    };

    const handleDelete = (topic: Topic) => {
        if (confirm(`Are you sure you want to delete #${topic.name}? This will remove the topic from all posts.`)) {
            router.delete(`/admin/topics/${topic.id}`, {
                preserveScroll: true,
            });
        }
    };

    const isNew = (createdAt: string) => {
        const created = new Date(createdAt);
        const today = new Date();
        return created.toDateString() === today.toDateString();
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-slate-100 flex items-center gap-2">
                    <Hash className="w-6 h-6 text-accent-purple" />
                    Topic/Hashtag Management
                </h2>
            }
        >
            <Head title="Topic Management" />
            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Info Box */}
                    <div className="bg-dark-700/60 backdrop-blur-sm border border-accent-primary/20 rounded-lg p-4">
                        <p className="text-sm text-slate-400">
                            <strong className="text-slate-100">Note:</strong> The leaderboard displays 10 best hashtags (by daily activity) + 5 newest hashtags created today.
                            Daily stats reset at the configured time each day.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="bg-dark-700/60 backdrop-blur-sm border border-accent-primary/20 rounded-xl p-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search topics/hashtags..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-dark-800 border-accent-secondary/30 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/20"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-accent-primary to-accent-purple text-white rounded-lg transition hover:opacity-90"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Topics Table */}
                    <div className="overflow-hidden border border-accent-primary/20 rounded-xl">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-accent-primary/20">
                                <thead className="bg-dark-800/60">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Topic</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Stats</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Daily Stats</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Founder</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-dark-800 divide-y divide-accent-primary/10">
                                    {topics.data.map((topic) => (
                                        <tr key={topic.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-slate-100">
                                                        #{topic.name}
                                                    </span>
                                                    {isNew(topic.created_at) && (
                                                        <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-300 rounded border border-emerald-400/30 flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3" />
                                                            New
                                                        </span>
                                                    )}
                                                    {topic.daily_post_count > 10 && (
                                                        <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-300 rounded border border-orange-400/30 flex items-center gap-1">
                                                            <TrendingUp className="w-3 h-3" />
                                                            Hot
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                <div>Posts: {topic.post_count}</div>
                                                <div>Views: {topic.view_count}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                <div className="font-semibold text-accent-primary">Posts: {topic.daily_post_count}</div>
                                                <div className="font-semibold text-accent-primary">Views: {topic.daily_view_count}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                {topic.founder ? topic.founder.name : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                                {new Date(topic.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDelete(topic)}
                                                    className="text-red-400 hover:opacity-80"
                                                    title="Delete Topic"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {topics.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-accent-primary/20 flex justify-between items-center bg-dark-800/60">
                                <div className="text-sm text-slate-400">
                                    Page {topics.current_page} of {topics.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {topics.links.map((link, index) => (
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
