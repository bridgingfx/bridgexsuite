<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class Transaction extends Model
{
    use CamelCaseAttributes;

    protected $table = 'transactions';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'user_id', 'account_id', 'type', 'amount', 'currency',
        'status', 'method', 'reference', 'notes',
        'approved_by', 'rejection_reason', 'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tradingAccount()
    {
        return $this->belongsTo(TradingAccount::class, 'account_id');
    }
}
