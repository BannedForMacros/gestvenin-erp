<?php

namespace App\Http\Controllers\Configuracion;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Verificar permiso
        if (!auth()->user()->puedeVer('empresa')) {
            abort(403, 'No tienes permiso para ver empresas');
        }

        $perPage = $request->input('limit', 10);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');

        $query = Empresa::query()->with('locales');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ruc', 'like', "%{$search}%")
                    ->orWhere('razon_social', 'like', "%{$search}%")
                    ->orWhere('nombre_comercial', 'like', "%{$search}%");
            });
        }

        $empresas = $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('Configuracion/Empresa/Index', [
            'empresas' => $empresas,
            'filters' => [
                'search' => $search,
                'limit' => $perPage,
            ],
            'permisos' => [
                'puede_crear' => auth()->user()->puedeCrear('empresa'),
                'puede_editar' => auth()->user()->puedeEditar('empresa'),
                'puede_eliminar' => auth()->user()->puedeEliminar('empresa'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->puedeCrear('empresa')) {
            abort(403, 'No tienes permiso para crear empresas');
        }

        return Inertia::render('Configuracion/Empresa/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!auth()->user()->puedeCrear('empresa')) {
            abort(403, 'No tienes permiso para crear empresas');
        }

        $validated = $request->validate([
            'ruc' => 'required|string|size:11|unique:empresas,ruc',
            'razon_social' => 'required|string|max:255',
            'nombre_comercial' => 'nullable|string|max:255',
            'direccion' => 'required|string|max:255',
            'distrito' => 'nullable|string|max:100',
            'provincia' => 'nullable|string|max:100',
            'departamento' => 'nullable|string|max:100',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|string|max:255',
        ]);

        $empresa = Empresa::create($validated);

        return redirect()->route('configuracion.empresa.index')
            ->with('success', 'Empresa creada exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Empresa $empresa)
    {
        if (!auth()->user()->puedeVer('empresa')) {
            abort(403, 'No tienes permiso para ver empresas');
        }

        return Inertia::render('Configuracion/Empresa/Show', [
            'empresa' => $empresa->load('locales'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Empresa $empresa)
    {
        if (!auth()->user()->puedeEditar('empresa')) {
            abort(403, 'No tienes permiso para editar empresas');
        }

        return Inertia::render('Configuracion/Empresa/Edit', [
            'empresa' => $empresa,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Empresa $empresa)
    {
        if (!auth()->user()->puedeEditar('empresa')) {
            abort(403, 'No tienes permiso para editar empresas');
        }

        $validated = $request->validate([
            'ruc' => 'required|string|size:11|unique:empresas,ruc,' . $empresa->id,
            'razon_social' => 'required|string|max:255',
            'nombre_comercial' => 'nullable|string|max:255',
            'direccion' => 'required|string|max:255',
            'distrito' => 'nullable|string|max:100',
            'provincia' => 'nullable|string|max:100',
            'departamento' => 'nullable|string|max:100',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        $empresa->update($validated);

        return redirect()->route('configuracion.empresa.index')
            ->with('success', 'Empresa actualizada exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Empresa $empresa)
    {
        if (!auth()->user()->puedeEliminar('empresa')) {
            abort(403, 'No tienes permiso para eliminar empresas');
        }

        $empresa->delete(); // Soft delete

        return redirect()->route('configuracion.empresa.index')
            ->with('success', 'Empresa eliminada exitosamente');
    }
}