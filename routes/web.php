<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('wordcloud.index');
    }
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Clavis Wordcloud Routes
    Route::get('/wordcloud', [PostController::class, 'index'])->name('wordcloud.index');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/word/{word}', [PostController::class, 'getByWord'])->name('posts.by-word');
    Route::get('/api/word-frequencies', [PostController::class, 'getWordFrequencies'])->name('api.word-frequencies');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
