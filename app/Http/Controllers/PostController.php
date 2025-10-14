<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'image' => 'nullable|image|max:5120',
            'parent_id' => 'nullable|exists:posts,id',
        ]);

        $user = auth()->user();
        
        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        // Extract mentions and hashtags
        $mentions = $this->extractMentions($validated['content']);
        $hashtags = $this->extractHashtags($validated['content']);

        // Create post
        $post = Post::create([
            'user_id' => $user->id,
            'content' => $validated['content'],
            'image_path' => $imagePath,
            'mentions' => $mentions,
            'hashtags' => $hashtags,
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        \Log::info('Post created:', [
            'id' => $post->id,
            'parent_id' => $post->parent_id,
            'content' => $post->content,
            'is_reply' => $post->parent_id ? 'yes' : 'no'
        ]);

        // Create or update topics from hashtags (only for main posts, not replies)
        if (!$post->parent_id) {
            foreach ($hashtags as $tag) {
                $topic = Topic::firstOrCreate(
                    ['name' => $tag],
                    [
                        'slug' => Str::slug($tag),
                        'founder_id' => $user->id,
                    ]
                );
                
                $post->topics()->attach($topic->id);
                $topic->incrementPostCount();
            }
        }

        // Update user stats
        $stats = $user->stats()->firstOrCreate(['user_id' => $user->id]);
        $stats->incrementPostCount();
        $stats->addXP(10); // 10 XP per post

        // Update parent comment count if reply
        if ($post->parent_id) {
            $parent = Post::find($post->parent_id);
            if ($parent) {
                $parent->increment('comment_count');
                \Log::info('Updated parent comment count:', [
                    'parent_id' => $parent->id,
                    'new_count' => $parent->comment_count
                ]);
            }
        }

        // Broadcast event (will implement with Laravel Echo)
        // broadcast(new PostCreated($post))->toOthers();

        return back()->with('success', 'Post created successfully');
    }

    public function index(Request $request)
    {
        $query = Post::with(['user.stats', 'topics', 'reactions'])
            ->whereNull('parent_id');

        // Filter by topic
        if ($request->has('topic')) {
            $query->whereHas('topics', function ($q) use ($request) {
                $q->where('slug', $request->topic);
            });
        }

        $posts = $query->latest()->paginate(20);

        return response()->json($posts);
    }

    public function show(Post $post)
    {
        // Load all nested replies recursively (up to 3 levels)
        $post->load([
            'user.stats', 
            'topics', 
            'reactions',
            'replies' => function ($query) {
                $query->with([
                    'user.stats', 
                    'reactions',
                    'replies' => function ($q) {
                        $q->with([
                            'user.stats', 
                            'reactions',
                            'replies.user.stats',
                            'replies.reactions'
                        ])->latest();
                    }
                ])->latest();
            }
        ]);
        
        // Check if request wants JSON (for API) or HTML (for page view)
        if (request()->wantsJson()) {
            return response()->json($post);
        }
        
        // Return Inertia page for web view
        return Inertia::render('Wordboard/PostDetail', [
            'post' => $post,
        ]);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    public function trendingFeed(Request $request)
    {
        // Get top 10 posts with most 'fire' reactions (hot votes)
        $posts = Post::with(['user.stats', 'topics', 'reactions', 'replies.user.stats', 'replies.reactions'])
            ->whereNull('parent_id')
            ->withCount(['reactions as fire_count' => function ($query) {
                $query->where('type', 'fire');
            }])
            ->orderBy('fire_count', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json($posts);
    }

    private function extractMentions(string $content): array
    {
        preg_match_all('/@(\w+)/', $content, $matches);
        return array_unique($matches[1]);
    }

    private function extractHashtags(string $content): array
    {
        preg_match_all('/#(\w+)/', $content, $matches);
        return array_unique($matches[1]);
    }
}
