import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { FileText, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

interface Post {
    id: number;
    content: string;
    image_path: string | null;
    created_at: string;
    reaction_count: number;
    comment_count: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    topics: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

interface PaginatedPosts {
    data: Post[];
    links: any[];
    current_page: number;
    last_page: number;
}

export default function AdminPosts({ posts }: { posts: PaginatedPosts }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/posts', { search }, { preserveState: true });
    };

    const handleDelete = (post: Post) => {
        if (confirm('Are you sure you want to delete this post? This will also delete all replies.')) {
            router.delete(`/admin/posts/${post.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-slate-100 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-emerald-400" />
                    Post Management
                </h2>
            }
        >
            <Head title="Post Management" />

            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Search */}
                    <div className="bg-dark-700/60 backdrop-blur-sm border border-accent-primary/20 rounded-xl p-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search posts by content..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-dark-800 border border-accent-secondary/30 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/20"
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

                    {/* Posts List */}
                    <div className="space-y-4">
                        {posts.data.map((post) => (
                            <div key={post.id} className="bg-dark-700/60 backdrop-blur-sm border border-accent-primary/20 rounded-xl p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-slate-100">{post.user.name}</span>
                                            <span className="text-sm text-slate-400">
                                                {new Date(post.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-100 mb-3 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                                        {post.image_path && (
                                            <img
                                                src={`/storage/${post.image_path}`}
                                                alt="Post image"
                                                className="max-w-md rounded-lg mb-3 border border-accent-primary/20"
                                            />
                                        )}
                                        <div className="flex gap-4 text-sm text-slate-400">
                                            <span>❤️ {post.reaction_count} reactions</span>
                                            <span>💬 {post.comment_count} comments</span>
                                        </div>
                                        {post.topics.length > 0 && (
                                            <div className="flex gap-2 mt-2">
                                                {post.topics.map((topic) => (
                                                    <span
                                                        key={topic.id}
                                                        className="px-2 py-1 text-xs bg-accent-secondary/10 text-accent-secondary rounded border border-accent-secondary/30"
                                                    >
                                                        #{topic.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(post)}
                                        className="text-red-400 hover:opacity-80 ml-4"
                                        title="Delete Post"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="px-6 py-4 border border-accent-primary/20 bg-dark-800/60 rounded-xl">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-slate-400">
                                    Page {posts.current_page} of {posts.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {posts.links.map((link, index) => (
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
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
