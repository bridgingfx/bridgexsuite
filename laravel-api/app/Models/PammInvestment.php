<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class PammInvestment extends Model
{
    use CamelCaseAttributes;

    protected $table = 'pamm_investments';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'investor_id', 'manager_id', 'amount', 'current_value',
        'profit', 'share_percentage', 'status',
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

    public function investor()
    {
        return $this->belongsTo(User::class, 'investor_id');
    }

    public function manager()
    {
        return $this->belongsTo(PammManager::class, 'manager_id');
    }
}
