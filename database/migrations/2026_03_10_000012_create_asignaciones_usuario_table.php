<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asignaciones_usuario', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_usuario')->nullable();
            $table->unsignedBigInteger('id_rol')->nullable();
            $table->unsignedBigInteger('id_programa_sede')->nullable();

            $table->foreign('id_usuario')->references('id')->on('users')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_rol')->references('id')->on('roles')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_programa_sede')->references('id')->on('programa_sede')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asignaciones_usuario');
    }
};
