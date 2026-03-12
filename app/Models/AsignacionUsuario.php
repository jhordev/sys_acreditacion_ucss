<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AsignacionUsuario extends Model
{
    public $timestamps = false;

    protected $table = 'asignaciones_usuario';

    protected $fillable = [
        'id_usuario',
        'id_rol',
        'id_facultad',
        'id_programa_sede',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_usuario');
    }

    public function rol(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'id_rol');
    }

    public function facultad(): BelongsTo
    {
        return $this->belongsTo(Facultad::class, 'id_facultad');
    }

    public function programaSede(): BelongsTo
    {
        return $this->belongsTo(ProgramaSede::class, 'id_programa_sede');
    }
}
