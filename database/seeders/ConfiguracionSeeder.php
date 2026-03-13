<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConfiguracionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Configuracion::updateOrCreate(['clave' => 'sidebar_decanato_dashboard'], ['valor' => '1']);
        \App\Models\Configuracion::updateOrCreate(['clave' => 'sidebar_decanato_seguimiento'], ['valor' => '1']);
        \App\Models\Configuracion::updateOrCreate(['clave' => 'sidebar_decanato_indicadores'], ['valor' => '1']);
    }
}
