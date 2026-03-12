<?php

namespace App\Http\Controllers;

use App\Models\Programa;
use App\Models\ProgramaSede;
use App\Models\Sede;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramaSedeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('academico/programa-sede', [
            'asignaciones' => ProgramaSede::with(['programa.facultad', 'sede'])->get(),
            'programas' => Programa::with('facultad')->get(),
            'sedes' => Sede::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_programa' => 'required|exists:programas,id',
            'id_sede' => 'required|exists:sedes,id',
        ]);

        $exists = ProgramaSede::where('id_programa', $request->id_programa)
            ->where('id_sede', $request->id_sede)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'id_programa' => 'Esta asignación ya existe.',
            ]);
        }

        ProgramaSede::create($request->only('id_programa', 'id_sede'));

        return back();
    }

    public function destroy(ProgramaSede $programaSede): RedirectResponse
    {
        $programaSede->delete();

        return back();
    }
}
