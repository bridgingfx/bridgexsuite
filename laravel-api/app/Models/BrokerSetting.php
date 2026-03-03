<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class BrokerSetting extends Model
{
    use CamelCaseAttributes;

    protected $table = 'broker_settings';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = 'updated_at';
    const CREATED_AT = null;

    protected $fillable = [
        'setting_key', 'setting_value', 'category', 'description',
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
