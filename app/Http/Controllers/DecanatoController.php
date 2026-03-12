<?php

namespace App\Http\Controllers;

use App\Models\Estandar;
use App\Models\Facultad;
use App\Models\ProgramaSede;
use App\Models\EvidenciaItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class DecanatoController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('asignaciones.rol', 'asignaciones.facultad');
        
        // Buscar la facultad asignada al usuario con rol de decanato
        $asignacion = $user->asignaciones
            ->filter(fn($a) => strtolower($a->rol->nombre ?? '') === 'decanato')
            ->first();

        if (!$asignacion || !$asignacion->id_facultad) {
            abort(403, 'No tienes una facultad asignada como Decano.');
        }

        $facultad = $asignacion->facultad;
        $id_programa_sede_filtro = $request->query('programa_sede');

        // Obtener programas de la facultad y sus sedes
        $programaSedes = ProgramaSede::with(['programa', 'sede'])
            ->whereHas('programa', function ($q) use ($facultad) {
                $q->where('id_facultad', $facultad->id);
            })
            ->get();

        // Si no hay filtro, pero hay programas, podríamos seleccionar todos o el primero
        // Para el avance consolidado de la facultad, si no hay filtro, calculamos sobre todos los programas de la facultad
        
        $queryItems = EvidenciaItem::query();
        if ($id_programa_sede_filtro) {
            $queryItems->where('id_programa_sede', $id_programa_sede_filtro);
        } else {
            $queryItems->whereIn('id_programa_sede', $programaSedes->pluck('id'));
        }

        $items = $queryItems->with(['estado', 'tipoItem'])->get();

        // Estructura jerárquica: Estándar -> Criterio -> (Evidencia | Indicador)
        $estandares = Estandar::with(['criterios.indicadores', 'criterios.evidencias'])->get();

        $data = $estandares->map(function ($estandar) use ($items, $id_programa_sede_filtro) {
            $criteriosData = $estandar->criterios->map(function ($criterio) use ($items, $id_programa_sede_filtro) {
                
                // Avance de Indicadores
                $indicadoresData = $criterio->indicadores->map(function ($indicador) use ($items, $id_programa_sede_filtro) {
                    $itemsIndicador = $items->where('id_indicador', $indicador->id);
                    $total = $itemsIndicador->count();
                    $completados = $itemsIndicador->filter(fn($i) => strtolower($i->estado->nombre ?? '') === 'completo')->count();
                    $avance = $total > 0 ? ($completados / $total) * 100 : 0;
                    
                    $queryResultado = \DB::table('indicador_resultados')
                        ->where('id_indicador', $indicador->id);
                    
                    if ($id_programa_sede_filtro) {
                        $queryResultado->where('id_programa_sede', $id_programa_sede_filtro);
                    }
                    
                    $itemResultado = $queryResultado->first();
                    
                    $valorAlcanzado = $itemResultado ? $itemResultado->valor_real : null;
                    
                    $cumple = null;
                    if ($valorAlcanzado !== null && $indicador->valor_referencial !== null) {
                        $cumple = $valorAlcanzado >= $indicador->valor_referencial;
                    }

                    return [
                        'id' => $indicador->id,
                        'codigo' => $indicador->codigo,
                        'nombre' => $indicador->nombre,
                        'objetivo' => $indicador->objetivo,
                        'tipo_dato' => $indicador->tipo_dato,
                        'valor_ref' => $indicador->valor_referencial,
                        'valor_real' => $valorAlcanzado,
                        'cumple' => $cumple,
                        'info' => "Tipo: {$indicador->tipo_dato} | Valor Ref: {$indicador->valor_referencial}",
                        'avance' => round($avance, 2),
                        'total_items' => $total,
                        'completados' => $completados,
                        'tipo' => 'indicador',
                        'items' => $itemsIndicador->map(fn($i) => [
                            'id' => $i->id,
                            'nombre' => $i->nombre_item,
                            'tipo' => $i->tipoItem->nombre ?? 'N/A',
                            'estado' => $i->estado->nombre ?? 'Pendiente',
                        ])->values()
                    ];
                });

                // Avance de Evidencias
                $evidenciasData = $criterio->evidencias->map(function ($evidencia) use ($items) {
                    $itemsEvidencia = $items->where('id_evidencia', $evidencia->id);
                    $total = $itemsEvidencia->count();
                    $completados = $itemsEvidencia->filter(fn($i) => strtolower($i->estado->nombre ?? '') === 'completo')->count();
                    $avance = $total > 0 ? ($completados / $total) * 100 : 0;

                    return [
                        'id' => $evidencia->id,
                        'codigo' => $evidencia->codigo,
                        'nombre' => $evidencia->descripcion,
                        'avance' => round($avance, 2),
                        'total_items' => $total,
                        'completados' => $completados,
                        'tipo' => 'evidencia',
                        'items' => $itemsEvidencia->map(fn($i) => [
                            'id' => $i->id,
                            'nombre' => $i->nombre_item,
                            'tipo' => $i->tipoItem->nombre ?? 'N/A',
                            'estado' => $i->estado->nombre ?? 'Pendiente',
                        ])->values()
                    ];
                });

                // Combinar evidencias e indicadores para el cálculo del criterio
                $hijos = $indicadoresData->concat($evidenciasData);
                $avanceCriterio = $hijos->count() > 0 ? $hijos->avg('avance') : 0;

                return [
                    'id' => $criterio->id,
                    'nombre' => $criterio->nombre,
                    'descripcion' => $criterio->descripcion,
                    'avance' => round($avanceCriterio, 2),
                    'hijos' => $hijos
                ];
            });

            $avanceEstandar = $criteriosData->count() > 0 ? $criteriosData->avg('avance') : 0;

            return [
                'id' => $estandar->id,
                'nombre' => $estandar->nombre,
                'titulo' => $estandar->titulo,
                'descripcion' => $estandar->descripcion,
                'avance' => round($avanceEstandar, 2),
                'criterios' => $criteriosData
            ];
        });

        return Inertia::render('decanato/dashboard', [
            'facultad' => $facultad,
            'programaSedes' => $programaSedes,
            'selectedProgramaSede' => $id_programa_sede_filtro,
            'avanceData' => $data,
        ]);
    }

    public function seguimiento(Request $request): Response
    {
        $user = $request->user()->load('asignaciones.rol', 'asignaciones.facultad');
        
        $asignacion = $user->asignaciones
            ->filter(fn($a) => strtolower($a->rol->nombre ?? '') === 'decanato')
            ->first();

        if (!$asignacion || !$asignacion->id_facultad) {
            abort(403, 'No tienes una facultad asignada como Decano.');
        }

        $facultad = $asignacion->facultad;
        $id_programa_sede_filtro = $request->query('programa_sede');

        $programaSedes = ProgramaSede::with(['programa', 'sede'])
            ->whereHas('programa', function ($q) use ($facultad) {
                $q->where('id_facultad', $facultad->id);
            })
            ->get();
        
        $queryItems = EvidenciaItem::query();
        if ($id_programa_sede_filtro) {
            $queryItems->where('id_programa_sede', $id_programa_sede_filtro);
        } else {
            $queryItems->whereIn('id_programa_sede', $programaSedes->pluck('id'));
        }

        $items = $queryItems->with(['estado', 'tipoItem'])->get();
        $estandares = Estandar::with(['criterios.indicadores', 'criterios.evidencias'])->get();

        $data = $estandares->map(function ($estandar) use ($items, $id_programa_sede_filtro) {
            $criteriosData = $estandar->criterios->map(function ($criterio) use ($items, $id_programa_sede_filtro) {
                
                $indicadoresData = $criterio->indicadores->map(function ($indicador) use ($items, $id_programa_sede_filtro) {
                    $itemsIndicador = $items->where('id_indicador', $indicador->id);
                    $total = $itemsIndicador->count();
                    $completados = $itemsIndicador->filter(fn($i) => strtolower($i->estado->nombre ?? '') === 'completo')->count();
                    $avance = $total > 0 ? ($completados / $total) * 100 : 0;
                    
                    $queryResultado = \DB::table('indicador_resultados')->where('id_indicador', $indicador->id);
                    if ($id_programa_sede_filtro) { $queryResultado->where('id_programa_sede', $id_programa_sede_filtro); }
                    $itemResultado = $queryResultado->first();
                    $valorAlcanzado = $itemResultado ? $itemResultado->valor_real : null;
                    
                    $cumple = null;
                    if ($valorAlcanzado !== null && $indicador->valor_referencial !== null) {
                        $cumple = $valorAlcanzado >= $indicador->valor_referencial;
                    }

                    return [
                        'id' => $indicador->id, 'codigo' => $indicador->codigo, 'nombre' => $indicador->nombre, 'objetivo' => $indicador->objetivo,
                        'tipo_dato' => $indicador->tipo_dato, 'valor_ref' => $indicador->valor_referencial, 'valor_real' => $valorAlcanzado,
                        'cumple' => $cumple, 'avance' => round($avance, 2), 'total_items' => $total, 'completados' => $completados, 'tipo' => 'indicador',
                        'items' => $itemsIndicador->map(fn($i) => [
                            'id' => $i->id, 'nombre' => $i->nombre_item, 'tipo' => $i->tipoItem->nombre ?? 'N/A', 'estado' => $i->estado->nombre ?? 'Pendiente',
                        ])->values()
                    ];
                });

                $evidenciasData = $criterio->evidencias->map(function ($evidencia) use ($items) {
                    $itemsEvidencia = $items->where('id_evidencia', $evidencia->id);
                    $total = $itemsEvidencia->count();
                    $completados = $itemsEvidencia->filter(fn($i) => strtolower($i->estado->nombre ?? '') === 'completo')->count();
                    $avance = $total > 0 ? ($completados / $total) * 100 : 0;

                    return [
                        'id' => $evidencia->id, 'codigo' => $evidencia->codigo, 'nombre' => $evidencia->descripcion, 'avance' => round($avance, 2),
                        'total_items' => $total, 'completados' => $completados, 'tipo' => 'evidencia',
                        'items' => $itemsEvidencia->map(fn($i) => [
                            'id' => $i->id, 'nombre' => $i->nombre_item, 'tipo' => $i->tipoItem->nombre ?? 'N/A', 'estado' => $i->estado->nombre ?? 'Pendiente',
                        ])->values()
                    ];
                });

                $hijos = $indicadoresData->concat($evidenciasData);
                $avanceCriterio = $hijos->count() > 0 ? $hijos->avg('avance') : 0;

                return [
                    'id' => $criterio->id, 'nombre' => $criterio->nombre, 'descripcion' => $criterio->descripcion,
                    'avance' => round($avanceCriterio, 2), 'hijos' => $hijos
                ];
            });

            $avanceEstandar = $criteriosData->count() > 0 ? $criteriosData->avg('avance') : 0;

            return [
                'id' => $estandar->id, 'nombre' => $estandar->nombre, 'titulo' => $estandar->titulo, 'descripcion' => $estandar->descripcion,
                'avance' => round($avanceEstandar, 2), 'criterios' => $criteriosData
            ];
        });

        return Inertia::render('decanato/seguimiento', [
            'facultad' => $facultad,
            'programaSedes' => $programaSedes,
            'selectedProgramaSede' => $id_programa_sede_filtro,
            'avanceData' => $data,
        ]);
    }

    public function indicadores(Request $request): Response
    {
        $user = $request->user()->load('asignaciones.rol', 'asignaciones.facultad');
        $asignacion = $user->asignaciones->filter(fn($a) => strtolower($a->rol->nombre ?? '') === 'decanato')->first();

        if (!$asignacion || !$asignacion->id_facultad) {
            abort(403, 'No tienes una facultad asignada como Decano.');
        }

        $facultad = $asignacion->facultad;
        $id_programa_sede_filtro = $request->query('programa_sede');

        $programaSedes = ProgramaSede::with(['programa', 'sede'])
            ->whereHas('programa', fn($q) => $q->where('id_facultad', $facultad->id))
            ->get();
        
        $queryItems = EvidenciaItem::query();
        if ($id_programa_sede_filtro) {
            $queryItems->where('id_programa_sede', $id_programa_sede_filtro);
        } else {
            $queryItems->whereIn('id_programa_sede', $programaSedes->pluck('id'));
        }

        $items = $queryItems->with(['estado'])->get();
        
        // Fetch unique indicators from ID01 to ID29 strictly
        $indicadores = \App\Models\Indicador::whereBetween('codigo', ['ID01', 'ID29'])
            ->with(['criterios.estandar'])
            ->orderBy('codigo')
            ->get();

        $indicadoresData = [];

        foreach ($indicadores as $indicador) {
            $criterio = $indicador->criterios->first();
            $estandar = $criterio ? $criterio->estandar : null;

            $itemsIndicador = $items->where('id_indicador', $indicador->id);
            $total = $itemsIndicador->count();
            $completados = $itemsIndicador->filter(fn($i) => strtolower($i->estado->nombre ?? '') === 'completo')->count();
            $avance = $total > 0 ? ($completados / $total) * 100 : 0;
            
            $queryResultado = DB::table('indicador_resultados')->where('id_indicador', $indicador->id);
            if ($id_programa_sede_filtro) { $queryResultado->where('id_programa_sede', $id_programa_sede_filtro); }
            $itemResultado = $queryResultado->first();
            $valorAlcanzado = $itemResultado ? $itemResultado->valor_real : null;
            
            $cumple = null;
            if ($valorAlcanzado !== null && $indicador->valor_referencial !== null) {
                $cumple = $valorAlcanzado >= $indicador->valor_referencial;
            }

            $indicadoresData[] = [
                'id' => $indicador->id,
                'codigo' => $indicador->codigo,
                'nombre' => $indicador->nombre,
                'objetivo' => $indicador->objetivo,
                'estandar' => $estandar ? $estandar->nombre : 'N/A',
                'criterio' => $criterio ? $criterio->nombre : 'N/A',
                'valor_ref' => $indicador->valor_referencial,
                'valor_real' => $valorAlcanzado,
                'cumple' => $cumple,
                'avance' => round($avance, 2),
                'total_items' => $total,
                'completados' => $completados,
            ];
        }

        return Inertia::render('decanato/indicadores', [
            'facultad' => $facultad,
            'programaSedes' => $programaSedes,
            'selectedProgramaSede' => $id_programa_sede_filtro,
            'indicadores' => $indicadoresData,
        ]);
    }
}
