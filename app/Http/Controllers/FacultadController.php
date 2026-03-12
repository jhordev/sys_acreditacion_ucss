<?php

namespace App\Http\Controllers;

use App\Models\Facultad;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacultadController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('academico/facultades', [
            'facultades' => Facultad::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:facultades,nombre',
        ]);

        Facultad::create($request->only('nombre'));

        return back();
    }

    public function update(Request $request, Facultad $facultad): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:facultades,nombre,' . $facultad->id,
        ]);

        $facultad->update($request->only('nombre'));

        return back();
    }

    public function destroy(Facultad $facultad): RedirectResponse
    {
        $facultad->delete();

        return back();
    }
}
