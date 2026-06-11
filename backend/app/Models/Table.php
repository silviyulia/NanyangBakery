<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Table extends Model
{
    use HasFactory;

    protected $table = 'tables';
    protected $primaryKey = 'table_id';
    public $incrementing = true;
    protected $keyType = 'bigint';
    public $timestamps = false;

    protected $fillable = [
        'table_number',
        'capacity',
        'status',
    ];

    /**
     * Get all orders for this table.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'table_id', 'table_id');
    }

    /**
     * Get the active order for this table.
     */
    public function activeOrder()
    {
        return $this->hasOne(Order::class, 'table_id', 'table_id')
            ->where('status', '!=', 'completed')
            ->where('status', '!=', 'cancelled');
    }

    /**
     * Check if table is available.
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    /**
     * Update table status.
     */
    public function updateStatus(string $status): void
    {
        $this->status = $status;
        $this->save();
    }
}
