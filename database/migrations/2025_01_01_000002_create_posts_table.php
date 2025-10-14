<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->string('image_path')->nullable();
            $table->json('mentions')->nullable(); // [@user1, @user2]
            $table->json('hashtags')->nullable(); // [#topic1, #topic2]
            $table->integer('reaction_count')->default(0);
            $table->integer('comment_count')->default(0);
            $table->foreignId('parent_id')->nullable()->constrained('posts')->cascadeOnDelete();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('parent_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
