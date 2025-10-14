import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Flame, Eye, ChevronRight, Zap } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import PostCard from './PostCard';
import { Post } from '@/types/wordboard';

interface Topic {
    id: number;
    name: string;
    slug: string;
    count: number;
    view_count: number;
    founder?: {
        name: string;
    };
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function TrendingLeaderboard({ isOpen, onClose }: Props) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'hot' | 'trending' | 'new' | 'feed'>('feed');

    useEffect(() => {
        if (isOpen) {
            if (filter === 'feed') {
                fetchTrendingPosts();
            } else {
                fetchTopics();
            }
        }
    }, [isOpen, filter]);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/topics/leaderboard?filter=${filter}`);
            setTopics(response.data);
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrendingPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/posts/trending');
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch trending posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTopicClick = (slug: string) => {
        router.visit(`/topics/${slug}`);
        onClose();
    };

    const getRankColor = (index: number) => {
        if (index === 0) return 'from-amber-400 to-yellow-500';
        if (index === 1) return 'from-slate-300 to-slate-400';
        if (index === 2) return 'from-orange-400 to-orange-500';
        return 'from-accent-primary to-accent-purple';
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-dark-700/95 backdrop-blur-xl border border-accent-primary/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
                            style={{
                                boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
                            }}
                        >
                            {/* Header */}
                            <div className="relative px-6 py-5 border-b border-accent-primary/20 bg-gradient-to-r from-dark-800 to-dark-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-accent-primary/20 rounded-lg">
                                            <TrendingUp className="w-6 h-6 text-accent-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-100" style={{
                                                fontFamily: "'Orbitron', sans-serif",
                                            }}>
                                                {filter === 'feed' ? 'TRENDING FEED' : 'TRENDING LEADERBOARD'}
                                            </h2>
                                            <p className="text-sm text-slate-400">
                                                {filter === 'feed' ? 'Posts with most hot votes' : 'Hottest topics right now'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex items-center space-x-2 mt-4 overflow-x-auto">
                                    <button
                                        onClick={() => setFilter('feed')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                                            filter === 'feed'
                                                ? 'bg-gradient-to-r from-accent-primary to-accent-purple text-white'
                                                : 'bg-dark-800 text-slate-400 hover:bg-accent-primary/10'
                                        }`}
                                    >
                                        <Zap className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Trending Feed</span>
                                    </button>
                                    <button
                                        onClick={() => setFilter('hot')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                                            filter === 'hot'
                                                ? 'bg-gradient-to-r from-accent-primary to-accent-purple text-white'
                                                : 'bg-dark-800 text-slate-400 hover:bg-accent-primary/10'
                                        }`}
                                    >
                                        <Flame className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Hot</span>
                                    </button>
                                    <button
                                        onClick={() => setFilter('trending')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                                            filter === 'trending'
                                                ? 'bg-gradient-to-r from-accent-primary to-accent-purple text-white'
                                                : 'bg-dark-800 text-slate-400 hover:bg-accent-primary/10'
                                        }`}
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Trending</span>
                                    </button>
                                    <button
                                        onClick={() => setFilter('new')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                                            filter === 'new'
                                                ? 'bg-gradient-to-r from-accent-primary to-accent-purple text-white'
                                                : 'bg-dark-800 text-slate-400 hover:bg-accent-primary/10'
                                        }`}
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span className="text-sm font-semibold">New</span>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="overflow-y-auto max-h-[calc(80vh-180px)] p-6">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-primary border-t-transparent"></div>
                                    </div>
                                ) : filter === 'feed' ? (
                                    posts.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-slate-400">No trending posts yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {posts.map((post, index) => (
                                                <motion.div
                                                    key={post.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <PostCard post={post} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    )
                                ) : topics.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-slate-400">No trending topics yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {topics.map((topic, index) => (
                                            <motion.button
                                                key={topic.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleTopicClick(topic.slug)}
                                                className="w-full group"
                                            >
                                                <div className="flex items-center space-x-4 p-4 bg-dark-800/50 hover:bg-dark-800 border border-accent-primary/10 hover:border-accent-primary/30 rounded-xl transition-all">
                                                    {/* Rank Badge */}
                                                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${getRankColor(index)} flex items-center justify-center font-bold text-lg shadow-lg`}>
                                                        {getRankIcon(index)}
                                                    </div>

                                                    {/* Topic Info */}
                                                    <div className="flex-1 text-left">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h3 className="text-lg font-bold text-slate-100 group-hover:text-accent-secondary transition-colors">
                                                                #{topic.name}
                                                            </h3>
                                                            {index < 3 && (
                                                                <span className="px-2 py-0.5 bg-accent-primary/20 text-accent-primary text-xs font-semibold rounded">
                                                                    TOP {index + 1}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                                                            <span className="flex items-center space-x-1">
                                                                <TrendingUp className="w-4 h-4" />
                                                                <span>{topic.count} posts</span>
                                                            </span>
                                                            <span className="flex items-center space-x-1">
                                                                <Eye className="w-4 h-4" />
                                                                <span>{topic.view_count} views</span>
                                                            </span>
                                                        </div>
                                                        {topic.founder && (
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                by {topic.founder.name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Arrow */}
                                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-accent-secondary group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-accent-primary/20 bg-dark-800/50">
                                <p className="text-center text-sm text-slate-400">
                                    {filter === 'feed' ? 'Posts sorted by hot votes 🔥' : 'Click any topic to explore 🚀'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
