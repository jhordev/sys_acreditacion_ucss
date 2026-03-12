<?php

namespace App\Http\Controllers;

use App\Models\EstadoItem;
use App\Models\Evidencia;
use App\Models\EvidenciaItem;
use App\Models\Indicador;
use App\Models\ProgramaSede;
use App\Models\TipoItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EvidenciaItemController extends Controller
{
    /**
     * Devuelve los programa-sede y el ID seleccionado según el rol del usuario.
     * - Admin: ve todos, puede elegir con query param.
     * - Coordinador: ve solo los asignados, se auto-selecciona si tiene uno solo.
     */
    private function resolveContext(Request $request): array
    {
        $user = $request->user()->load('asignaciones.rol');
        $userRoles = $user->asignaciones->pluck('rol.nombre')->unique()->map(fn($r) => strtolower($r))->all();
        $isAdmin = in_array('admin', $userRoles);

        if ($isAdmin) {
            $programaSedes = ProgramaSede::with(['programa', 'sede'])->get();
            $selectedId = $request->query('programa_sede');
        } else {
            $assignedIds = $user->asignaciones
                ->filter(fn($a) => strtolower($a->rol->nombre ?? '') === 'coordinador')
                ->pluck('id_programa_sede')
                ->filter();

            $programaSedes = ProgramaSede::with(['programa', 'sede'])
                ->whereIn('id', $assignedIds)
                ->get();

            // Auto-seleccionar: si viene en query usar ese (validando que sea suyo),
            // si no, usar el primero asignado
            $queryId = $request->query('programa_sede');
            if ($queryId && $assignedIds->contains((int) $queryId)) {
                $selectedId = $queryId;
            } else {
                $selectedId = $programaSedes->first()?->id;
            }
        }

        return [
            'programaSedes' => $programaSedes,
            'selectedId' => $selectedId ? (string) $selectedId : null,
            'isAdmin' => $isAdmin,
        ];
    }

    public function indexEvidencias(Request $request): Response
    {
        $ctx = $this->resolveContext($request);
        $evidencias = [];
        $items = [];

        if ($ctx['selectedId']) {
            $evidencias = Evidencia::orderBy('codigo')->get();
            $items = EvidenciaItem::with(['tipoItem', 'estado'])
                ->where('id_programa_sede', $ctx['selectedId'])
                ->whereNotNull('id_evidencia')
                ->get();
        }

        return Inertia::render('coordinador/items-evidencias', [
            'programaSedes' => $ctx['programaSedes'],
            'selectedProgramaSede' => $ctx['selectedId'],
            'isAdmin' => $ctx['isAdmin'],
            'evidencias' => $evidencias,
            'items' => $items,
            'tipoItems' => TipoItem::all(),
            'estadoItems' => EstadoItem::all(),
        ]);
    }

    public function indexIndicadores(Request $request): Response
    {
        $ctx = $this->resolveContext($request);
        $indicadores = [];
        $items = [];

        if ($ctx['selectedId']) {
            $indicadores = Indicador::orderBy('codigo')->get();
            $items = EvidenciaItem::with(['tipoItem', 'estado'])
                ->where('id_programa_sede', $ctx['selectedId'])
                ->whereNotNull('id_indicador')
                ->get();
        }

        return Inertia::render('coordinador/items-indicadores', [
            'programaSedes' => $ctx['programaSedes'],
            'selectedProgramaSede' => $ctx['selectedId'],
            'isAdmin' => $ctx['isAdmin'],
            'indicadores' => $indicadores,
            'items' => $items,
            'tipoItems' => TipoItem::all(),
            'estadoItems' => EstadoItem::all(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'id_programa_sede' => 'required|exists:programa_sede,id',
            'nombre_item' => 'required|string|max:500',
            'id_tipo_item' => 'required|exists:tipo_item,id',
            'id_evidencia' => 'nullable|exists:evidencias,id',
            'id_indicador' => 'nullable|exists:indicadores,id',
        ]);

        if (! $request->id_evidencia && ! $request->id_indicador) {
            return back()->withErrors(['id_evidencia' => 'Debe asociar a una evidencia o un indicador.']);
        }

        $estadoPendiente = EstadoItem::whereRaw('LOWER(nombre) = ?', ['pendiente'])->first();

        EvidenciaItem::create([
            'id_programa_sede' => $request->id_programa_sede,
            'nombre_item' => $request->nombre_item,
            'id_tipo_item' => $request->id_tipo_item,
            'id_evidencia' => $request->id_evidencia,
            'id_indicador' => $request->id_indicador,
            'id_estado' => $estadoPendiente?->id,
            'creado_por' => $request->user()->id,
        ]);

        return back();
    }

    public function update(Request $request, EvidenciaItem $evidenciaItem): RedirectResponse
    {
        $request->validate([
            'nombre_item' => 'required|string|max:500',
            'id_tipo_item' => 'required|exists:tipo_item,id',
            'id_estado' => 'required|exists:estado_item,id',
        ]);

        $evidenciaItem->update($request->only('nombre_item', 'id_tipo_item', 'id_estado'));

        return back();
    }

    public function destroy(EvidenciaItem $evidenciaItem): RedirectResponse
    {
        $evidenciaItem->delete();

        return back();
    }
}
