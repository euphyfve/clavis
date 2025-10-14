import { Head } from '@inertiajs/react';
import WordboardLayout from '@/Layouts/WordboardLayout';
import PostCard from '@/Components/PostCard';
import CommentSection from '@/Components/CommentSection';
import { Post } from '@/types/wordboard';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Props {
    post: Post;
}

export default function PostDetail({ post }: Props) {
    return (
        <WordboardLayout>
            <Head title={`Post by ${post.user.name} - Clavis Wordboard`} />

            <div className="min-h-screen">
                <section className="max-w-4xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => router.visit('/')}
                        className="flex items-center space-x-2 text-slate-400 hover:text-accent-secondary transition-colors mb-6"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Feed</span>
                    </motion.button>

                    {/* Post Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <PostCard post={post} showActions={true} />
                    </motion.div>

                    {/* Comments Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6"
                    >
                        <div className="bg-dark-700/50 backdrop-blur-sm rounded-xl border border-accent-primary/10 p-6">
                            <h2 
                                className="text-2xl font-bold uppercase mb-4"
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    color: '#F1F5F9',
                                }}
                            >
                                COMMENTS
                            </h2>
                            <CommentSection postId={post.id} initialComments={post.replies} />
                        </div>
                    </motion.div>
                </section>
            </div>
        </WordboardLayout>
    );
}
