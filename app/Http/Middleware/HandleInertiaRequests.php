<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user()?->load('asignaciones.rol'),
                'roles' => $request->user()?->asignaciones->pluck('rol.nombre')->unique()->values()->all() ?? [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'config' => [
                'sidebar_decanato_dashboard' => (bool) \App\Models\Configuracion::where('clave', 'sidebar_decanato_dashboard')->first()?->valor,
                'sidebar_decanato_seguimiento' => (bool) \App\Models\Configuracion::where('clave', 'sidebar_decanato_seguimiento')->first()?->valor,
                'sidebar_decanato_indicadores' => (bool) \App\Models\Configuracion::where('clave', 'sidebar_decanato_indicadores')->first()?->valor,
            ],
        ];
    }
}
