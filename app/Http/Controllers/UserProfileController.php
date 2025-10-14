<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function show(User $user)
    {
        $user->load(['stats', 'foundedTopics']);
        
        $posts = $user->posts()
            ->with(['topics', 'reactions'])
            ->whereNull('parent_id')
            ->latest()
            ->paginate(20);

        // Get user's most contributed topics
        $topTopics = $user->posts()
            ->with('topics')
            ->get()
            ->pluck('topics')
            ->flatten()
            ->groupBy('id')
            ->map(function ($group) {
                $topic = $group->first();
                return [
                    'id' => $topic->id,
                    'name' => $topic->name,
                    'slug' => $topic->slug,
                    'count' => $group->count(),
                ];
            })
            ->sortByDesc('count')
            ->take(10)
            ->values();

        return Inertia::render('Wordboard/Profile', [
            'profileUser' => $user,
            'posts' => $posts,
            'topTopics' => $topTopics,
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string|max:500',
            'avatar' => 'nullable|image|max:2048',
            'theme_preference' => 'sometimes|in:neonverse,light,dark,cyber',
        ]);

        if ($request->hasFile('avatar')) {
            // Delete old avatar
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($validated);

        // Update theme preference in stats
        if (isset($validated['theme_preference'])) {
            $user->stats()->updateOrCreate(
                ['user_id' => $user->id],
                ['theme_preference' => $validated['theme_preference']]
            );
        }

        return response()->json([
            'user' => $user->fresh(['stats']),
            'message' => 'Profile updated successfully',
        ]);
    }

    public function stats()
    {
        $user = auth()->user();
        $stats = $user->stats()->firstOrCreate(['user_id' => $user->id]);

        return response()->json($stats);
    }
}
