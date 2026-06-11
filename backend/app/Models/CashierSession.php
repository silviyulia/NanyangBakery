<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CashierSession extends Model
{
    protected $primaryKey = 'session_id';
    public $timestamps = false;

    protected $fillable = [
        'kasir_id',
        'opened_at',
        'closed_at',
        'status',
        'opening_balance',
        'closing_balance',
    ];

    protected $casts = [
        'opened_at' => 'datetime',
        'closed_at' => 'datetime',
        'opening_balance' => 'decimal:2',
        'closing_balance' => 'decimal:2',
    ];

    /**
     * Get the kasir (cashier) who owns this session.
     */
    public function kasir(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kasir_id', 'user_id');
    }

    /**
     * Get all transactions in this session.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'session_id', 'session_id');
    }

    /**
     * Check if session is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && is_null($this->closed_at);
    }

    /**
     * Get total transactions for this session.
     */
    public function getTotalTransactions(): float
    {
        return $this->transactions()
            ->where('payment_status', 'completed')
            ->sum('total_amount');
    }
}
