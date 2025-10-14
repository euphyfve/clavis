<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\SystemSetting;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Show admin dashboard
     */
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'banned_users' => User::where('is_banned', true)->count(),
            'total_posts' => Post::count(),
            'total_topics' => Topic::count(),
            'last_reset' => SystemSetting::get('last_reset_at'),
            'reset_time' => SystemSetting::get('daily_reset_time', '00:00'),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * User management - list all users
     */
    public function users(Request $request)
    {
        $query = User::with('stats');

        // Filter
        if ($request->has('filter')) {
            switch ($request->filter) {
                case 'banned':
                    $query->where('is_banned', true);
                    break;
                case 'admin':
                    $query->where('is_admin', true);
                    break;
            }
        }

        // Search
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->latest()->paginate(20);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Ban a user
     */
    public function banUser(Request $request, User $user)
    {
        $this->authorize('ban', $user);

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $user->ban($validated['reason'] ?? 'No reason provided');

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'User banned successfully');
        }

        return response()->json(['message' => 'User banned successfully']);
    }

    /**
     * Unban a user
     */
    public function unbanUser(Request $request, User $user)
    {
        $this->authorize('ban', $user);

        $user->unban();

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'User unbanned successfully');
        }

        return response()->json(['message' => 'User unbanned successfully']);
    }

    /**
     * Delete a user (kick)
     */
    public function deleteUser(Request $request, User $user)
    {
        $this->authorize('delete', $user);

        // Delete user's posts and associated data
        foreach ($user->posts as $post) {
            if ($post->image_path) {
                Storage::disk('public')->delete($post->image_path);
            }
            $post->delete();
        }

        $user->delete();

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'User deleted successfully');
        }

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Content moderation - list posts
     */
    public function posts(Request $request)
    {
        $query = Post::with(['user', 'topics'])->whereNull('parent_id');

        // Search
        if ($request->has('search')) {
            $query->where('content', 'like', '%' . $request->search . '%');
        }

        // Filter by topic
        if ($request->has('topic')) {
            $query->whereHas('topics', function ($q) use ($request) {
                $q->where('slug', $request->topic);
            });
        }

        $posts = $query->latest()->paginate(20);

        return Inertia::render('Admin/Posts', [
            'posts' => $posts,
        ]);
    }

    /**
     * Delete a post
     */
    public function deletePost(Request $request, Post $post)
    {
        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        // Delete all replies recursively
        $this->deletePostAndReplies($post);

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'Post deleted successfully');
        }

        return response()->json(['message' => 'Post deleted successfully']);
    }

    /**
     * Recursively delete post and all its replies
     */
    private function deletePostAndReplies(Post $post)
    {
        foreach ($post->replies as $reply) {
            $this->deletePostAndReplies($reply);
        }
        
        $post->delete();
    }

    /**
     * Topic/Hashtag management
     */
    public function topics(Request $request)
    {
        $query = Topic::with('founder');

        // Search
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $topics = $query->orderBy('post_count', 'desc')->paginate(50);

        return Inertia::render('Admin/Topics', [
            'topics' => $topics,
        ]);
    }

    /**
     * Delete a topic/hashtag
     */
    public function deleteTopic(Request $request, Topic $topic)
    {
        // Detach from all posts
        $topic->posts()->detach();
        
        $topic->delete();

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'Topic deleted successfully');
        }

        return response()->json(['message' => 'Topic deleted successfully']);
    }

    /**
     * System settings page
     */
    public function settings()
    {
        $settings = [
            'daily_reset_time' => SystemSetting::get('daily_reset_time', '00:00'),
            'last_reset_at' => SystemSetting::get('last_reset_at'),
        ];

        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update system settings
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'daily_reset_time' => 'required|date_format:H:i',
        ]);

        SystemSetting::set('daily_reset_time', $validated['daily_reset_time']);

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'Settings updated successfully');
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    /**
     * Force daily reset
     */
    public function forceReset(Request $request)
    {
        Artisan::call('wordboard:daily-reset', ['--force' => true]);

        $output = Artisan::output();

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'Daily reset executed successfully');
        }

        return response()->json([
            'message' => 'Daily reset executed successfully',
            'output' => $output,
        ]);
    }

    /**
     * Make a user admin
     */
    public function makeAdmin(Request $request, User $user)
    {
        $user->update(['is_admin' => true]);

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'User promoted to admin');
        }

        return response()->json(['message' => 'User promoted to admin']);
    }

    /**
     * Remove admin privileges
     */
    public function removeAdmin(Request $request, User $user)
    {
        // Prevent removing yourself as admin
        if ($user->id === auth()->id()) {
            if ($request->header('X-Inertia')) {
                return back(303)->with('error', 'You cannot remove your own admin privileges');
            }
            return response()->json(['error' => 'You cannot remove your own admin privileges'], 403);
        }

        $user->update(['is_admin' => false]);

        if ($request->header('X-Inertia')) {
            return back(303)->with('success', 'Admin privileges removed');
        }

        return response()->json(['message' => 'Admin privileges removed']);
    }
}
