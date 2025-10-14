import { PropsWithChildren, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';
import { Flame, TrendingUp, User as UserIcon, LogOut, Menu, X, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TrendingLeaderboard from '@/Components/TrendingLeaderboard';

interface Props extends PropsWithChildren {
    showIntro?: boolean;
}

export default function WordboardLayout({ children, showIntro = false }: Props) {
    const { auth } = usePage().props as { auth: { user: User } };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [leaderboardOpen, setLeaderboardOpen] = useState(false);

    return (
        <div className="min-h-screen bg-dark-900 text-slate-100">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-800/80 backdrop-blur-md border-b border-accent-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <Flame className="w-8 h-8 text-accent-primary" style={{
                                filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))',
                            }} />
                            <span className="text-2xl font-bold uppercase tracking-wider" style={{
                                fontFamily: "'Orbitron', sans-serif",
                                textShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
                            }}>
                                CLAVIS
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link 
                                href="/" 
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent-primary/10 transition-all duration-300"
                            >
                                <TrendingUp className="w-5 h-5 text-accent-secondary" />
                                <span>Wordboard</span>
                            </Link>

                            {/* Leaderboard Button */}
                            <button
                                onClick={() => setLeaderboardOpen(true)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-primary/10 to-accent-purple/10 hover:from-accent-primary/20 hover:to-accent-purple/20 border border-accent-primary/30 transition-all duration-300"
                                style={{
                                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
                                }}
                            >
                                <Trophy className="w-5 h-5 text-amber-400" />
                                <span className="font-semibold">Leaderboard</span>
                            </button>

                            {auth.user ? (
                                <>
                                    <Link 
                                        href={`/users/${auth.user.id}`}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent-primary/10 transition-all duration-300"
                                    >
                                        {auth.user.avatar ? (
                                            <img 
                                                src={`/storage/${auth.user.avatar}`} 
                                                alt={auth.user.name}
                                                className="w-6 h-6 rounded-full"
                                            />
                                        ) : (
                                            <UserIcon className="w-5 h-5 text-accent-secondary" />
                                        )}
                                        <span>{auth.user.name}</span>
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all duration-300"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        href="/login"
                                        className="px-6 py-2 rounded-lg border border-accent-secondary text-accent-secondary hover:bg-accent-secondary/10 transition-all duration-300"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        href="/register"
                                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent-primary to-accent-purple text-white hover:opacity-90 transition-all duration-300"
                                        style={{
                                            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                                        }}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-accent-primary/10"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-accent-primary/20 bg-dark-800"
                        >
                            <div className="px-4 py-4 space-y-2">
                                <Link 
                                    href="/" 
                                    className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-accent-primary/10"
                                >
                                    <TrendingUp className="w-5 h-5 text-accent-secondary" />
                                    <span>Wordboard</span>
                                </Link>

                                {auth.user ? (
                                    <>
                                        <Link 
                                            href={`/users/${auth.user.id}`}
                                            className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-accent-primary/10"
                                        >
                                            <UserIcon className="w-5 h-5 text-accent-secondary" />
                                            <span>{auth.user.name}</span>
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400 w-full text-left"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Logout</span>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            href="/login"
                                            className="block px-4 py-3 rounded-lg border border-accent-secondary text-accent-secondary text-center"
                                        >
                                            Login
                                        </Link>
                                        <Link 
                                            href="/register"
                                            className="block px-4 py-3 rounded-lg bg-gradient-to-r from-accent-primary to-accent-purple text-white text-center"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="pt-16">
                {children}
            </main>

            {/* Trending Leaderboard Modal */}
            <TrendingLeaderboard 
                isOpen={leaderboardOpen} 
                onClose={() => setLeaderboardOpen(false)} 
            />

            {/* Footer */}
            <footer className="mt-20 border-t border-accent-primary/20 bg-dark-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-slate-400">
                            © 2025 Clavis Wordboard. Where words pulse with life.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
