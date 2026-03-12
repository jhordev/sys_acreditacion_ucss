<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('evidencia_items', function (Blueprint $table) {
            $table->dropForeign(['id_estado_item']);
            $table->dropColumn('id_estado_item');
        });
    }

    public function down(): void
    {
        Schema::table('evidencia_items', function (Blueprint $table) {
            $table->unsignedBigInteger('id_estado_item')->nullable();
            $table->foreign('id_estado_item')->references('id')->on('estado_item')->onUpdate('cascade')->onDelete('restrict');
        });
    }
};
