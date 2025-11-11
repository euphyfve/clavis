import { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Shield, Users, FileText, Hash, Settings as SettingsIcon, LogOut, Menu, X } from 'lucide-react';

interface Props extends PropsWithChildren {
    header?: ReactNode;
}

export default function AdminLayout({ children, header }: Props) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-dark-900 text-slate-100">
            {/* Top Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-800/80 backdrop-blur-md border-b border-accent-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Brand */}
                        <Link href="/admin" className="flex items-center space-x-3">
                            <Shield className="w-7 h-7 text-accent-primary" />
                            <span className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>ADMIN</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Link href="/admin" className="px-3 py-2 rounded-lg hover:bg-accent-primary/10">Dashboard</Link>
                            <Link href="/admin/users" className="px-3 py-2 rounded-lg hover:bg-accent-primary/10 flex items-center gap-2"><Users className="w-4 h-4 text-accent-secondary" />Users</Link>
                            <Link href="/admin/posts" className="px-3 py-2 rounded-lg hover:bg-accent-primary/10 flex items-center gap-2"><FileText className="w-4 h-4 text-accent-secondary" />Posts</Link>
                            <Link href="/admin/topics" className="px-3 py-2 rounded-lg hover:bg-accent-primary/10 flex items-center gap-2"><Hash className="w-4 h-4 text-accent-secondary" />Topics</Link>
                            <Link href="/admin/settings" className="px-3 py-2 rounded-lg hover:bg-accent-primary/10 flex items-center gap-2"><SettingsIcon className="w-4 h-4 text-accent-secondary" />Settings</Link>
                        </div>

                        {/* Right area */}
                        <div className="hidden md:flex items-center gap-3">
                            {user && (
                                <>
                                    <span className="text-slate-300 text-sm">{user.name}</span>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="px-3 py-2 rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-accent-primary/10">
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${mobileOpen ? 'block' : 'hidden'} md:hidden border-t border-accent-primary/20 bg-dark-800`}>
                    <div className="px-4 py-3 space-y-2">
                        <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-accent-primary/10">Dashboard</Link>
                        <Link href="/admin/users" className="block px-4 py-3 rounded-lg hover:bg-accent-primary/10">Users</Link>
                        <Link href="/admin/posts" className="block px-4 py-3 rounded-lg hover:bg-accent-primary/10">Posts</Link>
                        <Link href="/admin/topics" className="block px-4 py-3 rounded-lg hover:bg-accent-primary/10">Topics</Link>
                        <Link href="/admin/settings" className="block px-4 py-3 rounded-lg hover:bg-accent-primary/10">Settings</Link>
                        {user && (
                            <Link href="/logout" method="post" as="button" className="block w-full text-left px-4 py-3 rounded-lg hover:bg-red-500/10 text-slate-300 hover:text-red-400">Logout</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Header */}
            {header && (
                <header className="pt-16 bg-gradient-to-b from-dark-800/60 to-dark-900/0 border-b border-accent-primary/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {header}
                    </div>
                </header>
            )}

            {/* Main */}
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}
