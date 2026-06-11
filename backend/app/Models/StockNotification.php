<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockNotification extends Model
{
    protected $primaryKey = 'notification_id';
    public $timestamps = true;

    protected $fillable = [
        'ingredient_id',
        'minimum_threshold',
        'status',
        'last_notified_at',
    ];

    protected $casts = [
        'minimum_threshold' => 'decimal:2',
        'last_notified_at' => 'datetime',
    ];

    /**
     * Get the ingredient for this notification.
     */
    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class, 'ingredient_id', 'ingredient_id');
    }

    /**
     * Check if notification should be triggered.
     */
    public function shouldTrigger(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        $currentStock = $this->ingredient->qty ?? 0;
        return $currentStock <= $this->minimum_threshold;
    }
}
