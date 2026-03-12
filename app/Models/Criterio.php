<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Criterio extends Model
{
    protected $table = 'criterios';
    public $timestamps = false;

    protected $fillable = ['id_estandar', 'nombre', 'descripcion'];

    public function estandar(): BelongsTo
    {
        return $this->belongsTo(Estandar::class, 'id_estandar');
    }

    public function indicadores(): BelongsToMany
    {
        return $this->belongsToMany(Indicador::class, 'criterio_indicador', 'id_criterio', 'id_indicador');
    }

    public function evidencias(): BelongsToMany
    {
        return $this->belongsToMany(Evidencia::class, 'criterio_evidencia', 'id_criterio', 'id_evidencia');
    }
}
