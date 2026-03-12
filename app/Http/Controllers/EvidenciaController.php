<?php

namespace App\Http\Controllers;

use App\Models\Evidencia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EvidenciaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('acreditacion/evidencias', [
            'evidencias' => Evidencia::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'codigo' => 'required|string|max:50|unique:evidencias,codigo',
            'descripcion' => 'required|string|max:1000',
        ]);

        Evidencia::create($request->only('codigo', 'descripcion'));

        return back();
    }

    public function update(Request $request, Evidencia $evidencia): RedirectResponse
    {
        $request->validate([
            'codigo' => 'required|string|max:50|unique:evidencias,codigo,' . $evidencia->id,
            'descripcion' => 'required|string|max:1000',
        ]);

        $evidencia->update($request->only('codigo', 'descripcion'));

        return back();
    }

    public function destroy(Evidencia $evidencia): RedirectResponse
    {
        $evidencia->delete();

        return back();
    }
}
