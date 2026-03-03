<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use CamelCaseAttributes;

    protected $table = 'users';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'username', 'password', 'full_name', 'email', 'phone',
        'role', 'status', 'kyc_status', 'country', 'avatar',
    ];

    protected $hidden = ['password'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function tradingAccounts()
    {
        return $this->hasMany(TradingAccount::class, 'user_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'user_id');
    }

    public function kycDocuments()
    {
        return $this->hasMany(KycDocument::class, 'user_id');
    }

    public function supportTickets()
    {
        return $this->hasMany(SupportTicket::class, 'user_id');
    }

    public function commissions()
    {
        return $this->hasMany(Commission::class, 'user_id');
    }
}
