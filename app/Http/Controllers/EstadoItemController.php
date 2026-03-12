<?php

namespace App\Http\Controllers;

use App\Models\EstadoItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EstadoItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('configuracion/estado-item', [
            'estadoItems' => EstadoItem::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:estado_item,nombre',
        ]);

        EstadoItem::create($request->only('nombre'));

        return back();
    }

    public function update(Request $request, EstadoItem $estadoItem): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:estado_item,nombre,' . $estadoItem->id,
        ]);

        $estadoItem->update($request->only('nombre'));

        return back();
    }

    public function destroy(EstadoItem $estadoItem): RedirectResponse
    {
        $estadoItem->delete();

        return back();
    }
}
