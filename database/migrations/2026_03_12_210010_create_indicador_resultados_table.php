<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('indicador_resultados', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_indicador');
            $table->unsignedBigInteger('id_programa_sede');
            $table->decimal('valor_real', 15, 2)->nullable();
            $table->unsignedBigInteger('id_user')->nullable();
            $table->timestamps();

            $table->foreign('id_indicador')->references('id')->on('indicadores')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('id_programa_sede')->references('id')->on('programa_sede')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('id_user')->references('id')->on('users')->onUpdate('cascade')->onDelete('set null');

            $table->unique(['id_indicador', 'id_programa_sede'], 'unique_indicador_programa_sede_resultado');
        });

        // Eliminar la columna errónea de la otra tabla
        if (Schema::hasColumn('evidencia_items', 'valor_real')) {
            Schema::table('evidencia_items', function (Blueprint $table) {
                $table->dropColumn('valor_real');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('indicador_resultados');
        
        if (!Schema::hasColumn('evidencia_items', 'valor_real')) {
            Schema::table('evidencia_items', function (Blueprint $table) {
                $table->decimal('valor_real', 15, 2)->nullable();
            });
        }
    }
};
