<?php
 
 namespace App\Models;
 
 use Illuminate\Database\Eloquent\Model;
 use Illuminate\Database\Eloquent\Relations\BelongsTo;
 
 class EvidenciaResultado extends Model
 {
     protected $table = 'evidencia_resultados';
 
     protected $fillable = [
         'id_evidencia',
         'id_programa_sede',
         'finalizado',
         'id_user',
     ];
 
     public function evidencia(): BelongsTo
     {
         return $this->belongsTo(Evidencia::class, 'id_evidencia');
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
