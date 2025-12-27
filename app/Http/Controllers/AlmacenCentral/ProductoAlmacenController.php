<?php

namespace App\Http\Controllers\AlmacenCentral;

use App\Http\Controllers\Controller;
use App\Models\ProductoAlmacen;
use App\Models\CategoriaProducto;
use App\Models\UnidadMedida;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoAlmacenController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->puedeVer('productos-central')) {
            abort(403, 'No tienes permiso para ver productos de almacén');
        }

        $productos = ProductoAlmacen::with(['categoria', 'unidadBase', 'unidadesMedida'])
            ->orderBy('nombre')
            ->get();

        return Inertia::render('AlmacenCentral/Productos/Index', [
            'productos' => [
                'data' => $productos,
                'total' => $productos->count(),
            ],
            'categorias' => CategoriaProducto::activos()->get(['id', 'nombre']),
            'unidadesBase' => UnidadMedida::activos()->get(['id', 'nombre', 'abreviatura']),
            'permisos' => [
                'puede_crear' => auth()->user()->puedeCrear('productos-central'),
                'puede_editar' => auth()->user()->puedeEditar('productos-central'),
                'puede_eliminar' => auth()->user()->puedeEliminar('productos-central'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->puedeCrear('productos-central')) {
            abort(403, 'No tienes permiso para crear productos de almacén');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:200',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'required|exists:categorias_productos,id',
            'unidad_base_id' => 'required|exists:unidades_medida,id',
            'unidades_medida' => 'required|array|min:1',
            'unidades_medida.*.unidad_medida_id' => 'required|exists:unidades_medida,id',
            'unidades_medida.*.factor_conversion' => 'required|numeric|min:0.0001',
            'unidades_medida.*.codigo_barras' => 'nullable|string|max:100',
            'unidades_medida.*.es_unidad_base' => 'boolean',
        ]);

        $producto = ProductoAlmacen::create([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'categoria_id' => $validated['categoria_id'],
            'unidad_base_id' => $validated['unidad_base_id'],
        ]);

        // Asignar unidades de medida
        foreach ($validated['unidades_medida'] as $unidad) {
            $producto->agregarUnidadMedida(
                $unidad['unidad_medida_id'],
                $unidad['factor_conversion'],
                $unidad['codigo_barras'] ?? null,
                $unidad['es_unidad_base'] ?? false
            );
        }

        return redirect()->route('almacen-central.productos.index')
            ->with('success', 'Producto creado exitosamente');
    }

    public function update(Request $request, $id)
    {
        if (!auth()->user()->puedeEditar('productos-central')) {
            abort(403, 'No tienes permiso para editar productos de almacén');
        }

        $producto = ProductoAlmacen::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:200',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'required|exists:categorias_productos,id',
            'unidad_base_id' => 'required|exists:unidades_medida,id',
            'activo' => 'required|integer|in:0,1',
            'unidades_medida' => 'required|array|min:1',
            'unidades_medida.*.unidad_medida_id' => 'required|exists:unidades_medida,id',
            'unidades_medida.*.factor_conversion' => 'required|numeric|min:0.0001',
            'unidades_medida.*.codigo_barras' => 'nullable|string|max:100',
            'unidades_medida.*.es_unidad_base' => 'boolean',
        ]);

        $producto->update([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'categoria_id' => $validated['categoria_id'],
            'unidad_base_id' => $validated['unidad_base_id'],
            'activo' => $validated['activo'],
        ]);

        // Eliminar unidades anteriores y reasignar
        $producto->unidadesMedida()->detach();
        
        foreach ($validated['unidades_medida'] as $unidad) {
            $producto->agregarUnidadMedida(
                $unidad['unidad_medida_id'],
                $unidad['factor_conversion'],
                $unidad['codigo_barras'] ?? null,
                $unidad['es_unidad_base'] ?? false
            );
        }

        return redirect()->route('almacen-central.productos.index')
            ->with('success', 'Producto actualizado exitosamente');
    }

    public function destroy($id)
    {
        if (!auth()->user()->puedeEliminar('productos-central')) {
            abort(403, 'No tienes permiso para eliminar productos de almacén');
        }

        $producto = ProductoAlmacen::findOrFail($id);

        // Aquí podrías verificar si tiene movimientos de inventario
        // Por ahora solo desactivamos
        $producto->update(['activo' => 0]);

        return redirect()->route('almacen-central.productos.index')
            ->with('success', 'Producto eliminado exitosamente');
    }
}