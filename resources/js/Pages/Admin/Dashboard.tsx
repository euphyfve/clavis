import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-2">
                        <Shield className="w-6 h-6" />
                        Admin Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.total_users}</p>
                                </div>
                                <Users className="w-12 h-12 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Banned Users</p>
                                    <p className="text-3xl font-bold text-red-600">{stats.banned_users}</p>
                                </div>
                                <Shield className="w-12 h-12 text-red-500" />
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Posts</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.total_posts}</p>
                                </div>
                                <FileText className="w-12 h-12 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Topics</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.total_topics}</p>
                                </div>
                                <Hash className="w-12 h-12 text-purple-500" />
                            </div>
                        </div>
                    </div>

                    {/* Reset Information */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Daily Reset Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Scheduled Reset Time:</span>
                                <span className="font-semibold">{stats.reset_time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Last Reset:</span>
                                <span className="font-semibold">
                                    {stats.last_reset ? new Date(stats.last_reset).toLocaleString() : 'Never'}
                                </span>
                            </div>
                            <button
                                onClick={handleForceReset}
                                className="w-full mt-4 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
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
                            className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-sm transition text-center"
                        >
                            <Users className="w-8 h-8 mx-auto mb-2" />
                            <span className="font-semibold">Manage Users</span>
                        </Link>

                        <Link
                            href="/admin/posts"
                            className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-sm transition text-center"
                        >
                            <FileText className="w-8 h-8 mx-auto mb-2" />
                            <span className="font-semibold">Manage Posts</span>
                        </Link>

                        <Link
                            href="/admin/topics"
                            className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-sm transition text-center"
                        >
                            <Hash className="w-8 h-8 mx-auto mb-2" />
                            <span className="font-semibold">Manage Topics</span>
                        </Link>

                        <Link
                            href="/admin/settings"
                            className="bg-gray-500 hover:bg-gray-600 text-white p-6 rounded-lg shadow-sm transition text-center"
                        >
                            <Clock className="w-8 h-8 mx-auto mb-2" />
                            <span className="font-semibold">Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
