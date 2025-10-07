<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use App\Models\WordFrequency;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test users
        $users = [];
        
        $users[] = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $users[] = User::firstOrCreate(
            ['email' => 'alice@example.com'],
            [
                'name' => 'Alice Cosmos',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $users[] = User::firstOrCreate(
            ['email' => 'bob@example.com'],
            [
                'name' => 'Bob Nebula',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $users[] = User::firstOrCreate(
            ['email' => 'charlie@example.com'],
            [
                'name' => 'Charlie Starlight',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Sample words and phrases for the wordcloud
        $sampleWords = [
            'hope', 'dream', 'journey', 'adventure', 'cosmic', 'void',
            'starlight', 'nebula', 'galaxy', 'universe', 'infinity',
            'wonder', 'mystery', 'discovery', 'exploration', 'beautiful',
            'amazing', 'incredible', 'fantastic', 'brilliant', 'stellar',
            'radiant', 'luminous', 'ethereal', 'celestial', 'transcendent',
            'serenity', 'harmony', 'balance', 'peace', 'tranquility',
            'energy', 'power', 'strength', 'courage', 'resilience',
            'love', 'joy', 'happiness', 'gratitude', 'kindness',
            'creativity', 'inspiration', 'imagination', 'innovation', 'vision',
            'connection', 'unity', 'together', 'community', 'belonging',
        ];

        // Create posts with varying frequencies
        foreach ($sampleWords as $word) {
            // Random frequency (1-15 posts per word)
            $frequency = rand(1, 15);
            
            for ($i = 0; $i < $frequency; $i++) {
                $user = $users[array_rand($users)];
                $normalized = Post::normalizeContent($word);
                
                Post::create([
                    'user_id' => $user->id,
                    'content' => $word,
                    'normalized_content' => $normalized,
                    'created_at' => now()->subMinutes(rand(1, 1440)), // Random time in last 24 hours
                ]);

                // Update word frequency
                $wordFreq = WordFrequency::firstOrCreate(
                    ['word' => $normalized],
                    ['count' => 0]
                );
                $wordFreq->increment('count');
            }
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Test users created:');
        $this->command->info('- test@example.com (password: password)');
        $this->command->info('- alice@example.com (password: password)');
        $this->command->info('- bob@example.com (password: password)');
        $this->command->info('- charlie@example.com (password: password)');
    }
}
