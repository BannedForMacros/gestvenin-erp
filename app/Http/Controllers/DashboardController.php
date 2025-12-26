<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('Dashboard', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->nombre ?? null,
                'local' => $user->local->nombre ?? null,
                'empresa' => $user->empresa->nombre_comercial ?? null,
            ],
            'permisos' => [
                'puede_ver_reportes' => $user->puedeVer('reportes'),
                'puede_ver_ventas' => $user->puedeVer('ventas'),
                'puede_ver_inventario' => $user->puedeVer('almacen-local'),
            ],
        ]);
    }
}