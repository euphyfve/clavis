<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, integer, boolean, time
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        DB::table('system_settings')->insert([
            [
                'key' => 'daily_reset_time',
                'value' => '00:00',
                'type' => 'time',
                'description' => 'Daily reset time (24-hour format HH:MM)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'last_reset_at',
                'value' => now()->toDateTimeString(),
                'type' => 'datetime',
                'description' => 'Last time the daily reset was executed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
