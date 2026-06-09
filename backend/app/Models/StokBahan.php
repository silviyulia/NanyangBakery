<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StokBahan extends Model
{
    use HasFactory;

    protected $table = 'stok_bahan';
    protected $primaryKey = 'stok_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'ingredient_id',
        'quantity',
        'reference_type',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
    ];

    /**
     * Get the ingredient for this stock.
     */
    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class, 'ingredient_id', 'ingredient_id');
    }
}
