<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Sede extends Model
{
    public $timestamps = false;

    protected $table = 'sedes';

    protected $fillable = [
        'nombre',
        'ciudad',
    ];

    public function programas(): BelongsToMany
    {
        return $this->belongsToMany(Programa::class, 'programa_sede', 'id_sede', 'id_programa');
    }
}
