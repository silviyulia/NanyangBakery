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

    // Jika primary key bukan "id"
    protected $primaryKey = 'id';
    
    public $incrementing = true;

    protected $keyType = 'int';

protected $fillable = [
    'table_id',
    'waitres_id',
    'status',
    'total_amount',
];

protected $casts = [
    'total_amount' => 'decimal:2',
    'created_at' => 'datetime',
    'updated_at' => 'datetime',
];

    
    /**
     * Relasi ke meja
     */
    public function table(): BelongsTo
    {
        return $this->belongsTo(
            Table::class,
            'table_id',
            'table_id'
        );
    }

    /**
     * Relasi ke waiter/waitress
     */
    public function waitres(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'waitres_id',
            'user_id'
        );
    }

    /**
     * Relasi item order
     */
    public function items(): HasMany
    {
        return $this->hasMany(
            OrderItem::class,
            'order_id',
            'id'
        );
    }
    /**
     * Relasi transaksi
     */
    public function transaction(): HasOne
    {
return $this->hasOne(
    Transaction::class,
    'order_id',
    'id'
);
    }

    /**
     * Hitung total order
     */
    public function calculateTotal(): void
    {
        $this->loadMissing('items');

        $this->total_amount = $this->items->sum(function ($item) {
                return $item->subtotal ?? ($item->quantity * $item->price);
        });

        $this->save();
    }

    /**
     * Cek apakah order bisa dikonfirmasi
     */
    public function canBeConfirmed(): bool
    {
        return $this->status === 'pending'
            && $this->items()->exists();
    }
}