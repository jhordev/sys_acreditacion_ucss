<?php

namespace App\Http\Controllers;

use App\Models\Estandar;
use App\Models\ProgramaSede;
use App\Models\EvidenciaItem;
use App\Models\Indicador;
use App\Models\User;
use App\Models\Facultad;
use App\Models\Sede;
use App\Models\Programa;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('asignaciones.rol', 'asignaciones.facultad');
        $userRoles = $user->asignaciones->pluck('rol.nombre')->unique()->map(fn($r) => strtolower($r))->all();

        // Admin Dashboard
        if (in_array('admin', $userRoles)) {
            return $this->adminDashboard($request);
        }

        // Si es decanato, preparamos datos analíticos
        if (in_array('decanato', $userRoles)) {
            return $this->decanatoDashboard($request, $user);
        }

        // Dashboard por defecto para otros roles
        return Inertia::render('dashboard');
    }

    private function adminDashboard(Request $request): Response
    {
        // Estadísticas de Usuarios por Rol
        $roles = Role::withCount('asignaciones')->get();
        $userRoleStats = $roles->map(fn($rol) => [
            'name' => ucfirst($rol->nombre),
            'value' => $rol->asignaciones_count,
            'fill' => match(strtolower($rol->nombre)) {
                'admin' => '#4f46e5',
                'decanato' => '#0891b2',
                'coordinador' => '#059669',
                default => '#94a3b8'
            }
        ]);

        // Estados de Ítems de Evidencia
        $itemsByEstado = DB::table('evidencia_items')
            ->join('estado_item', 'evidencia_items.id_estado', '=', 'estado_item.id')
            ->select('estado_item.nombre', DB::raw('count(*) as total'))
            ->groupBy('estado_item.nombre')
            ->get();

        $estadoStats = $itemsByEstado->map(fn($item) => [
            'name' => $item->nombre,
            'value' => $item->total,
            'fill' => match(strtolower($item->nombre)) {
                'completo' => '#22c55e',
                'en proceso' => '#f59e0b',
                'pendiente' => '#ef4444',
                default => '#94a3b8'
            }
        ]);

        // Totales generales
        $totalUsers = User::count();
        $totalFacultades = Facultad::count();
        $totalProgramas = Programa::count();
        $totalSedes = Sede::count();
        $totalItems = EvidenciaItem::count();

        return Inertia::render('dashboard', [
            'isAdmin' => true,
            'analytics' => [
                'userRoleStats' => $userRoleStats,
                'estadoStats' => $estadoStats,
                'totalUsers' => $totalUsers,
                'totalFacultades' => $totalFacultades,
                'totalProgramas' => $totalProgramas,
                'totalSedes' => $totalSedes,
                'totalItems' => $totalItems
            ]
        ]);
    }

    private function decanatoDashboard(Request $request, $user): Response
    {
        $asignacion = $user->asignaciones
            ->filter(fn($a) => strtolower($a->rol->nombre ?? '') === 'decanato')
            ->first();

        if (!$asignacion || !$asignacion->id_facultad) {
            return Inertia::render('dashboard');
        }

        $facultad = $asignacion->facultad;
        $id_programa_sede_filtro = $request->query('programa_sede');

        // Obtener programas de la facultad
        $programaSedes = ProgramaSede::with(['programa', 'sede'])
            ->whereHas('programa', function ($q) use ($facultad) {
                $q->where('id_facultad', $facultad->id);
            })
            ->get();

        $estandares = Estandar::with(['criterios.indicadores', 'criterios.evidencias'])->get();

        // Datos para Gráfico de Avance por Programa (Jerárquico)
        $avancePorPrograma = $programaSedes->map(function ($ps) use ($estandares) {
            $itemsPs = EvidenciaItem::where('id_programa_sede', $ps->id)->with('estado')->get();
            $avance = $this->calculateHierarchicalAvance($estandares, $itemsPs);

            return [
                'name' => $ps->programa->nombre . ' - ' . $ps->sede->nombre,
                'avance' => round($avance, 0), // Normalized to integer
            ];
        });

        // Cumplimiento General de Indicadores
        $psIds = $id_programa_sede_filtro ? [$id_programa_sede_filtro] : $programaSedes->pluck('id')->all();
        $indicadores = Indicador::all();
        $cumplimientoStats = [['name' => 'Cumple', 'value' => 0, 'fill' => '#22c55e'], ['name' => 'No Cumple', 'value' => 0, 'fill' => '#ef4444'], ['name' => 'Sin Datos', 'value' => 0, 'fill' => '#94a3b8']];

        foreach ($indicadores as $indicador) {
            $resultado = DB::table('indicador_resultados')->where('id_indicador', $indicador->id)->whereIn('id_programa_sede', $psIds)->first();
            if ($resultado && $indicador->valor_referencial !== null) {
                ($resultado->valor_real >= $indicador->valor_referencial) ? $cumplimientoStats[0]['value']++ : $cumplimientoStats[1]['value']++;
            } else {
                $cumplimientoStats[2]['value']++;
            }
        }

        // Avance General Consolidado (Jerárquico)
        $itemsGlobal = EvidenciaItem::whereIn('id_programa_sede', $psIds)->with('estado')->get();
        $avanceGeneral = $this->calculateHierarchicalAvance($estandares, $itemsGlobal);

        // Totales básicos para tarjetas
        $totalItems = $itemsGlobal->count();
        $totalCompletados = $itemsGlobal->filter(fn($i) => strtolower($i->estado->nombre ?? '') === 'completo')->count();

        return Inertia::render('dashboard', [
            'isDecanato' => true,
            'facultad' => $facultad,
            'programaSedes' => $programaSedes,
            'selectedProgramaSede' => $id_programa_sede_filtro,
            'analytics' => [
                'avancePorPrograma' => $avancePorPrograma,
                'cumplimientoStats' => $cumplimientoStats,
                'avanceGeneral' => round($avanceGeneral, 0), // Match frontend stat.avgAvance rounding
                'totalItems' => $totalItems,
                'totalCompletados' => $totalCompletados
            ]
        ]);
    }

    private function calculateHierarchicalAvance($estandares, $items)
    {
        $avancesEstandares = $estandares->map(function ($estandar) use ($items) {
            $avancesCriterios = $estandar->criterios->map(function ($criterio) use ($items) {
                $indAvances = $criterio->indicadores->map(function ($ind) use ($items) {
                    $itemsInd = $items->where('id_indicador', $ind->id);
                    $total = $itemsInd->count();
                    $comp = $itemsInd->filter(fn($i) => strtolower($i->estado->nombre ?? '') === 'completo')->count();
                    return $total > 0 ? ($comp / $total) * 100 : 0;
                });

                $evidAvances = $criterio->evidencias->map(function ($ev) use ($items) {
                    $itemsEv = $items->where('id_evidencia', $ev->id);
                    $total = $itemsEv->count();
                    $comp = $itemsEv->filter(fn($i) => strtolower($i->estado->nombre ?? '') === 'completo')->count();
                    return $total > 0 ? ($comp / $total) * 100 : 0;
                });

                $hijos = $indAvances->concat($evidAvances);
                $avanceCriterio = $hijos->count() > 0 ? $hijos->avg() : 0;
                return round($avanceCriterio, 2); // Intermediate rounding (DecanatoController:135)
            });
            $avanceEstandar = $avancesCriterios->count() > 0 ? $avancesCriterios->avg() : 0;
            return round($avanceEstandar, 2); // Intermediate rounding (DecanatoController:147)
        });

        return $avancesEstandares->count() > 0 ? $avancesEstandares->avg() : 0;
    }
}
