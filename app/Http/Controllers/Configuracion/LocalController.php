<?php

namespace App\Http\Controllers\Configuracion;

use App\Http\Controllers\Controller;
use App\Models\Local;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocalController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->puedeVer('locales')) {
            abort(403, 'No tienes permiso para ver locales');
        }

        $perPage = $request->input('limit', 10);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');

        $query = Local::query()->with('empresa');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('direccion', 'like', "%{$search}%");
            });
        }

        $locales = $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('Configuracion/Locales/Index', [
            'locales' => $locales,
            'empresas' => Empresa::where('activo', true)->get(['id', 'nombre_comercial', 'razon_social']),
            'filters' => [
                'search' => $search,
                'limit' => $perPage,
            ],
            'permisos' => [
                'puede_crear' => auth()->user()->puedeCrear('locales'),
                'puede_editar' => auth()->user()->puedeEditar('locales'),
                'puede_eliminar' => auth()->user()->puedeEliminar('locales'),
            ],
        ]);
    }

    public function create()
    {
        if (!auth()->user()->puedeCrear('locales')) {
            abort(403, 'No tienes permiso para crear locales');
        }

        return Inertia::render('Configuracion/Locales/Create', [
            'empresas' => Empresa::where('activo', true)->get(['id', 'nombre_comercial', 'razon_social']),
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->puedeCrear('locales')) {
            abort(403, 'No tienes permiso para crear locales');
        }

        $validated = $request->validate([
            'empresa_id' => 'required|exists:empresas,id',
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'distrito' => 'nullable|string|max:100',
            'provincia' => 'nullable|string|max:100',
            'departamento' => 'nullable|string|max:100',
            'telefono' => 'nullable|string|max:20',
            'permite_mesas' => 'boolean',
        ]);

        Local::create($validated);

        return redirect()->route('configuracion.locales.index')  // ← CORREGIDO
            ->with('success', 'Local creado exitosamente');
    }

    public function edit(Local $local)
    {
        if (!auth()->user()->puedeEditar('locales')) {
            abort(403, 'No tienes permiso para editar locales');
        }

        return Inertia::render('Configuracion/Locales/Edit', [
            'local' => $local->load('empresa'),
            'empresas' => Empresa::where('activo', true)->get(['id', 'nombre_comercial', 'razon_social']),
        ]);
    }

    public function update(Request $request, Local $local)
    {
        if (!auth()->user()->puedeEditar('locales')) {
            abort(403, 'No tienes permiso para editar locales');
        }

        $validated = $request->validate([
            'empresa_id' => 'required|exists:empresas,id',
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'distrito' => 'nullable|string|max:100',
            'provincia' => 'nullable|string|max:100',
            'departamento' => 'nullable|string|max:100',
            'telefono' => 'nullable|string|max:20',
            'permite_mesas' => 'boolean',
            'activo' => 'boolean',
        ]);

        $local->update($validated);

        return redirect()->route('configuracion.locales.index')  // ← CORREGIDO
            ->with('success', 'Local actualizado exitosamente');
    }

    public function destroy(Local $local)
    {
        if (!auth()->user()->puedeEliminar('locales')) {
            abort(403, 'No tienes permiso para eliminar locales');
        }

        $local->delete();

        return redirect()->route('configuracion.locales.index')  // ← CORREGIDO
            ->with('success', 'Local eliminado exitosamente');
    }
}