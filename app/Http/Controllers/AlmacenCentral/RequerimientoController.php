<?php

namespace App\Http\Controllers\AlmacenCentral;

use App\Http\Controllers\Controller;
use App\Models\Requerimiento;
use App\Models\ProductoAlmacen;
use App\Models\UnidadMedida;
use App\Models\InventarioAlmacenCentral;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class RequerimientoController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->puedeVer('requerimientos-central')) {
            abort(403, 'No tienes permiso para ver requerimientos');
        }

        $estado = $request->get('estado');

        $requerimientos = Requerimiento::with([
                'usuarioEnviado:id,name',
                'usuarioValidado:id,name',
                'usuarioComprado:id,name',
                'detalles'
            ])
            ->when($estado, function ($query, $estado) {
                return $query->where('estado', $estado);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('AlmacenCentral/Requerimientos/Index', [
            'requerimientos' => [
                'data' => $requerimientos,
                'total' => $requerimientos->count(),
            ],
            'filtros' => [
                'estado' => $estado,
            ],
            'permisos' => [
                'puede_crear' => auth()->user()->puedeCrear('requerimientos-central'),
                'puede_editar' => auth()->user()->puedeEditar('requerimientos-central'),
                'puede_eliminar' => auth()->user()->puedeEliminar('requerimientos-central'),
            ],
        ]);
    }

    public function create()
    {
        if (!auth()->user()->puedeCrear('requerimientos-central')) {
            abort(403, 'No tienes permiso para crear requerimientos');
        }

        $productos = ProductoAlmacen::with(['categoria', 'unidadBase', 'unidadesMedida', 'inventario'])
            ->activos()
            ->orderBy('nombre')
            ->get();

        return Inertia::render('AlmacenCentral/Requerimientos/Create', [
            'productos' => $productos,
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->puedeCrear('requerimientos-central')) {
            abort(403, 'No tienes permiso para crear requerimientos');
        }

        $validated = $request->validate([
            'descripcion' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'required|exists:productos_almacen,id',
            'detalles.*.unidad_medida_id' => 'required|exists:unidades_medida,id',
            'detalles.*.cantidad_solicitada' => 'required|numeric|min:0.01',
            'detalles.*.precio_unitario' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Crear requerimiento
            $requerimiento = Requerimiento::create([
                'descripcion' => $validated['descripcion'],
                'estado' => 'borrador',
            ]);

            // Crear detalles
            foreach ($validated['detalles'] as $index => $detalle) {
                $cantidadBase = \App\Models\RequerimientoDetalle::calcularCantidadBase(
                    $detalle['cantidad_solicitada'],
                    $detalle['unidad_medida_id']
                );

                $precioUnitario = \App\Models\RequerimientoDetalle::obtenerPrecioUnitario(
                    $detalle['producto_id'],
                    $detalle['precio_unitario'] ?? null
                );

                $requerimiento->detalles()->create([
                    'producto_id' => $detalle['producto_id'],
                    'unidad_medida_id' => $detalle['unidad_medida_id'],
                    'cantidad_solicitada' => $detalle['cantidad_solicitada'],
                    'cantidad_unidad_base' => $cantidadBase,
                    'precio_unitario' => $precioUnitario,
                    'orden' => $index + 1,
                ]);
            }

            DB::commit();

            return redirect()->route('almacen-central.requerimientos.index')
                ->with('success', 'Requerimiento creado exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al crear el requerimiento: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        if (!auth()->user()->puedeVer('requerimientos-central')) {
            abort(403, 'No tienes permiso para ver requerimientos');
        }

        $requerimiento = Requerimiento::with([
                'detalles.producto.categoria',
                'detalles.producto.unidadBase',
                'detalles.unidadMedida',
                'usuarioEnviado',
                'usuarioValidado',
                'usuarioComprado',
            ])
            ->findOrFail($id);

        return Inertia::render('AlmacenCentral/Requerimientos/Show', [
            'requerimiento' => $requerimiento,
            'permisos' => [
                'puede_editar' => auth()->user()->puedeEditar('requerimientos-central'),
                'puede_validar' => auth()->user()->puedeEditar('requerimientos-central'), // Ajustar según rol
            ],
        ]);
    }

    public function edit($id)
    {
        if (!auth()->user()->puedeEditar('requerimientos-central')) {
            abort(403, 'No tienes permiso para editar requerimientos');
        }

        $requerimiento = Requerimiento::with([
                'detalles.producto',
                'detalles.unidadMedida',
            ])
            ->findOrFail($id);

        if (!$requerimiento->puede_editarse) {
            return back()->with('error', 'Este requerimiento no puede editarse');
        }

        $productos = ProductoAlmacen::with(['categoria', 'unidadBase', 'unidadesMedida', 'inventario'])
            ->activos()
            ->orderBy('nombre')
            ->get();

        return Inertia::render('AlmacenCentral/Requerimientos/Edit', [
            'requerimiento' => $requerimiento,
            'productos' => $productos,
        ]);
    }

    public function update(Request $request, $id)
    {
        if (!auth()->user()->puedeEditar('requerimientos-central')) {
            abort(403, 'No tienes permiso para editar requerimientos');
        }

        $requerimiento = Requerimiento::findOrFail($id);

        if (!$requerimiento->puede_editarse) {
            return back()->with('error', 'Este requerimiento no puede editarse');
        }

        $validated = $request->validate([
            'descripcion' => 'nullable|string',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'required|exists:productos_almacen,id',
            'detalles.*.unidad_medida_id' => 'required|exists:unidades_medida,id',
            'detalles.*.cantidad_solicitada' => 'required|numeric|min:0.01',
            'detalles.*.precio_unitario' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Actualizar requerimiento
            $requerimiento->update([
                'descripcion' => $validated['descripcion'],
            ]);

            // Eliminar detalles anteriores
            $requerimiento->detalles()->delete();

            // Crear nuevos detalles
            foreach ($validated['detalles'] as $index => $detalle) {
                $cantidadBase = \App\Models\RequerimientoDetalle::calcularCantidadBase(
                    $detalle['cantidad_solicitada'],
                    $detalle['unidad_medida_id']
                );

                $precioUnitario = \App\Models\RequerimientoDetalle::obtenerPrecioUnitario(
                    $detalle['producto_id'],
                    $detalle['precio_unitario'] ?? null
                );

                $requerimiento->detalles()->create([
                    'producto_id' => $detalle['producto_id'],
                    'unidad_medida_id' => $detalle['unidad_medida_id'],
                    'cantidad_solicitada' => $detalle['cantidad_solicitada'],
                    'cantidad_unidad_base' => $cantidadBase,
                    'precio_unitario' => $precioUnitario,
                    'orden' => $index + 1,
                ]);
            }

            DB::commit();

            return redirect()->route('almacen-central.requerimientos.index')
                ->with('success', 'Requerimiento actualizado exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al actualizar el requerimiento: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        if (!auth()->user()->puedeEliminar('requerimientos-central')) {
            abort(403, 'No tienes permiso para eliminar requerimientos');
        }

        $requerimiento = Requerimiento::findOrFail($id);

        if (!$requerimiento->puede_editarse) {
            return back()->with('error', 'Este requerimiento no puede eliminarse');
        }

        $requerimiento->delete();

        return redirect()->route('almacen-central.requerimientos.index')
            ->with('success', 'Requerimiento eliminado exitosamente');
    }

    // Enviar requerimiento
    public function enviar($id)
    {
        if (!auth()->user()->puedeEditar('requerimientos-central')) {
            abort(403, 'No tienes permiso para enviar requerimientos');
        }

        $requerimiento = Requerimiento::findOrFail($id);

        if (!$requerimiento->puede_enviarse) {
            return back()->with('error', 'Este requerimiento no puede enviarse');
        }

        try {
            $requerimiento->enviar(auth()->id());
            return back()->with('success', 'Requerimiento enviado exitosamente');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    // Aprobar requerimiento
    public function aprobar(Request $request, $id)
    {
        if (!auth()->user()->puedeEditar('requerimientos-central')) {
            abort(403, 'No tienes permiso para aprobar requerimientos');
        }

        $validated = $request->validate([
            'observacion' => 'nullable|string',
        ]);

        $requerimiento = Requerimiento::findOrFail($id);

        if (!$requerimiento->puede_validarse) {
            return back()->with('error', 'Este requerimiento no puede validarse');
        }

        try {
            $requerimiento->aprobar(auth()->id(), $validated['observacion'] ?? null);
            return back()->with('success', 'Requerimiento aprobado exitosamente');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    // Rechazar requerimiento
    public function rechazar(Request $request, $id)
    {
        if (!auth()->user()->puedeEditar('requerimientos-central')) {
            abort(403, 'No tienes permiso para rechazar requerimientos');
        }

        $validated = $request->validate([
            'observacion' => 'required|string',
        ]);

        $requerimiento = Requerimiento::findOrFail($id);

        if (!$requerimiento->puede_validarse) {
            return back()->with('error', 'Este requerimiento no puede validarse');
        }

        try {
            $requerimiento->rechazar(auth()->id(), $validated['observacion']);
            return back()->with('success', 'Requerimiento rechazado');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    // Generar requerimiento automático
    public function generarAutomatico()
    {
        if (!auth()->user()->puedeCrear('requerimientos-central')) {
            abort(403, 'No tienes permiso para crear requerimientos');
        }

        $productosBajoStock = InventarioAlmacenCentral::with(['producto.unidadBase', 'producto.unidadesMedida'])
            ->bajoStockMinimo()
            ->get();

        if ($productosBajoStock->isEmpty()) {
            return back()->with('info', 'No hay productos bajo stock mínimo');
        }

        DB::beginTransaction();
        try {
            // Crear requerimiento
            $requerimiento = Requerimiento::create([
                'descripcion' => 'Requerimiento automático generado por stock bajo mínimo',
                'estado' => 'borrador',
            ]);

            // Crear detalles
            foreach ($productosBajoStock as $index => $inventario) {
                $cantidadFaltante = $inventario->cantidadFaltante();
                
                // Usar la unidad base del producto
                $unidadBase = $inventario->producto->unidadBase;

                $requerimiento->detalles()->create([
                    'producto_id' => $inventario->producto_id,
                    'unidad_medida_id' => $unidadBase->id,
                    'cantidad_solicitada' => $cantidadFaltante,
                    'cantidad_unidad_base' => $cantidadFaltante,
                    'precio_unitario' => $inventario->precio_unitario,
                    'orden' => $index + 1,
                ]);
            }

            DB::commit();

            return redirect()->route('almacen-central.requerimientos.edit', $requerimiento->id)
                ->with('success', 'Requerimiento automático generado. Puedes editarlo antes de enviarlo.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al generar requerimiento: ' . $e->getMessage());
        }
    }
}