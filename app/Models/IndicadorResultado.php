<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndicadorResultado extends Model
{
    protected $table = 'indicador_resultados';

    protected $fillable = [
        'id_indicador',
        'id_programa_sede',
        'valor_real',
        'id_user',
    ];

    public function indicador(): BelongsTo
    {
        return $this->belongsTo(Indicador::class, 'id_indicador');
    }

    public function programaSede(): BelongsTo
    {
        return $this->belongsTo(ProgramaSede::class, 'id_programa_sede');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
