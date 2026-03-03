<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class PropChallenge extends Model
{
    use CamelCaseAttributes;

    protected $table = 'prop_challenges';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'name', 'account_size', 'price', 'profit_target',
        'max_daily_drawdown', 'max_total_drawdown', 'min_trading_days',
        'max_trading_days', 'profit_split', 'phases', 'leverage', 'status',
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
}
