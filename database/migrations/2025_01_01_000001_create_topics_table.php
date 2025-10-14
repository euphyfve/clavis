<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->foreignId('founder_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('post_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->string('category')->nullable();
            $table->string('mood')->nullable(); // calm, chaos, neon, minimal
            $table->timestamps();
            
            $table->index('post_count');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};
