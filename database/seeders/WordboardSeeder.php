<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Topic;
use App\Models\Post;
use App\Models\UserStats;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class WordboardSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo users
        $users = [];
        
        $users[] = User::create([
            'name' => 'Alex Cyber',
            'email' => 'alex@clavis.test',
            'password' => bcrypt('password'),
            'bio' => 'Tech enthusiast and wordboard pioneer 🚀',
            'seen_intro' => true,
        ]);

        $users[] = User::create([
            'name' => 'Nova Pulse',
            'email' => 'nova@clavis.test',
            'password' => bcrypt('password'),
            'bio' => 'Gaming streamer | Trendmaker',
            'seen_intro' => true,
        ]);

        $users[] = User::create([
            'name' => 'Zara Neon',
            'email' => 'zara@clavis.test',
            'password' => bcrypt('password'),
            'bio' => 'Digital artist exploring the metaverse',
            'seen_intro' => true,
        ]);

        // Create user stats for each user
        foreach ($users as $index => $user) {
            UserStats::create([
                'user_id' => $user->id,
                'xp' => ($index + 1) * 50,
                'post_count' => ($index + 1) * 5,
                'streak_days' => $index + 1,
                'last_post_date' => now(),
                'badges' => $index === 0 ? ['starter_flame', 'word_warrior'] : ['starter_flame'],
                'theme_preference' => 'neonverse',
            ]);
        }

        // Create topics
        $topicData = [
            ['name' => 'tech', 'category' => 'technology'],
            ['name' => 'gaming', 'category' => 'entertainment'],
            ['name' => 'ai', 'category' => 'technology'],
            ['name' => 'music', 'category' => 'entertainment'],
            ['name' => 'crypto', 'category' => 'finance'],
            ['name' => 'fitness', 'category' => 'lifestyle'],
            ['name' => 'coding', 'category' => 'technology'],
            ['name' => 'art', 'category' => 'creative'],
            ['name' => 'travel', 'category' => 'lifestyle'],
            ['name' => 'food', 'category' => 'lifestyle'],
        ];

        $topics = [];
        foreach ($topicData as $data) {
            $topics[] = Topic::create([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'founder_id' => $users[array_rand($users)]->id,
                'category' => $data['category'],
                'post_count' => 0,
                'view_count' => 0,
            ]);
        }

        // Create posts
        $postContents = [
            'Just discovered an amazing new #ai tool that changed my workflow! #tech #productivity',
            'Who else is excited about the new #gaming releases this month? 🎮 #entertainment',
            'The future of #crypto is looking bright! What are your thoughts? #finance',
            'Started my #coding journey today. Any tips for beginners? #tech #learning',
            'This #music festival lineup is absolutely insane! 🎵 #entertainment',
            'My #fitness transformation has been incredible. Consistency is key! 💪 #lifestyle',
            'Created some new digital #art today. The creative process never stops! 🎨 #creative',
            'Planning my next #travel adventure. Where should I go? ✈️ #lifestyle',
            'Tried a new #food recipe and it turned out amazing! #cooking #lifestyle',
            'The intersection of #tech and #art is where magic happens ✨',
            '#ai is revolutionizing how we approach problem-solving #tech #innovation',
            'Late night #coding session. Building something cool! #tech #developer',
            'This #gaming community is the best! Thanks for all the support 🙏 #entertainment',
            'Exploring new #music genres. Recommendations welcome! #entertainment',
            '#crypto market analysis: staying optimistic about the future #finance',
        ];

        foreach ($postContents as $content) {
            $user = $users[array_rand($users)];
            
            // Extract hashtags
            preg_match_all('/#(\w+)/', $content, $matches);
            $hashtags = $matches[1];

            $post = Post::create([
                'user_id' => $user->id,
                'content' => $content,
                'hashtags' => $hashtags,
                'reaction_count' => rand(0, 20),
                'comment_count' => rand(0, 5),
            ]);

            // Attach topics
            foreach ($hashtags as $tag) {
                $topic = Topic::where('name', $tag)->first();
                if ($topic) {
                    $post->topics()->attach($topic->id);
                    $topic->increment('post_count');
                }
            }
        }

        $this->command->info('✅ Wordboard demo data seeded successfully!');
        $this->command->info('📧 Demo users:');
        $this->command->info('   - alex@clavis.test (password: password)');
        $this->command->info('   - nova@clavis.test (password: password)');
        $this->command->info('   - zara@clavis.test (password: password)');
    }
}
