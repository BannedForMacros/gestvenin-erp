<?php

namespace App\Http\Controllers\Configuracion;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->puedeVer('roles')) {
            abort(403, 'No tienes permiso para ver roles');
        }

        $roles = Role::withCount('users')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Configuracion/Roles/Index', [
            'roles' => [
                'data' => $roles,
                'total' => $roles->count(),
            ],
            'permisos' => [
                'puede_crear' => auth()->user()->puedeCrear('roles'),
                'puede_editar' => auth()->user()->puedeEditar('roles'),
                'puede_eliminar' => auth()->user()->puedeEliminar('roles'),
            ],
        ]);
    }

    public function create()
    {
        if (!auth()->user()->puedeCrear('roles')) {
            abort(403, 'No tienes permiso para crear roles');
        }

        return Inertia::render('Configuracion/Roles/Create');
    }

    public function store(Request $request)
    {
        if (!auth()->user()->puedeCrear('roles')) {
            abort(403, 'No tienes permiso para crear roles');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'es_global' => 'boolean',
            'descripcion' => 'nullable|string',
        ]);

        Role::create($validated);

        return redirect()->route('configuracion.roles.index')
            ->with('success', 'Rol creado exitosamente');
    }

    public function edit(Role $role)
    {
        if (!auth()->user()->puedeEditar('roles')) {
            abort(403, 'No tienes permiso para editar roles');
        }

        return Inertia::render('Configuracion/Roles/Edit', [
            'role' => $role,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        if (!auth()->user()->puedeEditar('roles')) {
            abort(403, 'No tienes permiso para editar roles');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'es_global' => 'boolean',
            'descripcion' => 'nullable|string',
            'activo' => 'boolean',
        ]);

        $role->update($validated);

        return redirect()->route('configuracion.roles.index')
            ->with('success', 'Rol actualizado exitosamente');
    }

    public function destroy(Role $role)
    {
        if (!auth()->user()->puedeEliminar('roles')) {
            abort(403, 'No tienes permiso para eliminar roles');
        }

        // Verificar que no tenga usuarios asignados
        if ($role->users()->count() > 0) {
            return redirect()->route('configuracion.roles.index')
                ->with('error', 'No se puede eliminar el rol porque tiene usuarios asignados');
        }

        $role->delete();

        return redirect()->route('configuracion.roles.index')
            ->with('success', 'Rol eliminado exitosamente');
    }
}