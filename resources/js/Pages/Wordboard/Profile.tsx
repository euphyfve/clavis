import { Head } from '@inertiajs/react';
import WordboardLayout from '@/Layouts/WordboardLayout';
import PostCard from '@/Components/PostCard';
import { User, Topic, Post } from '@/types/wordboard';
import { motion } from 'framer-motion';
import { Trophy, Flame, Calendar, TrendingUp, Award } from 'lucide-react';

interface Props {
    profileUser: User;
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
    };
    topTopics: Array<{
        id: number;
        name: string;
        slug: string;
        count: number;
    }>;
}

const badgeInfo: Record<string, { name: string; icon: string; color: string }> = {
    starter_flame: { name: 'Starter Flame', icon: '🔥', color: '#F59E0B' },
    word_warrior: { name: 'Word Warrior', icon: '⚔️', color: '#14B8A6' },
    trendmaker: { name: 'Trendmaker', icon: '🌟', color: '#FBBF24' },
    week_streak: { name: 'Week Streak', icon: '📅', color: '#EC4899' },
};

export default function Profile({ profileUser, posts, topTopics }: Props) {
    const stats = profileUser.stats;

    return (
        <WordboardLayout>
            <Head title={`${profileUser.name} - Clavis Wordboard`} />

            <div className="min-h-screen">
                {/* Profile Header */}
                <section className="relative overflow-hidden py-12 px-4 bg-gradient-to-br from-dark-700 to-dark-900 border-b border-accent-primary/20">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8"
                        >
                            {/* Avatar */}
                            <div className="relative">
                                {profileUser.avatar ? (
                                    <img
                                        src={`/storage/${profileUser.avatar}`}
                                        alt={profileUser.name}
                                        className="w-32 h-32 rounded-full border-4 border-accent-primary"
                                        style={{
                                            boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
                                        }}
                                    />
                                ) : (
                                    <div 
                                        className="w-32 h-32 rounded-full border-4 border-accent-primary bg-accent-secondary/20 flex items-center justify-center text-5xl font-bold"
                                        style={{
                                            boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
                                        }}
                                    >
                                        {profileUser.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                
                                {/* Level badge */}
                                {stats && (
                                    <div 
                                        className="absolute -bottom-2 -right-2 px-3 py-1 bg-amber-400 rounded-full text-dark-900 font-bold text-sm"
                                        style={{
                                            boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                                        }}
                                    >
                                        LV {Math.floor(stats.xp / 100) + 1}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 
                                    className="text-4xl font-bold uppercase mb-2"
                                    style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                        color: '#F1F5F9',
                                    }}
                                >
                                    {profileUser.name}
                                </h1>
                                
                                {profileUser.bio && (
                                    <p className="text-slate-400 mb-4">{profileUser.bio}</p>
                                )}

                                {/* Stats */}
                                {stats && (
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-dark-800 border border-amber-400/30 rounded-lg">
                                            <Trophy className="w-5 h-5 text-amber-400" />
                                            <span className="text-slate-100">{stats.xp} XP</span>
                                        </div>
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-dark-800 border border-accent-secondary/30 rounded-lg">
                                            <TrendingUp className="w-5 h-5 text-accent-secondary" />
                                            <span className="text-slate-100">{stats.post_count} posts</span>
                                        </div>
                                        <div className="flex items-center space-x-2 px-4 py-2 bg-dark-800 border border-orange-400/30 rounded-lg">
                                            <Flame className="w-5 h-5 text-orange-400" />
                                            <span className="text-slate-100">{stats.streak_days} day streak</span>
                                        </div>
                                    </div>
                                )}

                                {/* Badges */}
                                {stats && stats.badges && stats.badges.length > 0 && (
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        {stats.badges.map((badge) => {
                                            const info = badgeInfo[badge];
                                            if (!info) return null;
                                            
                                            return (
                                                <motion.div
                                                    key={badge}
                                                    whileHover={{ scale: 1.1 }}
                                                    className="flex items-center space-x-2 px-3 py-1 bg-dark-800 border rounded-lg"
                                                    style={{
                                                        borderColor: `${info.color}40`,
                                                    }}
                                                    title={info.name}
                                                >
                                                    <span>{info.icon}</span>
                                                    <span className="text-sm text-slate-100">{info.name}</span>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Content */}
                <section className="max-w-4xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 
                                className="text-2xl font-bold uppercase mb-6"
                                style={{
                                    fontFamily: "'Orbitron', sans-serif",
                                    color: '#F1F5F9',
                                }}
                            >
                                POSTS
                            </h2>

                            {posts.data.length > 0 ? (
                                posts.data.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <PostCard post={post} />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-slate-400">No posts yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* My Cloud */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-dark-700/50 backdrop-blur-sm rounded-xl border border-accent-primary/20 p-6"
                            >
                                <h3 
                                    className="text-xl font-bold uppercase mb-4"
                                    style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                        color: '#F1F5F9',
                                    }}
                                >
                                    MY CLOUD
                                </h3>
                                
                                {topTopics.length > 0 ? (
                                    <div className="space-y-3">
                                        {topTopics.map((topic, index) => (
                                            <div
                                                key={topic.id}
                                                className="flex items-center justify-between"
                                            >
                                                <span 
                                                    className="text-accent-secondary font-semibold"
                                                    style={{
                                                        fontSize: `${14 + (10 - index) * 2}px`,
                                                    }}
                                                >
                                                    #{topic.name}
                                                </span>
                                                <span className="text-slate-400 text-sm">
                                                    {topic.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm">
                                        No topics yet. Start posting!
                                    </p>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>
        </WordboardLayout>
    );
}
