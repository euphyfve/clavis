<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->integer('xp')->default(0);
            $table->integer('post_count')->default(0);
            $table->integer('streak_days')->default(0);
            $table->date('last_post_date')->nullable();
            $table->json('badges')->nullable(); // ["trendmaker", "starter_flame"]
            $table->string('theme_preference')->default('neonverse'); // neonverse, light, dark, cyber
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_stats');
    }
};
