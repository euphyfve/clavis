<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('topics', function (Blueprint $table) {
            $table->integer('daily_post_count')->default(0)->after('post_count');
            $table->integer('daily_view_count')->default(0)->after('view_count');
            $table->timestamp('last_reset_at')->nullable()->after('daily_view_count');
        });
    }

    public function down(): void
    {
        Schema::table('topics', function (Blueprint $table) {
            $table->dropColumn(['daily_post_count', 'daily_view_count', 'last_reset_at']);
        });
    }
};
