<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class PammManager extends Model
{
    use CamelCaseAttributes;

    protected $table = 'pamm_managers';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'user_id', 'display_name', 'description', 'total_aum',
        'total_return', 'monthly_return', 'performance_fee',
        'management_fee', 'min_investment', 'investors',
        'risk_level', 'strategy', 'status',
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
