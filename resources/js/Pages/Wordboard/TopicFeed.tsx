import { Head } from '@inertiajs/react';
import WordboardLayout from '@/Layouts/WordboardLayout';
import PostCard from '@/Components/PostCard';
import CreatePost from '@/Components/CreatePost';
import { Topic, Post } from '@/types/wordboard';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, User, ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Props {
    topic: Topic;
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
    };
}

export default function TopicFeed({ topic, posts }: Props) {
    return (
        <WordboardLayout>
            <Head title={`#${topic.name} - Clavis Wordboard`} />

            <div className="min-h-screen">
                {/* Topic Header */}
                <section className="relative overflow-hidden py-12 px-4 bg-gradient-to-br from-dark-700 to-dark-900 border-b border-accent-primary/20">
                    <div className="max-w-4xl mx-auto">
                        {/* Back button */}
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => router.visit('/')}
                            className="flex items-center space-x-2 text-accent-secondary hover:text-accent-secondary/80 mb-6 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Wordboard</span>
                        </motion.button>

                        {/* Topic info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h1 
                                className="text-6xl font-bold uppercase tracking-wider mb-4"
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    color: '#6366F1',
                                    textShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
                                }}
                            >
                                #{topic.name}
                            </h1>

                            {/* Stats */}
                            <div className="flex items-center justify-center space-x-8 text-slate-400">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-5 h-5 text-accent-secondary" />
                                    <span>{topic.post_count} posts</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Eye className="w-5 h-5 text-amber-400" />
                                    <span>{topic.view_count} views</span>
                                </div>
                            </div>

                            {/* Founder */}
                            {topic.founder && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-dark-800 border border-accent-secondary/30 rounded-lg"
                                >
                                    <User className="w-4 h-4 text-accent-secondary" />
                                    <span className="text-sm text-slate-100">
                                        Founded by <span className="font-semibold text-accent-secondary">{topic.founder.name}</span>
                                    </span>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </section>

                {/* Content */}
                <section className="max-w-4xl mx-auto px-4 py-12">
                    {/* Create Post */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <CreatePost onSuccess={() => window.location.reload()} />
                    </motion.div>

                    {/* Posts */}
                    <div className="space-y-6">
                        {posts.data.length > 0 ? (
                            posts.data.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (index * 0.1) }}
                                >
                                    <PostCard post={post} />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <p className="text-slate-400 text-lg">
                                    No posts yet for this topic. Be the first to contribute!
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-center space-x-2 mt-8"
                        >
                            {Array.from({ length: posts.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => router.visit(`/topics/${topic.slug}?page=${page}`)}
                                    className={`px-4 py-2 rounded-lg transition-all ${
                                        page === posts.current_page
                                            ? 'bg-gradient-to-r from-accent-primary to-accent-purple text-white'
                                            : 'bg-dark-700 text-slate-400 hover:bg-accent-primary/10'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </section>
            </div>
        </WordboardLayout>
    );
}
