import { useState } from 'react';
import { Head } from '@inertiajs/react';
import WordboardLayout from '@/Layouts/WordboardLayout';
import CinematicIntro from '@/Components/CinematicIntro';
import WordCloud from '@/Components/WordCloud';
import CreatePost from '@/Components/CreatePost';
import { Topic } from '@/types/wordboard';
import { motion } from 'framer-motion';

interface Props {
    topics: Topic[];
    showIntro: boolean;
}

export default function Index({ topics, showIntro }: Props) {
    const [showIntroAnimation, setShowIntroAnimation] = useState(showIntro);

    if (showIntroAnimation) {
        return <CinematicIntro onComplete={() => setShowIntroAnimation(false)} />;
    }

    return (
        <WordboardLayout>
            <Head title="Clavis Wordboard - What Happened Today?" />

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-12 px-4">
                    {/* Animated background */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            background: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
                        }} />
                    </div>

                    <div className="relative max-w-7xl mx-auto">
                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h1 
                                className="text-6xl md:text-7xl font-bold uppercase tracking-wider mb-4"
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    background: 'linear-gradient(135deg, #6366F1 0%, #10B981 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 30px rgba(99, 102, 241, 0.3))',
                                }}
                            >
                                WORDBOARD
                            </h1>
                            <p className="text-xl text-slate-400">
                                Where words pulse with life. What happened today?
                            </p>
                        </motion.div>

                        {/* Word Cloud */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <WordCloud topics={topics} />
                        </motion.div>
                    </div>
                </section>

                {/* Main Content */}
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
                </section>

                {/* Floating action hint */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="fixed bottom-8 right-8 p-4 bg-dark-700/80 backdrop-blur-sm border border-accent-secondary/30 rounded-xl shadow-lg"
                    style={{
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)',
                    }}
                >
                    <p className="text-sm text-accent-secondary font-semibold">
                        💡 Click any word to explore its feed!
                    </p>
                </motion.div>
            </div>
        </WordboardLayout>
    );
}
