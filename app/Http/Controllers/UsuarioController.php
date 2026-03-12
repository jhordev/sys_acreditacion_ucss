<?php

namespace App\Http\Controllers;

use App\Models\AsignacionUsuario;
use App\Models\Facultad;
use App\Models\ProgramaSede;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('usuarios/index', [
            'usuarios' => User::with(
                'asignaciones.rol',
                'asignaciones.facultad',
                'asignaciones.programaSede.programa',
                'asignaciones.programaSede.sede'
            )->get(),
            'roles' => Role::all(),
            'facultades' => Facultad::all(),
            'programaSedes' => ProgramaSede::with('programa', 'sede')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'estado' => 'required|string|in:activo,inactivo',
            'asignaciones' => 'required|array|min:1',
            'asignaciones.*.id_rol' => 'required|exists:roles,id',
            'asignaciones.*.id_facultad' => 'nullable|exists:facultades,id',
            'asignaciones.*.id_programa_sede' => 'nullable|exists:programa_sede,id',
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'estado' => $request->estado,
            ]);

            foreach ($request->asignaciones as $asignacion) {
                AsignacionUsuario::create([
                    'id_usuario' => $user->id,
                    'id_rol' => $asignacion['id_rol'],
                    'id_facultad' => $asignacion['id_facultad'] ?? null,
                    'id_programa_sede' => $asignacion['id_programa_sede'] ?? null,
                ]);
            }
        });

        return back();
    }

    public function update(Request $request, User $usuario): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($usuario->id)],
            'password' => 'nullable|string|min:6',
            'estado' => 'required|string|in:activo,inactivo',
            'asignaciones' => 'required|array|min:1',
            'asignaciones.*.id_rol' => 'required|exists:roles,id',
            'asignaciones.*.id_facultad' => 'nullable|exists:facultades,id',
            'asignaciones.*.id_programa_sede' => 'nullable|exists:programa_sede,id',
        ]);

        DB::transaction(function () use ($request, $usuario) {
            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'estado' => $request->estado,
            ];

            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            $usuario->update($data);

            // Reemplazar todas las asignaciones
            $usuario->asignaciones()->delete();

            foreach ($request->asignaciones as $asignacion) {
                AsignacionUsuario::create([
                    'id_usuario' => $usuario->id,
                    'id_rol' => $asignacion['id_rol'],
                    'id_facultad' => $asignacion['id_facultad'] ?? null,
                    'id_programa_sede' => $asignacion['id_programa_sede'] ?? null,
                ]);
            }
        });

        return back();
    }

    public function destroy(User $usuario): RedirectResponse
    {
        DB::transaction(function () use ($usuario) {
            $usuario->asignaciones()->delete();
            $usuario->delete();
        });

        return back();
    }
}
