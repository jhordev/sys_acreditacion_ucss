<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('indicadores', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('codigo')->nullable();
            $table->string('nombre')->nullable();
            $table->string('tipo_dato')->nullable();
            $table->string('objetivo')->nullable();
            $table->decimal('valor_referencial', 15, 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('indicadores');
    }
};
