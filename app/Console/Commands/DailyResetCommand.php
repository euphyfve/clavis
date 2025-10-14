<?php

namespace App\Console\Commands;

use App\Models\SystemSetting;
use App\Models\Topic;
use Illuminate\Console\Command;

class DailyResetCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'wordboard:daily-reset {--force : Force reset regardless of schedule}';

    /**
     * The console command description.
     */
    protected $description = 'Reset daily statistics for topics (hashtags) in the wordboard';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting daily reset...');

        // Reset all topics' daily stats
        $topics = Topic::all();
        $resetCount = 0;

        foreach ($topics as $topic) {
            $topic->resetDailyStats();
            $resetCount++;
        }

        // Update last reset timestamp
        SystemSetting::set('last_reset_at', now()->toDateTimeString());

        $this->info("Daily reset completed! Reset {$resetCount} topics.");
        $this->info('Last reset at: ' . now()->toDateTimeString());

        return Command::SUCCESS;
    }
}
