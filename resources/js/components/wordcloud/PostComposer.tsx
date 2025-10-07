import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

interface PostComposerProps {
    className?: string;
}

/**
 * Post composer for creating new word posts
 * Max 100 characters with cosmic styling
 */
export function PostComposer({ className = '' }: PostComposerProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);

        router.post(
            '/posts',
            { content: content.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setContent('');
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const remainingChars = 100 - content.length;
    const isOverLimit = remainingChars < 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
            className={`backdrop-cosmic rounded-2xl border border-[#28006d] p-6 shadow-xl ${className}`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <label
                        htmlFor="post-content"
                        className="mb-2 flex items-center gap-2 text-sm font-medium text-[#3a8dff]"
                    >
                        <Sparkles className="h-4 w-4" />
                        What happened today?
                    </label>
                    <textarea
                        id="post-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share a word or phrase..."
                        maxLength={150}
                        rows={3}
                        disabled={isSubmitting}
                        className="
                            w-full rounded-lg border border-[#28006d] bg-[#0a0028] px-4 py-3
                            font-sans text-lg text-white placeholder-muted-foreground
                            transition-all duration-300
                            focus:border-[#3a8dff] focus:outline-none focus:ring-2 focus:ring-[#3a8dff]/50
                            disabled:cursor-not-allowed disabled:opacity-50
                        "
                        aria-describedby="char-count"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span
                        id="char-count"
                        className={`text-sm ${
                            isOverLimit
                                ? 'text-destructive'
                                : remainingChars < 20
                                  ? 'text-[#ffaa33]'
                                  : 'text-muted-foreground'
                        }`}
                    >
                        {remainingChars} characters remaining
                    </span>

                    <motion.button
                        type="submit"
                        disabled={
                            !content.trim() || isOverLimit || isSubmitting
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="
                            glow-starlight rounded-lg bg-[#3a8dff] px-6 py-2.5
                            font-semibold text-white
                            transition-all duration-300
                            hover:bg-[#0d69ff]
                            disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none
                            disabled:hover:scale-100
                        "
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Posting...
                            </span>
                        ) : (
                            'Post to Void'
                        )}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
}
