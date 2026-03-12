<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Indicador extends Model
{
    protected $table = 'indicadores';
    public $timestamps = false;

    protected $fillable = ['codigo', 'nombre', 'tipo_dato', 'objetivo', 'valor_referencial'];

    public function criterios(): BelongsToMany
    {
        return $this->belongsToMany(Criterio::class, 'criterio_indicador', 'id_indicador', 'id_criterio');
    }

    public function items(): HasMany
    {
        return $this->hasMany(EvidenciaItem::class, 'id_indicador');
    }
}
