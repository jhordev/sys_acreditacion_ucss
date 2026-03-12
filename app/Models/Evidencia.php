<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Evidencia extends Model
{
    protected $table = 'evidencias';
    public $timestamps = false;

    protected $fillable = ['codigo', 'descripcion'];

    public function criterios(): BelongsToMany
    {
        return $this->belongsToMany(Criterio::class, 'criterio_evidencia', 'id_evidencia', 'id_criterio');
    }

    public function items(): HasMany
    {
        return $this->hasMany(EvidenciaItem::class, 'id_evidencia');
    }
}
