<?php

namespace App\Http\Controllers;

use App\Models\Sede;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SedeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('academico/sedes', [
            'sedes' => Sede::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:sedes,nombre',
            'ciudad' => 'required|string|max:255',
        ]);

        Sede::create($request->only('nombre', 'ciudad'));

        return back();
    }

    public function update(Request $request, Sede $sede): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:sedes,nombre,' . $sede->id,
            'ciudad' => 'required|string|max:255',
        ]);

        $sede->update($request->only('nombre', 'ciudad'));

        return back();
    }

    public function destroy(Sede $sede): RedirectResponse
    {
        $sede->delete();

        return back();
    }
}
