<?php

namespace App\Http\Controllers;

use App\Models\Estandar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EstandarController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('acreditacion/estandares', [
            'estandares' => Estandar::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'titulo' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        Estandar::create($request->only('nombre', 'titulo', 'descripcion'));

        return back();
    }

    public function update(Request $request, Estandar $estandar): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'titulo' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        $estandar->update($request->only('nombre', 'titulo', 'descripcion'));

        return back();
    }

    public function destroy(Estandar $estandar): RedirectResponse
    {
        $estandar->delete();

        return back();
    }
}
