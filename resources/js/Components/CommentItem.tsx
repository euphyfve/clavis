import { useState } from 'react';
import { Post } from '@/types/wordboard';
import { router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { User, Trash2, Reply, Heart } from 'lucide-react';
import { formatDate } from '@/utils/date';

interface Props {
    comment: Post;
    onReply: (commentId: number) => void;
    depth?: number;
    parentUser?: { name: string };
}

// Only love/heart reaction for comments (for top comment calculation)
const heartColor = '#EC4899';

export default function CommentItem({ comment, onReply, depth = 0, parentUser }: Props) {
    const [isReacting, setIsReacting] = useState(false);
    const { auth } = usePage().props as any;

    const handleReaction = () => {
        if (isReacting) return;
        
        setIsReacting(true);
        router.post(`/posts/${comment.id}/reactions`, { type: 'heart' }, {
            preserveScroll: true,
            onFinish: () => setIsReacting(false),
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(`/posts/${comment.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <div className="bg-dark-800/30 rounded-lg p-4 mb-3">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        {comment.user.avatar ? (
                            <img
                                src={`/storage/${comment.user.avatar}`}
                                alt={comment.user.name}
                                className="w-8 h-8 rounded-full border border-accent-secondary"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-accent-secondary/20 flex items-center justify-center border border-accent-secondary">
                                <User className="w-4 h-4 text-accent-secondary" />
                            </div>
                        )}
                        
                        <div>
                            <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-slate-100 text-sm">{comment.user.name}</h4>
                                {/* Show "Membalas @username" if this is a reply */}
                                {parentUser && (
                                    <span className="text-accent-secondary text-xs">
                                        · Membalas @{parentUser.name}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">{formatDate(comment.created_at)}</p>
                        </div>
                    </div>

                    {auth?.user && comment.user_id === auth.user.id && (
                        <button
                            onClick={handleDelete}
                            className="p-1 rounded hover:bg-red-500/10 text-red-400 transition-all"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <p className="text-slate-200 text-sm mb-3 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                </p>

                {/* Image */}
                {comment.image_path && (
                    <img
                        src={`/storage/${comment.image_path}`}
                        alt="Comment image"
                        className="mb-3 w-full rounded-lg max-h-64 object-cover"
                    />
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                    {/* Love reaction only */}
                    <motion.button
                        onClick={handleReaction}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-dark-700 transition-all group"
                        disabled={isReacting}
                    >
                        <Heart 
                            className="w-4 h-4 transition-all group-hover:scale-110" 
                            style={{ color: heartColor }}
                        />
                        {comment.reactions?.filter(r => r.type === 'heart').length > 0 && (
                            <span className="text-xs text-slate-400">
                                {comment.reactions.filter(r => r.type === 'heart').length}
                            </span>
                        )}
                    </motion.button>

                    {/* Reply button - always show (no depth limit since flat) */}
                    <button
                        onClick={() => onReply(comment.id)}
                        className="flex items-center space-x-1 px-2 py-1 rounded text-slate-400 hover:text-accent-secondary hover:bg-accent-secondary/10 transition-all text-xs"
                    >
                        <Reply className="w-3 h-3" />
                        <span>Reply</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
