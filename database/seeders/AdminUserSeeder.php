<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $userId = DB::table('users')->insertGetId([
            'name'       => 'Administrador',
            'email'      => 'admin@gmail.com',
            'password'   => Hash::make('admin123'),
            'estado'     => 'activo',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $rolId = DB::table('roles')->where('nombre', 'admin')->value('id');

        DB::table('asignaciones_usuario')->insert([
            'id_usuario'       => $userId,
            'id_rol'           => $rolId,
            'id_programa_sede' => null,
        ]);
    }
}
