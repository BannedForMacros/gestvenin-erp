<?php

namespace App\Http\Controllers\Configuracion;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Module;
use App\Models\RoleModule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleModuleController extends Controller
{
    public function index()
    {
        if (!auth()->user()->puedeVer('permisos-rol')) {
            abort(403, 'No tienes permiso para gestionar permisos por rol');
        }

        $roles = Role::where('activo', true)->get();

        return Inertia::render('Configuracion/PermisosRol/Index', [
            'roles' => $roles,
            'permisos' => [
                'puede_editar' => auth()->user()->puedeEditar('permisos-rol'),
            ],
        ]);
    }

    public function show(Role $role)
    {
        if (!auth()->user()->puedeVer('permisos-rol')) {
            abort(403, 'No tienes permiso para ver permisos por rol');
        }

        $modules = Module::where('activo', true)
            ->with(['children' => function ($query) {
                $query->where('activo', true)->orderBy('orden');
            }])
            ->whereNull('parent_id')
            ->orderBy('orden')
            ->get();

        $roleModules = RoleModule::where('role_id', $role->id)
            ->where('activo', true)
            ->get()
            ->keyBy('module_id');

        return Inertia::render('Configuracion/PermisosRol/Show', [
            'role' => $role,
            'modules' => $modules,
            'roleModules' => $roleModules,
            'permisos' => [
                'puede_editar' => auth()->user()->puedeEditar('permisos-rol'),
            ],
        ]);
    }

    public function update(Request $request, Role $role)
    {
        if (!auth()->user()->puedeEditar('permisos-rol')) {
            abort(403, 'No tienes permiso para editar permisos por rol');
        }

        $validated = $request->validate([
            'modules' => 'required|array',
            'modules.*.module_id' => 'required|exists:modules,id',
            'modules.*.puede_ver' => 'boolean',
            'modules.*.puede_crear' => 'boolean',
            'modules.*.puede_editar' => 'boolean',
            'modules.*.puede_eliminar' => 'boolean',
        ]);

        // Eliminar permisos anteriores
        RoleModule::where('role_id', $role->id)->delete();

        // Crear nuevos permisos
        foreach ($validated['modules'] as $moduleData) {
            RoleModule::create([
                'role_id' => $role->id,
                'module_id' => $moduleData['module_id'],
                'puede_ver' => $moduleData['puede_ver'] ?? false,
                'puede_crear' => $moduleData['puede_crear'] ?? false,
                'puede_editar' => $moduleData['puede_editar'] ?? false,
                'puede_eliminar' => $moduleData['puede_eliminar'] ?? false,
            ]);
        }

        return redirect()->route('configuracion.permisos-rol.index')
            ->with('success', 'Permisos actualizados exitosamente');
    }
}
