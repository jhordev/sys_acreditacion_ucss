<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoItemSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('estado_item')->insert([
            ['nombre' => 'pendiente'],
            ['nombre' => 'revision'],
            ['nombre' => 'completo'],
        ]);
    }
}
