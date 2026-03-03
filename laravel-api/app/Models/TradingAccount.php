<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class TradingAccount extends Model
{
    use CamelCaseAttributes;

    protected $table = 'trading_accounts';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'user_id', 'account_number', 'platform', 'type', 'leverage',
        'balance', 'equity', 'currency', 'status',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
            if (empty($model->account_number)) {
                $prefix = match($model->platform) {
                    'MT4' => 'MT4',
                    'cTrader' => 'CT1',
                    default => 'MT5',
                };
                $model->account_number = $prefix . str_pad(rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'account_id');
    }
}
