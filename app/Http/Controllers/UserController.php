<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Empresa;
use App\Models\Local;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->puedeVer('usuarios')) {
            abort(403, 'No tienes permiso para ver usuarios');
        }

        $users = User::query()
            ->with(['role', 'empresa', 'local'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Configuracion/Usuarios/Index', [
            'users' => [
                'data' => $users,
                'total' => $users->count(),
            ],
            'empresas' => Empresa::where('activo', true)->get(['id', 'nombre_comercial', 'razon_social']),
            'roles' => Role::where('activo', true)->get(['id', 'nombre', 'es_global']),
            'locales' => Local::where('activo', true)->get(['id', 'nombre', 'empresa_id']),
            'permisos' => [
                'puede_crear' => auth()->user()->puedeCrear('usuarios'),
                'puede_editar' => auth()->user()->puedeEditar('usuarios'),
                'puede_eliminar' => auth()->user()->puedeEliminar('usuarios'),
            ],
        ]);
    }

    public function create()
    {
        if (!auth()->user()->puedeCrear('usuarios')) {
            abort(403, 'No tienes permiso para crear usuarios');
        }

        return Inertia::render('Configuracion/Usuarios/Create', [
            'roles' => Role::where('activo', true)->get(['id', 'nombre', 'es_global']),
            'empresas' => Empresa::where('activo', true)->get(['id', 'nombre_comercial', 'razon_social']),
            'locales' => Local::where('activo', true)->with('empresa')->get(['id', 'nombre', 'empresa_id']),
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->puedeCrear('usuarios')) {
            abort(403, 'No tienes permiso para crear usuarios');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'empresa_id' => 'required|exists:empresas,id',
            'role_id' => 'required|exists:roles,id',
            'local_id' => 'nullable|exists:locales,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return redirect()->route('configuracion.usuarios.index')
            ->with('success', 'Usuario creado exitosamente');
    }

    public function edit(User $usuario)
    {
        if (!auth()->user()->puedeEditar('usuarios')) {
            abort(403, 'No tienes permiso para editar usuarios');
        }

        return Inertia::render('Configuracion/Usuarios/Edit', [
            'usuario' => $usuario->load(['role', 'empresa', 'local']),
            'roles' => Role::where('activo', true)->get(['id', 'nombre', 'es_global']),
            'empresas' => Empresa::where('activo', true)->get(['id', 'nombre_comercial', 'razon_social']),
            'locales' => Local::where('activo', true)->with('empresa')->get(['id', 'nombre', 'empresa_id']),
        ]);
    }

    public function update(Request $request, User $usuario)
    {
        if (!auth()->user()->puedeEditar('usuarios')) {
            abort(403, 'No tienes permiso para editar usuarios');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $usuario->id,
            'password' => 'nullable|string|min:8|confirmed',
            'empresa_id' => 'required|exists:empresas,id',
            'role_id' => 'required|exists:roles,id',
            'local_id' => 'nullable|exists:locales,id',
            'activo' => 'boolean',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $usuario->update($validated);

        return redirect()->route('configuracion.usuarios.index')
            ->with('success', 'Usuario actualizado exitosamente');
    }

    public function destroy(User $usuario)
    {
        if (!auth()->user()->puedeEliminar('usuarios')) {
            abort(403, 'No tienes permiso para eliminar usuarios');
        }

        // No permitir eliminar el propio usuario
        if ($usuario->id === auth()->id()) {
            return redirect()->route('configuracion.usuarios.index')
                ->with('error', 'No puedes eliminar tu propio usuario');
        }

        $usuario->delete();

        return redirect()->route('configuracion.usuarios.index')
            ->with('success', 'Usuario eliminado exitosamente');
    }
}