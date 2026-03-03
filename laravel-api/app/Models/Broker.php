<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class Broker extends Model
{
    use CamelCaseAttributes;

    protected $table = 'brokers';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'name', 'slug', 'email', 'phone', 'company_name',
        'country', 'status', 'max_clients', 'max_accounts',
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

    public function admins()
    {
        return $this->hasMany(BrokerAdmin::class, 'broker_id');
    }

    public function subscriptions()
    {
        return $this->hasMany(BrokerSubscription::class, 'broker_id');
    }

    public function branding()
    {
        return $this->hasOne(BrokerBranding::class, 'broker_id');
    }
}
