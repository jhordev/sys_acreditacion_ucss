<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('asignaciones_usuario', function (Blueprint $table) {
            $table->unsignedBigInteger('id_facultad')->nullable()->after('id_rol');

            $table->foreign('id_facultad')->references('id')->on('facultades')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('asignaciones_usuario', function (Blueprint $table) {
            $table->dropForeign(['id_facultad']);
            $table->dropColumn('id_facultad');
        });
    }
};
