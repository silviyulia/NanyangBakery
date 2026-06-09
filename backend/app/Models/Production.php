<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Production extends Model
{
    use HasFactory;

    protected $table = 'productions';
    protected $primaryKey = 'production_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'quantity_produced',
        'production_date',
    ];

    protected $casts = [
        'production_date' => 'datetime',
    ];

    /**
     * Get the product for this production.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}
