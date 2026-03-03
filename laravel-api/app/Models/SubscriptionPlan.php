<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class SubscriptionPlan extends Model
{
    use CamelCaseAttributes;

    protected $table = 'subscription_plans';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'name', 'price', 'billing_cycle', 'max_clients',
        'max_accounts', 'max_ibs', 'features', 'status',
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
