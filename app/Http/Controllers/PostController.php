<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\WordFrequency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Display the main wordcloud feed
     */
    public function index(): Response
    {
        $posts = Post::with('user')
            ->latest()
            ->take(100)
            ->get();

        $wordFrequencies = WordFrequency::getTopWords(100);

        return Inertia::render('Wordcloud/Index', [
            'posts' => $posts,
            'wordFrequencies' => $wordFrequencies,
        ]);
    }

    /**
     * Store a new post
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:100',
        ]);

        $normalized = Post::normalizeContent($validated['content']);

        $post = Post::create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
            'normalized_content' => $normalized,
        ]);

        // Update word frequency
        WordFrequency::incrementWord($normalized);

        return back()->with('success', 'Word posted successfully!');
    }

    /**
     * Get posts by word
     */
    public function getByWord(string $word)
    {
        $normalized = strtolower(trim($word));

        $posts = Post::with('user')
            ->where('normalized_content', $normalized)
            ->latest()
            ->get();

        return response()->json([
            'word' => $word,
            'posts' => $posts,
        ]);
    }

    /**
     * Get real-time word frequencies (for polling)
     */
    public function getWordFrequencies()
    {
        $wordFrequencies = WordFrequency::getTopWords(100);

        return response()->json([
            'wordFrequencies' => $wordFrequencies,
        ]);
    }
}
