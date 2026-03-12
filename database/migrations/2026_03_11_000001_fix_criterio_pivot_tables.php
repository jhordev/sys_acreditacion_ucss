<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Recreate criterio_indicador with composite primary key
        Schema::dropIfExists('criterio_indicador');
        Schema::create('criterio_indicador', function (Blueprint $table) {
            $table->unsignedBigInteger('id_criterio');
            $table->unsignedBigInteger('id_indicador');

            $table->primary(['id_criterio', 'id_indicador']);
            $table->foreign('id_criterio')->references('id')->on('criterios')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('id_indicador')->references('id')->on('indicadores')->onUpdate('cascade')->onDelete('cascade');
        });

        // Recreate criterio_evidencia with composite primary key
        Schema::dropIfExists('criterio_evidencia');
        Schema::create('criterio_evidencia', function (Blueprint $table) {
            $table->unsignedBigInteger('id_criterio');
            $table->unsignedBigInteger('id_evidencia');

            $table->primary(['id_criterio', 'id_evidencia']);
            $table->foreign('id_criterio')->references('id')->on('criterios')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('id_evidencia')->references('id')->on('evidencias')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('criterio_indicador');
        Schema::create('criterio_indicador', function (Blueprint $table) {
            $table->unsignedBigInteger('id_criterio');
            $table->unsignedBigInteger('id_indicador')->nullable();
            $table->primary('id_criterio');
            $table->foreign('id_criterio')->references('id')->on('criterios')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_indicador')->references('id')->on('indicadores')->onUpdate('cascade')->onDelete('restrict');
        });

        Schema::dropIfExists('criterio_evidencia');
        Schema::create('criterio_evidencia', function (Blueprint $table) {
            $table->unsignedBigInteger('id_criterio');
            $table->unsignedBigInteger('id_evidencia')->nullable();
            $table->primary('id_criterio');
            $table->foreign('id_criterio')->references('id')->on('criterios')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_evidencia')->references('id')->on('evidencias')->onUpdate('cascade')->onDelete('restrict');
        });
    }
};
