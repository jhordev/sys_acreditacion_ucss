<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstadoItem extends Model
{
    public $timestamps = false;

    protected $table = 'estado_item';

    protected $fillable = [
        'nombre',
    ];
}
