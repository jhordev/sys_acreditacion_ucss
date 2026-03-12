<?php

namespace App\Http\Controllers;

use App\Models\TipoItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TipoItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('configuracion/tipo-item', [
            'tipoItems' => TipoItem::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:tipo_item,nombre',
        ]);

        TipoItem::create($request->only('nombre'));

        return back();
    }

    public function update(Request $request, TipoItem $tipoItem): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:tipo_item,nombre,' . $tipoItem->id,
        ]);

        $tipoItem->update($request->only('nombre'));

        return back();
    }

    public function destroy(TipoItem $tipoItem): RedirectResponse
    {
        $tipoItem->delete();

        return back();
    }
}
