<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'products';

    /**
     * The primary key associated with the model.
     *
     * @var string
     */
    protected $primaryKey = 'product_id';

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The type of the auto-incrementing ID.
     *
     * @var string
     */
protected $casts = [
    'product_id' => 'integer',
];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $fillable = [
        'category_id',
        'name',
        'price',
        'status',
        'image'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */


    public $timestamps = false;

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    /**
     * Get the productions for this product.
     */
    public function productions(): HasMany
    {
        return $this->hasMany(Production::class, 'product_id', 'product_id');
    }

    /**
     * Get the recipes for this product.
     */
    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class, 'product_id', 'product_id');
    }

    /**
     * Get the inventory for this product.
     */
    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class, 'product_id', 'product_id');
    }

    /**
     * Get the order items for this product.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'product_id', 'product_id');
    }

    /**
     * Check if product is available for sale.
     */
    public function isAvailable(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        $inventory = $this->inventory;
        if ($inventory && ($inventory->stock_quantity <= 0 || $inventory->status === 'out_of_stock')) {
            return false;
        }

        return true;
    }

    /**
     * Get available stock quantity.
     */
    public function getAvailableStock(): int
    {
        return $this->inventory?->stock_quantity ?? 0;
    }
}
