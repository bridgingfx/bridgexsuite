<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\CamelCaseAttributes;
use Illuminate\Support\Str;

class CopyRelationship extends Model
{
    use CamelCaseAttributes;

    protected $table = 'copy_relationships';
    protected $keyType = 'string';
    public $incrementing = false;
    const UPDATED_AT = null;
    const CREATED_AT = 'created_at';

    protected $fillable = [
        'follower_id', 'provider_id', 'allocated_amount',
        'current_pnl', 'total_copied_trades', 'status',
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

    public function follower()
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    public function provider()
    {
        return $this->belongsTo(SignalProvider::class, 'provider_id');
    }
}
