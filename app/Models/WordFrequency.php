<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WordFrequency extends Model
{
    protected $fillable = [
        'word',
        'count',
    ];

    protected $casts = [
        'count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Increment the frequency count for a word
     */
    public static function incrementWord(string $word): void
    {
        $normalized = strtolower(trim($word));
        
        static::updateOrCreate(
            ['word' => $normalized],
            ['count' => 1]
        )->increment('count');
    }

    /**
     * Get top words by frequency
     */
    public static function getTopWords(int $limit = 100): \Illuminate\Database\Eloquent\Collection
    {
        return static::orderBy('count', 'desc')
            ->limit($limit)
            ->get();
    }
}
