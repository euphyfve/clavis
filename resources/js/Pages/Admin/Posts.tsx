import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Post Management
                </h2>
            }
        >
            <Head title="Post Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Search */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search posts by content..."
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

                    {/* Posts List */}
                    <div className="space-y-4">
                        {posts.data.map((post) => (
                            <div key={post.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-gray-900">{post.user.name}</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(post.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mb-3">{post.content}</p>
                                        {post.image_path && (
                                            <img
                                                src={`/storage/${post.image_path}`}
                                                alt="Post image"
                                                className="max-w-md rounded-lg mb-3"
                                            />
                                        )}
                                        <div className="flex gap-4 text-sm text-gray-500">
                                            <span>❤️ {post.reaction_count} reactions</span>
                                            <span>💬 {post.comment_count} comments</span>
                                        </div>
                                        {post.topics.length > 0 && (
                                            <div className="flex gap-2 mt-2">
                                                {post.topics.map((topic) => (
                                                    <span
                                                        key={topic.id}
                                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                                                    >
                                                        #{topic.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(post)}
                                        className="text-red-600 hover:text-red-900 ml-4"
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
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
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
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
        </AuthenticatedLayout>
    );
}
