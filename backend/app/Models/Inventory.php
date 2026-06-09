<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory';
    protected $primaryKey = 'inventory_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nama',
        'stok',
        'satuan',
        'min_stok',
        'status',
    ];

    protected $casts = [
        'stok' => 'decimal:2',
        'min_stok' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get stock status based on current and minimum stock.
     */
    public function getStatusAttribute()
    {
        if ($this->attributes['stok'] <= $this->attributes['min_stok'] * 0.5) {
            return 'kritis';
        } elseif ($this->attributes['stok'] < $this->attributes['min_stok']) {
            return 'rendah';
        }
        return 'normal';
    }
}
