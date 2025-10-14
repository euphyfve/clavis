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
        
        // Get top 10 best hashtags based on daily activity
        $topHashtags = Topic::with('founder')
            ->where('daily_post_count', '>', 0)
            ->orderBy('daily_post_count', 'desc')
            ->orderBy('daily_view_count', 'desc')
            ->limit(10)
            ->get();

        // Get 5 newest hashtags created today
        $newHashtags = Topic::with('founder')
            ->whereDate('created_at', today())
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Merge and remove duplicates (in case a new hashtag is also in top 10)
        $allHashtags = $topHashtags->merge($newHashtags)->unique('id')->take(15);

        $topics = $allHashtags->map(function ($topic) {
            return [
                'id' => $topic->id,
                'name' => $topic->name,
                'slug' => $topic->slug,
                'count' => $topic->post_count,
                'daily_count' => $topic->daily_post_count,
                'view_count' => $topic->view_count,
                'is_new' => $topic->isNew(),
                'founder' => $topic->founder ? [
                    'name' => $topic->founder->name,
                ] : null,
            ];
        });

        return response()->json($topics);
    }

    /**
     * Get all topics with advanced filtering (for admin and detailed views)
     */
    public function allTopics(Request $request)
    {
        $filter = $request->get('filter', 'hot');
        
        $query = Topic::with('founder')
            ->select('topics.*')
            ->selectRaw('topics.post_count as count');

        switch ($filter) {
            case 'hot':
                // Hot: Based on daily activity
                $query->orderBy('daily_post_count', 'desc')
                    ->orderBy('daily_view_count', 'desc');
                break;
                
            case 'trending':
                // Trending: Most posts overall
                $query->orderBy('post_count', 'desc');
                break;
                
            case 'new':
                // New: Recently created topics
                $query->orderBy('created_at', 'desc');
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
                    'daily_count' => $topic->daily_post_count,
                    'view_count' => $topic->view_count,
                    'is_new' => $topic->isNew(),
                    'founder' => $topic->founder ? [
                        'name' => $topic->founder->name,
                    ] : null,
                ];
            });

        return response()->json($topics);
    }
}
