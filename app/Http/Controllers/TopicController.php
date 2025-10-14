<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TopicController extends Controller
{
    public function index(Request $request)
    {
        $query = Topic::with('founder');

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Sort options
        $sortBy = $request->get('sort', 'trending');
        
        switch ($sortBy) {
            case 'trending':
                $query->orderBy('post_count', 'desc');
                break;
            case 'new':
                $query->latest();
                break;
            case 'views':
                $query->orderBy('view_count', 'desc');
                break;
        }

        $topics = $query->paginate(50);

        return response()->json($topics);
    }

    public function show(Topic $topic)
    {
        $topic->incrementViewCount();
        
        $posts = $topic->posts()
            ->with(['user.stats', 'reactions'])
            ->whereNull('parent_id')
            ->latest()
            ->paginate(20);

        return Inertia::render('Wordboard/TopicFeed', [
            'topic' => $topic->load('founder'),
            'posts' => $posts,
        ]);
    }

    public function trending()
    {
        $topics = Topic::with('founder')
            ->orderBy('post_count', 'desc')
            ->limit(100)
            ->get();

        return response()->json($topics);
    }

    public function leaderboard(Request $request)
    {
        $filter = $request->get('filter', 'hot');
        
        $query = Topic::with('founder')
            ->select('topics.*')
            ->selectRaw('topics.post_count as count');

        switch ($filter) {
            case 'hot':
                // Hot: Based on recent activity (posts in last 7 days + total posts)
                $query->selectRaw('(
                    SELECT COUNT(*) 
                    FROM posts 
                    WHERE posts.id IN (
                        SELECT post_id FROM post_topic WHERE topic_id = topics.id
                    ) 
                    AND posts.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                ) as recent_posts')
                ->orderByRaw('recent_posts DESC, post_count DESC');
                break;
                
            case 'trending':
                // Trending: Most posts overall
                $query->orderBy('post_count', 'desc');
                break;
                
            case 'new':
                // New: Recently created topics with activity
                $query->where('created_at', '>=', now()->subDays(30))
                    ->orderBy('created_at', 'desc');
                break;
        }

        $topics = $query->where('post_count', '>', 0)
            ->limit(50)
            ->get()
            ->map(function ($topic) {
                return [
                    'id' => $topic->id,
                    'name' => $topic->name,
                    'slug' => $topic->slug,
                    'count' => $topic->post_count,
                    'view_count' => $topic->view_count,
                    'founder' => $topic->founder ? [
                        'name' => $topic->founder->name,
                    ] : null,
                ];
            });

        return response()->json($topics);
    }
}
