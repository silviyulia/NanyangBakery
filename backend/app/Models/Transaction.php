<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    protected $table = 'transactions';
    protected $primaryKey = 'transaction_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'order_id',
        'table_name',
        'items_count',
        'total',
        'payment_method',
        'cashier_id',
        'transaction_date',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'transaction_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the order for this transaction.
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    /**
     * Get the cashier who processed this transaction.
     */
    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id', 'id');
    }
}
