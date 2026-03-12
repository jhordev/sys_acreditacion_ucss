<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoItem extends Model
{
    public $timestamps = false;

    protected $table = 'tipo_item';

    protected $fillable = [
        'nombre',
    ];
}
