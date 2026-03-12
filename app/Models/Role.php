<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    public $timestamps = false;

    protected $table = 'roles';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public function asignaciones()
    {
        return $this->hasMany(AsignacionUsuario::class, 'id_rol');
    }
}
