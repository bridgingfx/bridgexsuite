<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class InvestmentPlan extends Model
{
    use CamelCaseAttributes;

    protected $table = 'investment_plans';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'name', 'description', 'min_investment', 'max_investment',
        'expected_return', 'duration_days', 'risk_level', 'category', 'status',
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
