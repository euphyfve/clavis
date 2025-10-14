import { useState, useEffect } from 'react';
import { Post } from '@/types/wordboard';
import { router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import CommentItem from './CommentItem';
import axios from 'axios';

interface Props {
    postId: number;
    initialComments?: Post[];
}

export default function CommentSection({ postId, initialComments = [] }: Props) {
    const [comments, setComments] = useState<Post[]>(initialComments);
    const [replyToId, setReplyToId] = useState<number | null>(null);
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const { auth } = usePage().props as any;

    useEffect(() => {
        if (initialComments.length === 0) {
            fetchComments();
        } else {
            setComments(initialComments);
        }
    }, [postId, initialComments]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            console.log('Fetching comments for post:', postId);
            const response = await axios.get(`/posts/${postId}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            console.log('Received response:', response.data);
            // Get all replies including nested ones
            const allReplies = response.data.replies || [];
            console.log('All replies:', allReplies);
            setComments(allReplies);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim() && !image) return;
        
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('content', content);
        formData.append('parent_id', replyToId ? replyToId.toString() : postId.toString());
        if (image) {
            formData.append('image', image);
        }

        console.log('Submitting reply:', {
            content,
            parent_id: replyToId || postId,
            replyToId,
            postId
        });

        router.post('/posts', formData, {
            preserveScroll: true,
            onSuccess: (page) => {
                console.log('Reply posted successfully');
                setContent('');
                setImage(null);
                setImagePreview(null);
                setReplyToId(null);
                // Fetch updated comments after successful post
                setTimeout(() => {
                    console.log('Fetching updated comments...');
                    fetchComments();
                }, 1000); // Increased delay to 1 second
            },
            onError: (errors) => {
                console.error('Error posting reply:', errors);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleReply = (commentId: number) => {
        setReplyToId(commentId);
    };

    // Build flat comment list with parent info (no nesting)
    const buildCommentList = (comments: Post[]): Post[] => {
        // Get all comments (including nested replies) and flatten them
        const flattenComments = (commentList: Post[]): Post[] => {
            let result: Post[] = [];
            commentList.forEach(comment => {
                result.push(comment);
                if (comment.replies && comment.replies.length > 0) {
                    result = result.concat(flattenComments(comment.replies));
                }
            });
            return result;
        };

        const allComments = flattenComments(comments);

        // Create a map to get parent user info
        const commentMap = new Map<number, Post>();
        allComments.forEach(comment => {
            commentMap.set(comment.id, comment);
        });

        // Add parent user info to each comment
        const commentsWithParent = allComments.map(comment => {
            if (comment.parent_id && comment.parent_id !== postId) {
                const parent = commentMap.get(comment.parent_id);
                return {
                    ...comment,
                    parentUser: parent?.user
                };
            }
            return comment;
        });

        // Sort by heart/love count (top comments first)
        commentsWithParent.sort((a, b) => {
            const aHearts = a.reactions?.filter(r => r.type === 'heart').length || 0;
            const bHearts = b.reactions?.filter(r => r.type === 'heart').length || 0;
            return bHearts - aHearts; // Descending order
        });

        return commentsWithParent;
    };

    const commentList = buildCommentList(comments);

    return (
        <div className="mt-4 border-t border-accent-primary/10 pt-4">
            {/* Comment Form - Only show if authenticated */}
            {auth?.user && (
                <form onSubmit={handleSubmit} className="mb-4">
                <div className="bg-dark-800/50 rounded-lg p-3 border border-accent-primary/10">
                    {replyToId && (
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-accent-primary/10">
                            <span className="text-xs text-accent-secondary">
                                Replying to comment...
                            </span>
                            <button
                                type="button"
                                onClick={() => setReplyToId(null)}
                                className="text-slate-400 hover:text-red-400 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={replyToId ? "Write a reply..." : "Write a comment..."}
                        className="w-full bg-transparent text-slate-100 placeholder-slate-500 resize-none focus:outline-none text-sm"
                        rows={2}
                        disabled={isSubmitting}
                    />

                    {imagePreview && (
                        <div className="relative mt-2">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-h-40 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <label className="cursor-pointer p-2 rounded hover:bg-accent-primary/10 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                                disabled={isSubmitting}
                            />
                            <ImageIcon className="w-4 h-4 text-slate-400 hover:text-accent-secondary transition-colors" />
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting || (!content.trim() && !image)}
                            className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-accent-primary to-accent-purple text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            <Send className="w-4 h-4" />
                            <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                        </button>
                    </div>
                </div>
            </form>
            )}

            {/* Login prompt for guests */}
            {!auth?.user && (
                <div className="mb-4 p-3 bg-dark-800/50 rounded-lg border border-accent-primary/10 text-center">
                    <p className="text-slate-400 text-sm">
                        Please <a href="/login" className="text-accent-secondary hover:underline">login</a> to comment
                    </p>
                </div>
            )}

            {/* Comments List - Flat (no nesting) */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent-primary border-t-transparent mx-auto"></div>
                    </div>
                ) : commentList.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    <AnimatePresence>
                        {commentList.map((comment: any, index: number) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onReply={handleReply}
                                depth={0}
                                parentUser={comment.parentUser}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
