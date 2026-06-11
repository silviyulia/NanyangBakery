<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * SKIPPED: Tables table created by 2024_06_08_000002_5_create_tables_table_priority
     * This migration left for reference only.
     */
    public function up(): void
    {
        // Table already created in 000002_5 with proper ordering
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Do nothing - table managed by priority migration
    }
};
