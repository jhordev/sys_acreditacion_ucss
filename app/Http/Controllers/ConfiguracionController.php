<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/admin-settings', [
            'configuraciones' => Configuracion::all(),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'clave' => 'required|string|exists:configuraciones,clave',
            'valor' => 'required',
        ]);

        Configuracion::where('clave', $request->clave)->update([
            'valor' => $request->valor,
        ]);

        return back()->with('success', 'Configuración actualizada');
    }
}
