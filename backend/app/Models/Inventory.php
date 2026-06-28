<?php

namespace App\Models;
use App\Models\Ingredient;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory';
    protected $primaryKey = 'inventory_id';
    public $incrementing = true;
    protected $keyType = 'bigint';

    protected $fillable = [
        'product_id',
        'stock_quantity',
        'minimum_threshold',
        'maximum_threshold',
        'status',
    ];

    protected $casts = [
        'stock_quantity' => 'integer',
        'minimum_threshold' => 'integer',
        'maximum_threshold' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the product for this inventory.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    /**
     * Check if stock is low.
     */
    public function isLowStock(): bool
    {
        return $this->stock_quantity <= $this->minimum_threshold;
    }

    /**
     * Check if stock is out.
     */
    public function isOutOfStock(): bool
    {
        return $this->stock_quantity <= 0;
    }

    /**
     * Update stock quantity and status.
     */
    public function updateStock(int $quantity): void
    {
        $this->stock_quantity += $quantity;
        
        if ($this->stock_quantity <= 0) {
            $this->status = 'out_of_stock';
        } elseif ($this->stock_quantity <= $this->minimum_threshold) {
            $this->status = 'low_stock';
        } else {
            $this->status = 'available';
        }
        
        $this->save();
    }
}
