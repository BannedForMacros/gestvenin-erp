<?php

namespace App\Http\Controllers\Configuracion;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Module;
use App\Models\UserModule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserModuleController extends Controller
{
    public function index()
    {
        if (!auth()->user()->puedeVer('permisos-usuario')) {
            abort(403, 'No tienes permiso para gestionar permisos por usuario');
        }

        $users = User::where('activo', true)
            ->with('role')
            ->get(['id', 'name', 'email', 'role_id']);

        return Inertia::render('Configuracion/PermisosUsuario/Index', [
            'users' => $users,
            'permisos' => [
                'puede_editar' => auth()->user()->puedeEditar('permisos-usuario'),
            ],
        ]);
    }

    public function show(User $user)
    {
        if (!auth()->user()->puedeVer('permisos-usuario')) {
            abort(403, 'No tienes permiso para ver permisos por usuario');
        }

        $modules = Module::activos()
            ->with(['children' => function ($query) {
                $query->activos()->orderBy('orden');
            }])
            ->padres()
            ->orderBy('orden')
            ->get();

        // Permisos del rol
        $roleModules = $user->role->roleModules()
            ->where('activo', true)
            ->get()
            ->keyBy('module_id');

        // Permisos personalizados del usuario
        $userModules = UserModule::where('user_id', $user->id)
            ->where('activo', true)
            ->get()
            ->keyBy('module_id');

        return Inertia::render('Configuracion/PermisosUsuario/Show', [
            'user' => $user->load('role'),
            'modules' => $modules,
            'roleModules' => $roleModules,
            'userModules' => $userModules,
            'permisos' => [
                'puede_editar' => auth()->user()->puedeEditar('permisos-usuario'),
            ],
        ]);
    }

    public function update(Request $request, User $user)
    {
        if (!auth()->user()->puedeEditar('permisos-usuario')) {
            abort(403, 'No tienes permiso para editar permisos por usuario');
        }

        $validated = $request->validate([
            'modules' => 'required|array',
            'modules.*.module_id' => 'required|exists:modules,id',
            'modules.*.accion' => 'required|in:denegar,permitir',
            'modules.*.puede_ver' => 'boolean',
            'modules.*.puede_crear' => 'boolean',
            'modules.*.puede_editar' => 'boolean',
            'modules.*.puede_eliminar' => 'boolean',
        ]);

        // Eliminar permisos personalizados anteriores
        UserModule::where('user_id', $user->id)->delete();

        // Crear nuevos permisos personalizados
        foreach ($validated['modules'] as $moduleData) {
            UserModule::create([
                'user_id' => $user->id,
                'module_id' => $moduleData['module_id'],
                'accion' => $moduleData['accion'],
                'puede_ver' => $moduleData['puede_ver'] ?? false,
                'puede_crear' => $moduleData['puede_crear'] ?? false,
                'puede_editar' => $moduleData['puede_editar'] ?? false,
                'puede_eliminar' => $moduleData['puede_eliminar'] ?? false,
            ]);
        }

        return redirect()->route('permisos-usuario.show', $user)
            ->with('success', 'Permisos personalizados actualizados exitosamente');
    }
}