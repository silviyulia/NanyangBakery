<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Fields sudah ditambah di create_users_table, skip
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Skip
    }
};
