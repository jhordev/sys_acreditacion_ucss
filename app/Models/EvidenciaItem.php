<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvidenciaItem extends Model
{
    protected $table = 'evidencia_items';
    public $timestamps = false;

    protected $fillable = [
        'id_programa_sede',
        'id_indicador',
        'id_tipo_item',
        'nombre_item',
        'id_estado',
        'id_evidencia',
        'creado_por',
    ];

    public function programaSede(): BelongsTo
    {
        return $this->belongsTo(ProgramaSede::class, 'id_programa_sede');
    }

    public function indicador(): BelongsTo
    {
        return $this->belongsTo(Indicador::class, 'id_indicador');
    }

    public function tipoItem(): BelongsTo
    {
        return $this->belongsTo(TipoItem::class, 'id_tipo_item');
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(EstadoItem::class, 'id_estado');
    }

    public function evidencia(): BelongsTo
    {
        return $this->belongsTo(Evidencia::class, 'id_evidencia');
    }

    public function creadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por');
    }
}
