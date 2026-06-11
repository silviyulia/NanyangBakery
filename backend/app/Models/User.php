<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $primaryKey = 'user_id';
    public $incrementing = true;
    protected $keyType = 'int';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get all orders created by this waitres.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'waitres_id', 'user_id');
    }

    /**
     * Get all transactions processed by this kasir.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'kasir_id', 'user_id');
    }

    /**
     * Get all cashier sessions for this kasir.
     */
    public function cashierSessions(): HasMany
    {
        return $this->hasMany(CashierSession::class, 'kasir_id', 'user_id');
    }

    /**
     * Get active cashier session for this kasir.
     */
    public function activeCashierSession()
    {
        return $this->hasOne(CashierSession::class, 'kasir_id', 'user_id')
            ->where('status', 'active');
    }

    /**
     * Check if user is waitres.
     */
    public function isWaitres(): bool
    {
        return $this->role === 'waitres';
    }

    /**
     * Check if user is kasir.
     */
    public function isKasir(): bool
    {
        return $this->role === 'kasir';
    }

    /**
     * Check if user is owner.
     */
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }
}
