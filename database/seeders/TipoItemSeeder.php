<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoItemSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tipo_item')->insert([
            ['nombre' => 'excel'],
            ['nombre' => 'informe'],
            ['nombre' => 'evidencia'],
        ]);
    }
}
