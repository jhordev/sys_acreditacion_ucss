<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('criterios', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('id_estandar')->nullable();
            $table->string('nombre')->nullable();
            $table->string('descripcion')->nullable();

            $table->foreign('id_estandar')->references('id')->on('estandares')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('criterios');
    }
};
