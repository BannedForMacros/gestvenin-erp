<?php

namespace App\Http\Controllers\Configuracion;

use App\Http\Controllers\Controller;
use App\Models\CategoriaProducto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaAlmacenController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->puedeVer('categorias-almacen')) {
            abort(403, 'No tienes permiso para ver categorías de almacén');
        }

        $categorias = CategoriaProducto::withCount('productos')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Configuracion/CategoriasAlmacen/Index', [
            'categorias' => [
                'data' => $categorias,
                'total' => $categorias->count(),
            ],
            'permisos' => [
                'puede_crear' => auth()->user()->puedeCrear('categorias-almacen'),
                'puede_editar' => auth()->user()->puedeEditar('categorias-almacen'),
                'puede_eliminar' => auth()->user()->puedeEliminar('categorias-almacen'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->puedeCrear('categorias-almacen')) {
            abort(403, 'No tienes permiso para crear categorías de almacén');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
        ]);

        CategoriaProducto::create($validated);

        return redirect()->route('configuracion.categorias-almacen.index')
            ->with('success', 'Categoría creada exitosamente');
    }

    public function update(Request $request, $id)
    {
        if (!auth()->user()->puedeEditar('categorias-almacen')) {
            abort(403, 'No tienes permiso para editar categorías de almacén');
        }

        $categoria = CategoriaProducto::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'activo' => 'required|integer|in:0,1',
        ]);

        $categoria->update($validated);

        return redirect()->route('configuracion.categorias-almacen.index')
            ->with('success', 'Categoría actualizada exitosamente');
    }

    public function destroy($id)
    {
        if (!auth()->user()->puedeEliminar('categorias-almacen')) {
            abort(403, 'No tienes permiso para eliminar categorías de almacén');
        }

        $categoria = CategoriaProducto::findOrFail($id);

        // Verificar que no tenga productos
        if ($categoria->productos()->count() > 0) {
            return redirect()->route('configuracion.categorias-almacen.index')
                ->with('error', 'No se puede eliminar la categoría porque tiene productos asociados');
        }

        $categoria->update(['activo' => 0]);

        return redirect()->route('configuracion.categorias-almacen.index')
            ->with('success', 'Categoría eliminada exitosamente');
    }
}