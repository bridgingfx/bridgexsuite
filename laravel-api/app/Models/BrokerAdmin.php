<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class BrokerAdmin extends Model
{
    use CamelCaseAttributes;

    protected $table = 'broker_admins';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'broker_id', 'full_name', 'email', 'role', 'status', 'last_login',
    ];

    protected $casts = [
        'last_login' => 'datetime',
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

    public function broker()
    {
        return $this->belongsTo(Broker::class, 'broker_id');
    }
}
