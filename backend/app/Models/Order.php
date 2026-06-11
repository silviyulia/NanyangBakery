<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';
    protected $primaryKey = 'order_id';
    public $incrementing = true;
    protected $keyType = 'bigint';

    protected $fillable = [
        'table_id',
        'waitres_id',
        'status',
        'total_price',
        'notes',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the table associated with the order.
     */
    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class, 'table_id', 'table_id');
    }

    /**
     * Get the waitres who created the order.
     */
    public function waitres(): BelongsTo
    {
        return $this->belongsTo(User::class, 'waitres_id', 'user_id');
    }

    /**
     * Get all items in the order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'order_id');
    }

    /**
     * Get the transaction for this order.
     */
    public function transaction(): HasOne
    {
        return $this->hasOne(Transaction::class, 'order_id', 'order_id');
    }

    /**
     * Calculate total price from order items.
     */
    public function calculateTotal(): void
    {
        $this->total_price = $this->items->sum('subtotal');
        $this->save();
    }

    /**
     * Check if order can be confirmed.
     */
    public function canBeConfirmed(): bool
    {
        return $this->status === 'pending' && $this->items()->count() > 0;
    }
}
