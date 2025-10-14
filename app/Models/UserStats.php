<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserStats extends Model
{
    protected $fillable = [
        'user_id',
        'xp',
        'post_count',
        'streak_days',
        'last_post_date',
        'badges',
        'theme_preference',
    ];

    protected $casts = [
        'xp' => 'integer',
        'post_count' => 'integer',
        'streak_days' => 'integer',
        'last_post_date' => 'date',
        'badges' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function addXP(int $amount): void
    {
        $this->increment('xp', $amount);
        $this->checkAndAwardBadges();
    }

    public function incrementPostCount(): void
    {
        $this->increment('post_count');
        $this->updateStreak();
    }

    private function updateStreak(): void
    {
        $today = now()->toDateString();
        $lastPost = $this->last_post_date?->toDateString();

        if ($lastPost === $today) {
            return;
        }

        if ($lastPost === now()->subDay()->toDateString()) {
            $this->increment('streak_days');
        } else {
            $this->streak_days = 1;
        }

        $this->last_post_date = $today;
        $this->save();
    }

    private function checkAndAwardBadges(): void
    {
        $badges = $this->badges ?? [];

        if ($this->post_count >= 1 && !in_array('starter_flame', $badges)) {
            $badges[] = 'starter_flame';
        }

        if ($this->post_count >= 10 && !in_array('word_warrior', $badges)) {
            $badges[] = 'word_warrior';
        }

        if ($this->post_count >= 50 && !in_array('trendmaker', $badges)) {
            $badges[] = 'trendmaker';
        }

        if ($this->streak_days >= 7 && !in_array('week_streak', $badges)) {
            $badges[] = 'week_streak';
        }

        $this->badges = $badges;
        $this->save();
    }
}
