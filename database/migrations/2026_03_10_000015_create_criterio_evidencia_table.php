<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('criterio_evidencia', function (Blueprint $table) {
            $table->unsignedBigInteger('id_criterio');
            $table->unsignedBigInteger('id_evidencia')->nullable();

            $table->primary('id_criterio');
            $table->foreign('id_criterio')->references('id')->on('criterios')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_evidencia')->references('id')->on('evidencias')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('criterio_evidencia');
    }
};
