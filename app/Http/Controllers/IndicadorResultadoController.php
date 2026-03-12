<?php

namespace App\Http\Controllers;

use App\Models\IndicadorResultado;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class IndicadorResultadoController extends Controller
{
    /**
     * Guarda o actualiza un resultado de indicador.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_indicador' => 'required|exists:indicadores,id',
            'id_programa_sede' => 'required|exists:programa_sede,id',
            'valor_real' => 'nullable|numeric|min:0|max:9999999999.99',
        ]);

        IndicadorResultado::updateOrCreate(
            [
                'id_indicador' => $request->id_indicador,
                'id_programa_sede' => $request->id_programa_sede,
            ],
            [
                'valor_real' => $request->valor_real,
                'id_user' => $request->user()->id,
            ]
        );

        return back();
    }
}
