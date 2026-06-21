<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Transaction extends Model
{
    use HasFactory;

    protected $table = 'transactions';

    protected $primaryKey = 'transaction_id';

    public $incrementing = true;

protected $fillable = [
    'order_id',
    'kasir_id',
    'session_id',
    'total_amount',
    'payment_method',
    'payment_status',
    'amount_paid',
    'change_amount',
    'reference_number'
];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'change_amount' => 'decimal:2',
    ];

    /**
     * Get the order for this transaction.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }

    /**
     * Get the kasir who processed this transaction.
     */
    public function kasir(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kasir_id', 'user_id');
    }

    /**
     * Get the cashier session for this transaction.
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(CashierSession::class, 'session_id', 'session_id');
    }

    /**
     * Get the receipt for this transaction.
     */
    public function receipt(): HasOne
    {
        return $this->hasOne(Receipt::class, 'transaction_id', 'transaction_id');
    }

    /**
     * Calculate change amount.
     */
    protected static function booted(): void
    {
        static::saving(function ($model) {
            if ($model->payment_method === 'cash') {
                $model->change_amount = $model->amount_paid - $model->total_amount;
            } else {
                $model->change_amount = 0;
            }
        });
    }
}
