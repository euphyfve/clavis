import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-2">
                    <Hash className="w-6 h-6" />
                    Topic/Hashtag Management
                </h2>
            }
        >
            <Head title="Topic Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> The leaderboard displays 10 best hashtags (by daily activity) + 5 newest hashtags created today.
                            Daily stats reset at the configured time each day.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search topics/hashtags..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Topics Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stats</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Stats</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Founder</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {topics.data.map((topic) => (
                                        <tr key={topic.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        #{topic.name}
                                                    </span>
                                                    {isNew(topic.created_at) && (
                                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3" />
                                                            New
                                                        </span>
                                                    )}
                                                    {topic.daily_post_count > 10 && (
                                                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded flex items-center gap-1">
                                                            <TrendingUp className="w-3 h-3" />
                                                            Hot
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>Posts: {topic.post_count}</div>
                                                <div>Views: {topic.view_count}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="font-semibold text-blue-600">Posts: {topic.daily_post_count}</div>
                                                <div className="font-semibold text-blue-600">Views: {topic.daily_view_count}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {topic.founder ? topic.founder.name : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(topic.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDelete(topic)}
                                                    className="text-red-600 hover:text-red-900"
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
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
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
