<?php

namespace App\Http\Controllers\AlmacenCentral;

use App\Http\Controllers\Controller;
use App\Models\InventarioAlmacenCentral;
use App\Models\ProductoAlmacen;
use App\Models\CategoriaProducto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventarioAlmacenCentralController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->puedeVer('inventario-central')) {
            abort(403, 'No tienes permiso para ver inventario');
        }

        $categoriaId = $request->get('categoria_id');
        $bajoStock = $request->get('bajo_stock');

        $inventarios = InventarioAlmacenCentral::with([
                'producto.categoria',
                'producto.unidadBase',
            ])
            ->when($categoriaId, function ($query, $categoriaId) {
                return $query->whereHas('producto', function ($q) use ($categoriaId) {
                    $q->where('categoria_id', $categoriaId);
                });
            })
            ->when($bajoStock, function ($query) {
                return $query->bajoStockMinimo();
            })
            ->orderBy('stock_actual', 'asc')
            ->get()
            ->map(function ($inventario) {
                return [
                    'id' => $inventario->id,
                    'producto' => [
                        'id' => $inventario->producto->id,
                        'nombre' => $inventario->producto->nombre,
                        'categoria' => $inventario->producto->categoria,
                        'unidad_base' => $inventario->producto->unidadBase,
                    ],
                    'stock_actual' => $inventario->stock_actual,
                    'stock_minimo' => $inventario->stock_minimo,
                    'precio_unitario' => $inventario->precio_unitario,
                    'precio_total' => $inventario->precio_total,
                    'bajo_minimo' => $inventario->bajoDeMinimoStock(),
                    'cantidad_faltante' => $inventario->cantidadFaltante(),
                ];
            });

        return Inertia::render('AlmacenCentral/Inventario/Index', [
            'inventarios' => [
                'data' => $inventarios,
                'total' => $inventarios->count(),
            ],
            'categorias' => CategoriaProducto::activos()->get(['id', 'nombre']),
            'filtros' => [
                'categoria_id' => $categoriaId,
                'bajo_stock' => $bajoStock,
            ],
            'permisos' => [
                'puede_editar' => auth()->user()->puedeEditar('inventario-central'),
            ],
        ]);
    }

    public function show($id)
    {
        if (!auth()->user()->puedeVer('inventario-central')) {
            abort(403, 'No tienes permiso para ver inventario');
        }

        $inventario = InventarioAlmacenCentral::with([
                'producto.categoria',
                'producto.unidadBase',
                'producto.unidadesMedida',
            ])
            ->findOrFail($id);

        return Inertia::render('AlmacenCentral/Inventario/Show', [
            'inventario' => [
                'id' => $inventario->id,
                'producto' => $inventario->producto,
                'stock_actual' => $inventario->stock_actual,
                'stock_minimo' => $inventario->stock_minimo,
                'precio_unitario' => $inventario->precio_unitario,
                'precio_total' => $inventario->precio_total,
                'bajo_minimo' => $inventario->bajoDeMinimoStock(),
                'cantidad_faltante' => $inventario->cantidadFaltante(),
                'created_at' => $inventario->created_at,
                'updated_at' => $inventario->updated_at,
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        if (!auth()->user()->puedeEditar('inventario-central')) {
            abort(403, 'No tienes permiso para editar inventario');
        }

        $inventario = InventarioAlmacenCentral::findOrFail($id);

        $validated = $request->validate([
            'stock_minimo' => 'required|numeric|min:0',
        ]);

        $inventario->update([
            'stock_minimo' => $validated['stock_minimo'],
        ]);

        return back()->with('success', 'Stock mínimo actualizado exitosamente');
    }

    // Reporte de valorización
    public function valorizacion()
    {
        if (!auth()->user()->puedeVer('inventario-central')) {
            abort(403, 'No tienes permiso para ver inventario');
        }

        $inventarios = InventarioAlmacenCentral::with([
                'producto.categoria',
                'producto.unidadBase',
            ])
            ->where('stock_actual', '>', 0)
            ->orderBy('precio_total', 'desc')
            ->get()
            ->map(function ($inventario) {
                return [
                    'producto' => [
                        'nombre' => $inventario->producto->nombre,
                        'categoria' => $inventario->producto->categoria->nombre,
                        'unidad_base' => $inventario->producto->unidadBase->abreviatura,
                    ],
                    'stock_actual' => $inventario->stock_actual,
                    'precio_unitario' => $inventario->precio_unitario,
                    'precio_total' => $inventario->precio_total,
                ];
            });

        $totales = [
            'total_productos' => $inventarios->count(),
            'valor_total' => $inventarios->sum('precio_total'),
        ];

        return Inertia::render('AlmacenCentral/Inventario/Valorizacion', [
            'inventarios' => $inventarios,
            'totales' => $totales,
        ]);
    }

    // Productos sin stock
    public function sinStock()
    {
        if (!auth()->user()->puedeVer('inventario-central')) {
            abort(403, 'No tienes permiso para ver inventario');
        }

        $inventarios = InventarioAlmacenCentral::with([
                'producto.categoria',
                'producto.unidadBase',
            ])
            ->where('stock_actual', '<=', 0)
            ->get();

        return Inertia::render('AlmacenCentral/Inventario/SinStock', [
            'inventarios' => [
                'data' => $inventarios,
                'total' => $inventarios->count(),
            ],
        ]);
    }

    // Productos bajo stock mínimo
    public function bajoStockMinimo()
    {
        if (!auth()->user()->puedeVer('inventario-central')) {
            abort(403, 'No tienes permiso para ver inventario');
        }

        $inventarios = InventarioAlmacenCentral::with([
                'producto.categoria',
                'producto.unidadBase',
            ])
            ->bajoStockMinimo()
            ->get()
            ->map(function ($inventario) {
                return [
                    'id' => $inventario->id,
                    'producto' => [
                        'nombre' => $inventario->producto->nombre,
                        'categoria' => $inventario->producto->categoria->nombre,
                        'unidad_base' => $inventario->producto->unidadBase->abreviatura,
                    ],
                    'stock_actual' => $inventario->stock_actual,
                    'stock_minimo' => $inventario->stock_minimo,
                    'cantidad_faltante' => $inventario->cantidadFaltante(),
                ];
            });

        return Inertia::render('AlmacenCentral/Inventario/BajoStock', [
            'inventarios' => [
                'data' => $inventarios,
                'total' => $inventarios->count(),
            ],
        ]);
    }

    // Ajuste manual (solo para casos especiales - requiere auditoría)
    public function ajustar(Request $request, $id)
    {
        if (!auth()->user()->puedeEditar('inventario-central')) {
            abort(403, 'No tienes permiso para ajustar inventario');
        }

        $validated = $request->validate([
            'stock_nuevo' => 'required|numeric|min:0',
            'motivo' => 'required|string',
        ]);

        $inventario = InventarioAlmacenCentral::findOrFail($id);

        // Guardar el ajuste en una tabla de auditoría (por implementar)
        // TODO: Crear tabla ajustes_inventario con motivo, usuario, stock_anterior, stock_nuevo

        $inventario->update([
            'stock_actual' => $validated['stock_nuevo'],
        ]);

        return back()->with('success', 'Inventario ajustado exitosamente');
    }
}