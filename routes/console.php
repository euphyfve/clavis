<?php

use App\Models\SystemSetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule daily reset based on admin-configured time
// Note: The time is checked dynamically when the scheduler runs
Schedule::command('wordboard:daily-reset')->daily()->when(function () {
    $resetTime = SystemSetting::get('daily_reset_time', '00:00');
    $currentTime = now()->format('H:i');
    
    // Check if current time matches reset time (within 1 minute window)
    return $currentTime === $resetTime;
})->name('daily-wordboard-reset')->withoutOverlapping();
