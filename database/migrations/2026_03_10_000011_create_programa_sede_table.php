<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programa_sede', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_sede')->nullable();
            $table->unsignedBigInteger('id_programa')->nullable();

            $table->foreign('id_sede')->references('id')->on('sedes')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_programa')->references('id')->on('programas')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programa_sede');
    }
};
