<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('seen_intro');
            $table->boolean('is_banned')->default(false)->after('is_admin');
            $table->timestamp('banned_at')->nullable()->after('is_banned');
            $table->string('ban_reason')->nullable()->after('banned_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_admin', 'is_banned', 'banned_at', 'ban_reason']);
        });
    }
};
