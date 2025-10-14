import { useState } from 'react';
import { Post } from '@/types/wordboard';
import { router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Flame, MessageCircle, Lightbulb, Heart, Trash2, User } from 'lucide-react';
import { formatDate } from '@/utils/date';

interface Props {
    post: Post;
    showActions?: boolean;
}

const reactionIcons = {
    fire: Flame,
    idea: Lightbulb,
    heart: Heart,
};

const reactionColors = {
    fire: '#F59E0B',
    idea: '#FBBF24',
    heart: '#EC4899',
};

export default function PostCard({ post, showActions = true }: Props) {
    const [isReacting, setIsReacting] = useState(false);
    const { auth } = usePage().props as any;

    const handleReaction = (type: 'fire' | 'idea' | 'heart') => {
        if (isReacting) return;
        
        setIsReacting(true);
        router.post(`/posts/${post.id}/reactions`, { type }, {
            preserveScroll: true,
            onFinish: () => setIsReacting(false),
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(`/posts/${post.id}`, {
                preserveScroll: true,
            });
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-700/50 backdrop-blur-sm rounded-xl border border-accent-primary/10 p-6 hover:border-accent-primary/30 transition-all"
            style={{
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {post.user.avatar ? (
                        <img
                            src={`/storage/${post.user.avatar}`}
                            alt={post.user.name}
                            className="w-10 h-10 rounded-full border-2 border-accent-secondary"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-accent-secondary/20 flex items-center justify-center border-2 border-accent-secondary">
                            <User className="w-5 h-5 text-accent-secondary" />
                        </div>
                    )}
                    
                    <div>
                        <h3 className="font-semibold text-slate-100">{post.user.name}</h3>
                        <p className="text-xs text-slate-400">{formatDate(post.created_at)}</p>
                    </div>
                </div>

                {showActions && auth?.user && post.user_id === auth.user.id && (
                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="mb-4">
                <p className="text-slate-100 whitespace-pre-wrap leading-relaxed">
                    {post.content.split(' ').map((word, i) => {
                        if (word.startsWith('#')) {
                            return (
                                <span
                                    key={i}
                                    className="text-accent-secondary font-semibold cursor-pointer hover:underline"
                                    onClick={() => router.visit(`/topics/${word.slice(1)}`)}
                                >
                                    {word}{' '}
                                </span>
                            );
                        }
                        if (word.startsWith('@')) {
                            return (
                                <span key={i} className="text-accent-purple font-semibold">
                                    {word}{' '}
                                </span>
                            );
                        }
                        return word + ' ';
                    })}
                </p>

                {/* Image */}
                {post.image_path && (
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={`/storage/${post.image_path}`}
                        alt="Post image"
                        className="mt-4 w-full rounded-xl max-h-96 object-cover"
                    />
                )}
            </div>

            {/* Topics */}
            {post.topics && post.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.topics.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => router.visit(`/topics/${topic.slug}`)}
                            className="px-3 py-1 bg-accent-secondary/10 border border-accent-secondary/30 rounded-lg text-sm text-accent-secondary hover:bg-accent-secondary/20 transition-all"
                        >
                            #{topic.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Reactions */}
            {showActions && (
                <div className="flex items-center space-x-2 pt-4 border-t border-accent-primary/10">
                    {Object.entries(reactionIcons).map(([type, Icon]) => {
                        const color = reactionColors[type as keyof typeof reactionColors];
                        const count = post.reactions?.filter(r => r.type === type).length || 0;
                        
                        return (
                            <motion.button
                                key={type}
                                onClick={() => handleReaction(type as any)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-dark-800 transition-all group"
                                disabled={isReacting}
                            >
                                <Icon 
                                    className="w-5 h-5 transition-all group-hover:scale-110" 
                                    style={{ color }}
                                />
                                {count > 0 && (
                                    <span className="text-sm text-slate-400">{count}</span>
                                )}
                            </motion.button>
                        );
                    })}

                    {/* Comment button - Navigate to detail page */}
                    <motion.button
                        onClick={() => router.visit(`/posts/${post.id}`)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-dark-800 transition-all group"
                    >
                        <MessageCircle 
                            className="w-5 h-5 transition-all group-hover:scale-110" 
                            style={{ color: '#14B8A6' }}
                        />
                        {post.comment_count > 0 && (
                            <span className="text-sm text-slate-400">{post.comment_count}</span>
                        )}
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
}
