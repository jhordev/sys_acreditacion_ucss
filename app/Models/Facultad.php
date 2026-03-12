<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facultad extends Model
{
    public $timestamps = false;

    protected $table = 'facultades';

    protected $fillable = [
        'nombre',
    ];

    public function programas(): HasMany
    {
        return $this->hasMany(Programa::class, 'id_facultad');
    }
}
