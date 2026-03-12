<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_facultad')->nullable();
            $table->string('nombre')->nullable();

            $table->foreign('id_facultad')->references('id')->on('facultades')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programas');
    }
};
