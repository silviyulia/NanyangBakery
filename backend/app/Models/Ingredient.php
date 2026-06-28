<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ingredient extends Model
{
    use HasFactory;

    protected $table = 'ingredients';
    protected $primaryKey = 'ingredient_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'ingredient_name',
        'qty',
        'unit',
        'minimum_stock',
        'status',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
    ];

    /**
     * Get the recipes that use this ingredient.
     */
    public function recipes()
    {
        return $this->hasMany(Recipe::class, 'ingredient_id', 'ingredient_id');
    }

    /**
     * Get the stock entries for this ingredient.
     */
    public function stokBahan()
    {
        return $this->hasMany(StokBahan::class, 'ingredient_id', 'ingredient_id');
    }
}
