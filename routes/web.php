<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WordboardController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Wordboard main routes
Route::get('/', [WordboardController::class, 'index'])->name('wordboard.index');

// Dashboard (alias to wordboard index for authenticated users)
Route::middleware('auth')->get('/dashboard', [WordboardController::class, 'index'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Mark intro as seen
    Route::post('/intro/seen', [WordboardController::class, 'markIntroSeen'])->name('intro.seen');
    
    // Posts
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    
    // Reactions
    Route::post('/posts/{post}/reactions', [ReactionController::class, 'toggle'])->name('reactions.toggle');
    
    // User Profile
    Route::patch('/user/profile', [UserProfileController::class, 'update'])->name('user.update');
    Route::get('/user/stats', [UserProfileController::class, 'stats'])->name('user.stats');
});

// Public routes
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/{post}/reactions', [ReactionController::class, 'getPostReactions'])->name('posts.reactions');

// Topics
Route::get('/topics', [TopicController::class, 'index'])->name('topics.index');
Route::get('/topics/trending', [TopicController::class, 'trending'])->name('topics.trending');
Route::get('/topics/{topic:slug}', [TopicController::class, 'show'])->name('topics.show');

// API Routes for Leaderboard
Route::get('/api/topics/leaderboard', [TopicController::class, 'leaderboard'])->name('api.topics.leaderboard');
Route::get('/api/posts/trending', [PostController::class, 'trendingFeed'])->name('api.posts.trending');

// User profiles
Route::get('/users/{user}', [UserProfileController::class, 'show'])->name('users.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [AdminController::class, 'index'])->name('dashboard');
    
    // User Management
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::post('/users/{user}/ban', [AdminController::class, 'banUser'])->name('users.ban');
    Route::post('/users/{user}/unban', [AdminController::class, 'unbanUser'])->name('users.unban');
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser'])->name('users.delete');
    Route::post('/users/{user}/make-admin', [AdminController::class, 'makeAdmin'])->name('users.make-admin');
    Route::post('/users/{user}/remove-admin', [AdminController::class, 'removeAdmin'])->name('users.remove-admin');
    
    // Content Moderation
    Route::get('/posts', [AdminController::class, 'posts'])->name('posts');
    Route::delete('/posts/{post}', [AdminController::class, 'deletePost'])->name('posts.delete');
    
    // Topic Management
    Route::get('/topics', [AdminController::class, 'topics'])->name('topics');
    Route::delete('/topics/{topic}', [AdminController::class, 'deleteTopic'])->name('topics.delete');
    
    // Settings
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::post('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
    
    // Daily Reset
    Route::post('/reset/force', [AdminController::class, 'forceReset'])->name('reset.force');
});

require __DIR__.'/auth.php';
