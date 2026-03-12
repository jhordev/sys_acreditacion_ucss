<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Programa extends Model
{
    public $timestamps = false;

    protected $table = 'programas';

    protected $fillable = [
        'nombre',
        'id_facultad',
    ];

    public function facultad(): BelongsTo
    {
        return $this->belongsTo(Facultad::class, 'id_facultad');
    }

    public function sedes(): BelongsToMany
    {
        return $this->belongsToMany(Sede::class, 'programa_sede', 'id_programa', 'id_sede');
    }
}
