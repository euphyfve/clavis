import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Clock } from 'lucide-react';
import { useEffect } from 'react';

interface Post {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface WordDetailModalProps {
    word: string | null;
    posts: Post[];
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Modal showing all posts for a specific word
 * Displays user profiles and timestamps
 */
export function WordDetailModal({
    word,
    posts,
    isOpen,
    onClose,
}: WordDetailModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && word && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[1040] bg-black/80 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{
                                duration: 0.4,
                                ease: [0.33, 1, 0.68, 1],
                            }}
                            className="backdrop-cosmic relative w-full max-w-2xl rounded-2xl border border-[#28006d] shadow-2xl"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-title"
                        >
                            {/* Header */}
                            <div className="border-b border-[#28006d] p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2
                                            id="modal-title"
                                            className="text-glow-starlight text-4xl font-bold text-[#3a8dff]"
                                        >
                                            {word}
                                        </h2>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {posts.length}{' '}
                                            {posts.length === 1
                                                ? 'post'
                                                : 'posts'}{' '}
                                            in the void
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="
                                            rounded-lg p-2 text-muted-foreground
                                            transition-colors duration-200
                                            hover:bg-[#28006d] hover:text-white
                                        "
                                        aria-label="Close modal"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Posts list */}
                            <div className="max-h-[60vh] overflow-y-auto p-6">
                                <div className="space-y-4">
                                    {posts.map((post, index) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.4,
                                                delay: index * 0.05,
                                                ease: [0.33, 1, 0.68, 1],
                                            }}
                                            className="
                                                rounded-lg border border-[#28006d] bg-[#0a0028] p-4
                                                transition-all duration-300
                                                hover:border-[#3a8dff] hover:shadow-lg
                                            "
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Constellation avatar */}
                                                <div className="glow-nebula flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8c52ff] to-[#3a8dff]">
                                                    <User className="h-6 w-6 text-white" />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-white">
                                                            {post.user.name}
                                                        </h3>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(
                                                                post.created_at
                                                            ).toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="mt-2 text-lg text-foreground">
                                                        {post.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
