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
        'category',
        'mood',
    ];

    protected $casts = [
        'post_count' => 'integer',
        'view_count' => 'integer',
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
    }

    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }
}
