<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use App\Models\Reaction;
use Illuminate\Http\Request;

class ReactionController extends Controller
{
    public function toggle(Request $request, Post $post)
    {
        $validated = $request->validate([
            'type' => 'required|in:fire,idea,heart',
        ]);

        $user = auth()->user();
        
        $reaction = Reaction::where([
            'user_id' => $user->id,
            'post_id' => $post->id,
            'type' => $validated['type'],
        ])->first();

        if ($reaction) {
            // Remove reaction
            $reaction->delete();
            $post->decrement('reaction_count');
            $action = 'removed';
        } else {
            // Add reaction
            Reaction::create([
                'user_id' => $user->id,
                'post_id' => $post->id,
                'type' => $validated['type'],
            ]);
            $post->increment('reaction_count');
            $action = 'added';
            
            // Award XP for engagement
            $user->stats->addXP(2);
        }

        // If this is an Inertia request, redirect back so Inertia gets a proper response
        if ($request->header('X-Inertia')) {
            return back(303)->with('reaction', [
                'action' => $action,
                'reaction_count' => $post->fresh()->reaction_count,
            ]);
        }

        // Non-Inertia/API consumers still receive JSON
        return response()->json([
            'action' => $action,
            'reaction_count' => $post->fresh()->reaction_count,
        ]);
    }

    public function getPostReactions(Post $post)
    {
        $reactions = $post->reactions()
            ->with('user')
            ->get()
            ->groupBy('type')
            ->map(function ($group) {
                return [
                    'count' => $group->count(),
                    'users' => $group->map(fn($r) => [
                        'id' => $r->user->id,
                        'name' => $r->user->name,
                        'avatar' => $r->user->avatar,
                    ]),
                ];
            });

        return response()->json($reactions);
    }
}
