<?php

namespace App\Http\Controllers;

use App\Models\Criterio;
use App\Models\Estandar;
use App\Models\Evidencia;
use App\Models\Indicador;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CriterioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('acreditacion/criterios', [
            'criterios' => Criterio::with(['estandar', 'indicadores', 'evidencias'])->get(),
            'estandares' => Estandar::all(),
            'indicadores' => Indicador::all(),
            'evidencias' => Evidencia::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'id_estandar' => 'required|exists:estandares,id',
            'indicadores' => 'nullable|array',
            'indicadores.*' => 'exists:indicadores,id',
            'evidencias' => 'nullable|array',
            'evidencias.*' => 'exists:evidencias,id',
        ]);

        DB::transaction(function () use ($request) {
            $criterio = Criterio::create($request->only('nombre', 'descripcion', 'id_estandar'));

            if ($request->has('indicadores')) {
                $criterio->indicadores()->sync($request->indicadores);
            }

            if ($request->has('evidencias')) {
                $criterio->evidencias()->sync($request->evidencias);
            }
        });

        return back();
    }

    public function update(Request $request, Criterio $criterio): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'id_estandar' => 'required|exists:estandares,id',
            'indicadores' => 'nullable|array',
            'indicadores.*' => 'exists:indicadores,id',
            'evidencias' => 'nullable|array',
            'evidencias.*' => 'exists:evidencias,id',
        ]);

        DB::transaction(function () use ($request, $criterio) {
            $criterio->update($request->only('nombre', 'descripcion', 'id_estandar'));
            $criterio->indicadores()->sync($request->indicadores ?? []);
            $criterio->evidencias()->sync($request->evidencias ?? []);
        });

        return back();
    }

    public function destroy(Criterio $criterio): RedirectResponse
    {
        $criterio->indicadores()->detach();
        $criterio->evidencias()->detach();
        $criterio->delete();

        return back();
    }
}
