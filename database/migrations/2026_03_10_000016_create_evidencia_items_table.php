<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evidencia_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_programa_sede')->nullable();
            $table->unsignedBigInteger('id_indicador')->nullable();
            $table->unsignedBigInteger('id_tipo_item')->nullable();
            $table->string('nombre_item')->nullable();
            $table->unsignedBigInteger('id_estado')->nullable();
            $table->unsignedBigInteger('id_estado_item')->nullable();
            $table->unsignedBigInteger('id_evidencia')->nullable();
            $table->unsignedBigInteger('creado_por')->nullable();

            $table->foreign('id_programa_sede')->references('id')->on('programa_sede')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_indicador')->references('id')->on('indicadores')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_tipo_item')->references('id')->on('tipo_item')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_estado')->references('id')->on('estado_item')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_estado_item')->references('id')->on('estado_item')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_evidencia')->references('id')->on('evidencias')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('creado_por')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evidencia_items');
    }
};
