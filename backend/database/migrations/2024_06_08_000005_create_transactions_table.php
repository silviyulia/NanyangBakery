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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id('transaction_id');
            $table->unsignedBigInteger('order_id')->nullable();
            $table->unsignedInteger('kasir_id');
            $table->unsignedBigInteger('session_id')->nullable();
            $table->decimal('total_amount', 12, 2);
            $table->enum('payment_method', ['cash', 'qris', 'transfer'])->default('cash');
            $table->enum('payment_status', ['pending', 'completed', 'failed'])->default('pending');
            $table->decimal('amount_paid', 12, 2);
            $table->decimal('change_amount', 12, 2)->default(0);
            $table->string('reference_number')->nullable()->unique();
            $table->timestamps();
            
            // Foreign keys
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('set null');
            $table->foreign('kasir_id')->references('user_id')->on('users')->onDelete('restrict');
            // session_id FK will be added in a separate migration after cashier_sessions table exists
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
