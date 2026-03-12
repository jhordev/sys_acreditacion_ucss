<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user()) {
            abort(404);
        }

        $userRoles = $request->user()->load('asignaciones.rol')->asignaciones->pluck('rol.nombre')->unique()->map(fn($r) => strtolower($r))->all();
        $allowedRoles = array_map('strtolower', $roles);

        if (! array_intersect($allowedRoles, $userRoles)) {
            abort(404);
        }

        return $next($request);
    }
}
