import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Settings as SettingsIcon, Clock, Save } from 'lucide-react';

interface Settings {
    daily_reset_time: string;
    last_reset_at: string | null;
}

export default function AdminSettings({ settings }: { settings: Settings }) {
    const { data, setData, post, processing, errors } = useForm({
        daily_reset_time: settings.daily_reset_time,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings', {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6" />
                    System Settings
                </h2>
            }
        >
            <Head title="System Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">
                    {/* Daily Reset Settings */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Daily Reset Configuration
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="daily_reset_time" className="block text-sm font-medium text-gray-700 mb-2">
                                    Daily Reset Time (24-hour format)
                                </label>
                                <input
                                    type="time"
                                    id="daily_reset_time"
                                    value={data.daily_reset_time}
                                    onChange={(e) => setData('daily_reset_time', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.daily_reset_time && (
                                    <p className="mt-1 text-sm text-red-600">{errors.daily_reset_time}</p>
                                )}
                                <p className="mt-2 text-sm text-gray-500">
                                    The system will automatically reset all topic daily statistics at this time every day.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Scheduled Reset Time:</span>
                                        <span className="font-semibold">{settings.daily_reset_time}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Last Reset:</span>
                                        <span className="font-semibold">
                                            {settings.last_reset_at 
                                                ? new Date(settings.last_reset_at).toLocaleString()
                                                : 'Never'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" />
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </form>
                    </div>

                    {/* Information Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-900 mb-2">About Daily Reset</h4>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li>• Daily reset clears all topic daily statistics (daily_post_count, daily_view_count)</li>
                            <li>• The leaderboard shows 10 best hashtags (by daily activity) + 5 newest hashtags</li>
                            <li>• Total statistics (post_count, view_count) are never reset</li>
                            <li>• You can force a manual reset from the admin dashboard</li>
                            <li>• Make sure your server's cron job is running for automatic resets</li>
                        </ul>
                    </div>

                    {/* Cron Setup Instructions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Cron Setup Required</h4>
                        <p className="text-sm text-yellow-800 mb-3">
                            To enable automatic daily resets, add this cron entry to your server:
                        </p>
                        <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                            * * * * * cd /path-to-your-project &amp;&amp; php artisan schedule:run &gt;&gt; /dev/null 2&gt;&amp;1
                        </code>
                        <p className="text-sm text-yellow-800 mt-3">
                            Replace <code className="bg-yellow-100 px-1 rounded">/path-to-your-project</code> with your actual project path.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
