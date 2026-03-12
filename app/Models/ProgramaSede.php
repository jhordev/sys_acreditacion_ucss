<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgramaSede extends Model
{
    public $timestamps = false;

    protected $table = 'programa_sede';

    protected $fillable = [
        'id_sede',
        'id_programa',
    ];

    public function sede(): BelongsTo
    {
        return $this->belongsTo(Sede::class, 'id_sede');
    }

    public function programa(): BelongsTo
    {
        return $this->belongsTo(Programa::class, 'id_programa');
    }

    public function items(): HasMany
    {
        return $this->hasMany(EvidenciaItem::class, 'id_programa_sede');
    }
}
