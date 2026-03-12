<?php

namespace App\Http\Controllers;

use App\Models\Facultad;
use App\Models\Programa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('academico/programas', [
            'programas' => Programa::with('facultad')->get(),
            'facultades' => Facultad::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'id_facultad' => 'required|exists:facultades,id',
        ]);

        Programa::create($request->only('nombre', 'id_facultad'));

        return back();
    }

    public function update(Request $request, Programa $programa): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'id_facultad' => 'required|exists:facultades,id',
        ]);

        $programa->update($request->only('nombre', 'id_facultad'));

        return back();
    }

    public function destroy(Programa $programa): RedirectResponse
    {
        $programa->delete();

        return back();
    }
}
