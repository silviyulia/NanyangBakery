<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Table extends Model
{
    use HasFactory;

    protected $table = 'tables';

    protected $primaryKey = 'table_id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'table_number',
        'status',
    ];

    protected $casts = [
        'table_id' => 'integer',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class, 'table_id', 'table_id');
    }
}