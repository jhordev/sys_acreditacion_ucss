<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('evidencia_resultados', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_evidencia');
            $table->unsignedBigInteger('id_programa_sede');
            $table->boolean('finalizado')->default(false);
            $table->unsignedBigInteger('id_user')->nullable();
            $table->timestamps();

            $table->foreign('id_evidencia')->references('id')->on('evidencias')->onDelete('cascade');
            $table->foreign('id_programa_sede')->references('id')->on('programa_sede')->onDelete('cascade');
            $table->foreign('id_user')->references('id')->on('users')->onDelete('set null');

            $table->unique(['id_evidencia', 'id_programa_sede'], 'unique_evidencia_programa_sede_resultado');
        });

        Schema::table('indicador_resultados', function (Blueprint $table) {
            $table->boolean('finalizado')->default(false)->after('valor_real');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('indicador_resultados', function (Blueprint $table) {
            $table->dropColumn('finalizado');
        });
        Schema::dropIfExists('evidencia_resultados');
    }
};
