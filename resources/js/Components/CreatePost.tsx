import { useState, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Image, Send, X, Hash, AtSign } from 'lucide-react';

interface Props {
    onSuccess?: () => void;
}

export default function CreatePost({ onSuccess }: Props) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleContentChange = (value: string) => {
        setContent(value);
        
        // Auto-suggest hashtags (simple implementation)
        const words = value.split(' ');
        const lastWord = words[words.length - 1];
        
        if (lastWord.startsWith('#') && lastWord.length > 1) {
            // In a real app, fetch suggestions from API
            setSuggestions(['#trending', '#tech', '#lifestyle', '#gaming']);
        } else {
            setSuggestions([]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!content.trim()) return;
        
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        router.post('/posts', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setContent('');
                setImage(null);
                setImagePreview(null);
                setIsSubmitting(false);
                onSuccess?.();
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-700/50 backdrop-blur-sm rounded-2xl border border-accent-primary/20 p-6"
            style={{
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)',
            }}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Text Input */}
                <div className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="What's happening today? Use #hashtags and @mentions..."
                        className="w-full bg-dark-800 border border-accent-secondary/30 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-accent-secondary focus:ring-2 focus:ring-accent-secondary/20 transition-all resize-none"
                        rows={4}
                        maxLength={1000}
                        style={{
                            fontFamily: "'Inter', sans-serif",
                        }}
                    />
                    
                    {/* Character count */}
                    <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                        {content.length}/1000
                    </div>
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => {
                                    const words = content.split(' ');
                                    words[words.length - 1] = suggestion;
                                    setContent(words.join(' ') + ' ');
                                    setSuggestions([]);
                                }}
                                className="px-3 py-1 bg-accent-secondary/10 border border-accent-secondary/30 rounded-lg text-sm text-accent-secondary hover:bg-accent-secondary/20 transition-all"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-xl"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-2 bg-dark-800/80 rounded-full hover:bg-red-500 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {/* Image upload */}
                        <label className="cursor-pointer p-2 rounded-lg hover:bg-accent-secondary/10 transition-all">
                            <Image className="w-5 h-5 text-accent-secondary" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>

                        {/* Helper icons */}
                        <div className="flex items-center space-x-1 text-slate-400 text-sm">
                            <Hash className="w-4 h-4" />
                            <span>hashtags</span>
                            <AtSign className="w-4 h-4 ml-2" />
                            <span>mentions</span>
                        </div>
                    </div>

                    {/* Submit button */}
                    <motion.button
                        type="submit"
                        disabled={!content.trim() || isSubmitting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-accent-primary to-accent-purple text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        style={{
                            boxShadow: content.trim() ? '0 4px 20px rgba(99, 102, 241, 0.3)' : 'none',
                        }}
                    >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
}
