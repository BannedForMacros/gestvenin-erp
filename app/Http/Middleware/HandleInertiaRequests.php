<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    // ... código existente

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role->nombre ?? null,
                ] : null,
            ],
            'modules' => $request->user() ? $this->getModulosDisponibles($request->user()) : [],
        ];
    }

    private function getModulosDisponibles($user)
    {
        $modulos = $user->getModulosDisponibles();

        // Construir jerarquía padre/hijo
        $padres = $modulos->filter(fn($m) => is_null($m->parent_id));

        return $padres->map(function ($padre) use ($modulos) {
            return [
                'id' => $padre->id,
                'nombre' => $padre->nombre,
                'slug' => $padre->slug,
                'icono' => $padre->icono,
                'ruta' => $padre->ruta,
                'children' => $modulos
                    ->filter(fn($m) => $m->parent_id === $padre->id)
                    ->map(fn($hijo) => [
                        'id' => $hijo->id,
                        'nombre' => $hijo->nombre,
                        'slug' => $hijo->slug,
                        'ruta' => $hijo->ruta,
                    ])
                    ->values()
                    ->toArray(),
            ];
        })->values()->toArray();
    }
}