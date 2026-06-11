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
        Schema::create('stock_notifications', function (Blueprint $table) {
            $table->id('notification_id');
            $table->unsignedBigInteger('ingredient_id');
            $table->decimal('minimum_threshold', 12, 2);
            $table->enum('status', ['active', 'inactive', 'triggered'])->default('active');
            $table->timestamp('last_notified_at')->nullable();
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('ingredient_id')->references('ingredient_id')->on('ingredients')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_notifications');
    }
};
