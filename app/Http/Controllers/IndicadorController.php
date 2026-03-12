<?php

namespace App\Http\Controllers;

use App\Models\Indicador;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndicadorController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('acreditacion/indicadores', [
            'indicadores' => Indicador::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'codigo' => 'required|string|max:50|unique:indicadores,codigo',
            'nombre' => 'required|string|max:255',
            'tipo_dato' => 'nullable|string|max:100',
            'objetivo' => 'nullable|string|max:500',
            'valor_referencial' => 'nullable|numeric|min:0',
        ]);

        Indicador::create($request->only('codigo', 'nombre', 'tipo_dato', 'objetivo', 'valor_referencial'));

        return back();
    }

    public function update(Request $request, Indicador $indicador): RedirectResponse
    {
        $request->validate([
            'codigo' => 'required|string|max:50|unique:indicadores,codigo,' . $indicador->id,
            'nombre' => 'required|string|max:255',
            'tipo_dato' => 'nullable|string|max:100',
            'objetivo' => 'nullable|string|max:500',
            'valor_referencial' => 'nullable|numeric|min:0',
        ]);

        $indicador->update($request->only('codigo', 'nombre', 'tipo_dato', 'objetivo', 'valor_referencial'));

        return back();
    }

    public function destroy(Indicador $indicador): RedirectResponse
    {
        $indicador->delete();

        return back();
    }
}
