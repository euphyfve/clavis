import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Shield, Users, FileText, Hash, Clock, RefreshCw } from 'lucide-react';

interface Stats {
    total_users: number;
    banned_users: number;
    total_posts: number;
    total_topics: number;
    last_reset: string;
    reset_time: string;
}

export default function AdminDashboard({ stats }: { stats: Stats }) {
    const handleForceReset = () => {
        if (confirm('Are you sure you want to force a daily reset? This will reset all topic statistics.')) {
            router.post('/admin/reset/force', {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
                        <Shield className="w-6 h-6 text-accent-primary" />
                        Admin Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Admin Dashboard" />
            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-dark-700/60 backdrop-blur-sm border border-accent-primary/20 rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Total Users</p>
                                    <p className="text-3xl font-bold text-slate-100">{stats.total_users}</p>
                                </div>
                                <Users className="w-10 h-10 text-accent-secondary" />
                            </div>
                        </div>

                        <div className="bg-dark-700/60 backdrop-blur-sm border border-accent-primary/20 rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Banned Users</p>
                                    <p className="text-3xl font-bold text-red-400">{stats.banned_users}</p>
                                </div>
                                <Shield className="w-10 h-10 text-red-400" />
                            </div>
                        </div>

                        <div className="bg-dark-700/60 backdrop-blur-sm border border-accent-primary/20 rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Total Posts</p>
                                    <p className="text-3xl font-bold text-slate-100">{stats.total_posts}</p>
                                </div>
                                <FileText className="w-10 h-10 text-emerald-400" />
                            </div>
                        </div>

                        <div className="bg-dark-700/60 backdrop-blur-sm border border-accent-primary/20 rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Total Topics</p>
                                    <p className="text-3xl font-bold text-slate-100">{stats.total_topics}</p>
                                </div>
                                <Hash className="w-10 h-10 text-accent-purple" />
                            </div>
                        </div>
                    </div>

                    {/* Reset Information */}
                    <div className="bg-dark-700/60 backdrop-blur-sm border border-accent-primary/20 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-100">
                            <Clock className="w-5 h-5 text-accent-secondary" />
                            Daily Reset Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Scheduled Reset Time:</span>
                                <span className="font-semibold text-slate-100">{stats.reset_time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Last Reset:</span>
                                <span className="font-semibold text-slate-100">
                                    {stats.last_reset ? new Date(stats.last_reset).toLocaleString() : 'Never'}
                                </span>
                            </div>
                            <button
                                onClick={handleForceReset}
                                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-accent-primary to-accent-purple text-white font-semibold py-2 px-4 rounded-lg transition hover:opacity-90"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Force Reset Now
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href="/admin/users"
                            className="p-6 rounded-xl border border-accent-primary/20 bg-gradient-to-br from-accent-primary/10 to-accent-purple/10 hover:from-accent-primary/20 hover:to-accent-purple/20 transition text-center"
                        >
                            <Users className="w-8 h-8 mx-auto mb-2 text-accent-secondary" />
                            <span className="font-semibold text-slate-100">Manage Users</span>
                        </Link>

                        <Link
                            href="/admin/posts"
                            className="p-6 rounded-xl border border-accent-primary/20 bg-gradient-to-br from-accent-primary/10 to-accent-purple/10 hover:from-accent-primary/20 hover:to-accent-purple/20 transition text-center"
                        >
                            <FileText className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                            <span className="font-semibold text-slate-100">Manage Posts</span>
                        </Link>

                        <Link
                            href="/admin/topics"
                            className="p-6 rounded-xl border border-accent-primary/20 bg-gradient-to-br from-accent-primary/10 to-accent-purple/10 hover:from-accent-primary/20 hover:to-accent-purple/20 transition text-center"
                        >
                            <Hash className="w-8 h-8 mx-auto mb-2 text-accent-purple" />
                            <span className="font-semibold text-slate-100">Manage Topics</span>
                        </Link>

                        <Link
                            href="/admin/settings"
                            className="p-6 rounded-xl border border-accent-primary/20 bg-gradient-to-br from-accent-primary/10 to-accent-purple/10 hover:from-accent-primary/20 hover:to-accent-purple/20 transition text-center"
                        >
                            <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <span className="font-semibold text-slate-100">Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
