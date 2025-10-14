<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Topic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WordboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        
        // Get trending topics for word cloud
        // Only show topics with at least 1 post to avoid clutter
        $topics = Topic::with('founder')
            ->where('post_count', '>', 0)
            ->orderBy('post_count', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($topic) {
                return [
                    'id' => $topic->id,
                    'name' => $topic->name,
                    'slug' => $topic->slug,
                    'count' => $topic->post_count,
                    'founder' => $topic->founder ? [
                        'id' => $topic->founder->id,
                        'name' => $topic->founder->name,
                        'avatar' => $topic->founder->avatar,
                    ] : null,
                    'category' => $topic->category,
                    'mood' => $topic->mood,
                ];
            });

        return Inertia::render('Wordboard/Index', [
            'topics' => $topics,
            'showIntro' => $user && !$user->seen_intro,
        ]);
    }

    public function markIntroSeen(Request $request)
    {
        $user = auth()->user();
        if ($user) {
            $user->update(['seen_intro' => true]);
        }
        
        return back();
    }
}
