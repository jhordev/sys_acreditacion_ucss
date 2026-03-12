<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::middleware(['role:admin'])->group(function () {
        // Gestión académica
        Route::resource('facultades', \App\Http\Controllers\FacultadController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['facultades' => 'facultad']);
        Route::resource('sedes', \App\Http\Controllers\SedeController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('programas', \App\Http\Controllers\ProgramaController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('programa-sede', \App\Http\Controllers\ProgramaSedeController::class)
            ->only(['index', 'store', 'destroy'])
            ->parameters(['programa-sede' => 'programaSede']);
    });

    Route::middleware(['role:admin'])->group(function () {
        // Gestión de usuarios
        Route::resource('usuarios', \App\Http\Controllers\UsuarioController::class)
            ->only(['index', 'store', 'update', 'destroy']);
    });

    Route::middleware(['role:admin'])->group(function () {
        // Configuración
        Route::resource('tipo-item', \App\Http\Controllers\TipoItemController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('estado-item', \App\Http\Controllers\EstadoItemController::class)
            ->only(['index', 'store', 'update', 'destroy']);
    });

    Route::middleware(['role:admin'])->group(function () {
        // Acreditación
        Route::resource('estandares', \App\Http\Controllers\EstandarController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['estandares' => 'estandar']);
        Route::resource('indicadores', \App\Http\Controllers\IndicadorController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['indicadores' => 'indicador']);
        Route::resource('evidencias', \App\Http\Controllers\EvidenciaController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['evidencias' => 'evidencia']);
        Route::resource('criterios', \App\Http\Controllers\CriterioController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['criterios' => 'criterio']);
    });

    Route::middleware(['role:admin,coordinador'])->group(function () {
        // Items Evidencias
        Route::get('items-evidencias', [\App\Http\Controllers\EvidenciaItemController::class, 'indexEvidencias'])->name('items-evidencias.index');
        Route::post('items-evidencias', [\App\Http\Controllers\EvidenciaItemController::class, 'store'])->name('items-evidencias.store');
        Route::put('items-evidencias/{evidenciaItem}', [\App\Http\Controllers\EvidenciaItemController::class, 'update'])->name('items-evidencias.update');
        Route::delete('items-evidencias/{evidenciaItem}', [\App\Http\Controllers\EvidenciaItemController::class, 'destroy'])->name('items-evidencias.destroy');

        // Items Indicadores
        Route::get('items-indicadores', [\App\Http\Controllers\EvidenciaItemController::class, 'indexIndicadores'])->name('items-indicadores.index');
        Route::post('items-indicadores', [\App\Http\Controllers\EvidenciaItemController::class, 'store'])->name('items-indicadores.store');
        Route::put('items-indicadores/{evidenciaItem}', [\App\Http\Controllers\EvidenciaItemController::class, 'update'])->name('items-indicadores.update');
        Route::delete('items-indicadores/{evidenciaItem}', [\App\Http\Controllers\EvidenciaItemController::class, 'destroy'])->name('items-indicadores.destroy');
        
        Route::post('indicador-resultados', [\App\Http\Controllers\IndicadorResultadoController::class, 'store'])->name('indicador-resultados.store');
    });

    Route::middleware(['role:decanato'])->group(function () {
        Route::get('decanato', [\App\Http\Controllers\DecanatoController::class, 'index'])->name('decanato.index');
        Route::get('/decanato/seguimiento', [\App\Http\Controllers\DecanatoController::class, 'seguimiento'])->name('decanato.seguimiento');
        Route::get('/decanato/indicadores', [\App\Http\Controllers\DecanatoController::class, 'indicadores'])->name('decanato.indicadores');
    });
});

require __DIR__.'/settings.php';
