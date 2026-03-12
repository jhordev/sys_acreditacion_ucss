<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estandar extends Model
{
    protected $table = 'estandares';
    public $timestamps = false;

    protected $fillable = ['nombre', 'titulo', 'descripcion'];

    public function criterios(): HasMany
    {
        return $this->hasMany(Criterio::class, 'id_estandar');
    }
}
