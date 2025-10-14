<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // fire, comment, idea, heart
            $table->timestamps();
            
            $table->unique(['user_id', 'post_id', 'type']);
            $table->index('post_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reactions');
    }
};
