<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Receipt extends Model
{
    protected $primaryKey = 'receipt_id';
    public $timestamps = true;

    protected $fillable = [
        'transaction_id',
        'receipt_number',
        'table_id',
        'items_detail',
        'subtotal',
        'discount',
        'total',
        'amount_paid',
        'change',
        'payment_method',
        'notes',
    ];

    protected $casts = [
        'items_detail' => 'array',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'change' => 'decimal:2',
    ];

    /**
     * Get the transaction for this receipt.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id', 'transaction_id');
    }

    /**
     * Get the table for this receipt.
     */
    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class, 'table_id', 'table_id');
    }

    /**
     * Generate receipt number.
     */
    public static function generateReceiptNumber(): string
    {
        $date = now()->format('YmdHis');
        $count = self::whereDate('created_at', now())->count() + 1;
        return 'RCP' . $date . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}
