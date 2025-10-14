<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'content',
        'image_path',
        'mentions',
        'hashtags',
        'reaction_count',
        'comment_count',
        'parent_id',
    ];

    protected $casts = [
        'mentions' => 'array',
        'hashtags' => 'array',
        'reaction_count' => 'integer',
        'comment_count' => 'integer',
    ];

    protected $with = ['user'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Post::class, 'parent_id')->latest();
    }

    public function topics(): BelongsToMany
    {
        return $this->belongsToMany(Topic::class)->withTimestamps();
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    public function isReply(): bool
    {
        return !is_null($this->parent_id);
    }
}
