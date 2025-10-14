<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Topic extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'founder_id',
        'post_count',
        'view_count',
        'daily_post_count',
        'daily_view_count',
        'last_reset_at',
        'category',
        'mood',
    ];

    protected $casts = [
        'post_count' => 'integer',
        'view_count' => 'integer',
        'daily_post_count' => 'integer',
        'daily_view_count' => 'integer',
        'last_reset_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($topic) {
            if (empty($topic->slug)) {
                $topic->slug = Str::slug($topic->name);
            }
        });
    }

    public function founder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'founder_id');
    }

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class)->withTimestamps();
    }

    public function incrementPostCount(): void
    {
        $this->increment('post_count');
        $this->increment('daily_post_count');
    }

    public function incrementViewCount(): void
    {
        $this->increment('view_count');
        $this->increment('daily_view_count');
    }

    /**
     * Reset daily counters
     */
    public function resetDailyStats(): void
    {
        $this->update([
            'daily_post_count' => 0,
            'daily_view_count' => 0,
            'last_reset_at' => now(),
        ]);
    }

    /**
     * Check if this is a new topic (created today)
     */
    public function isNew(): bool
    {
        return $this->created_at->isToday();
    }
}
