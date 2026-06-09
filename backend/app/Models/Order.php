<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';
    protected $primaryKey = 'order_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'table_name',
        'status',
        'waiter_id',
        'total',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'created_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the order items for this order.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'order_id');
    }

    /**
     * Get the waiter who handled this order.
     */
    public function waiter()
    {
        return $this->belongsTo(User::class, 'waiter_id', 'id');
    }

    /**
     * Get the transaction for this order.
     */
    public function transaction()
    {
        return $this->hasOne(Transaction::class, 'order_id', 'order_id');
    }
}
