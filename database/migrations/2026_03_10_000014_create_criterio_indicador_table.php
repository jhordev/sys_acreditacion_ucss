<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('criterio_indicador', function (Blueprint $table) {
            $table->unsignedBigInteger('id_criterio');
            $table->unsignedBigInteger('id_indicador')->nullable();

            $table->primary('id_criterio');
            $table->foreign('id_criterio')->references('id')->on('criterios')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_indicador')->references('id')->on('indicadores')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('criterio_indicador');
    }
};
