<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductoAlmacen extends Model
{
    protected $table = 'productos_almacen';

    protected $fillable = [
        'nombre',
        'descripcion',
        'categoria_id',
        'unidad_base_id',
        'activo',
    ];

    protected $casts = [
        'activo' => 'integer',
    ];

    // Relación: Categoría
    public function categoria()
    {
        return $this->belongsTo(CategoriaProducto::class, 'categoria_id');
    }

    // Relación: Unidad Base
    public function unidadBase()
    {
        return $this->belongsTo(UnidadMedida::class, 'unidad_base_id');
    }

    // Relación: Unidades de medida disponibles para este producto
    public function unidadesMedida()
    {
        return $this->belongsToMany(UnidadMedida::class, 'producto_unidades', 'producto_id', 'unidad_medida_id')
            ->withPivot('codigo_barras', 'es_unidad_base', 'activo')
            ->withTimestamps();
    }

    // Scope: Solo activos
    public function scopeActivos($query)
    {
        return $query->where('activo', 1);
    }

    // Scope: Por categoría
    public function scopeCategoria($query, $categoriaId)
    {
        return $query->where('categoria_id', $categoriaId);
    }

    // Scope: Búsqueda por nombre
    public function scopeBuscar($query, $termino)
    {
        return $query->where('nombre', 'ILIKE', "%{$termino}%");
    }

    // Helper: Convertir cantidad de unidad específica a base
    public function convertirAUnidadBase($cantidad, $unidadMedidaId)
    {
        $unidad = UnidadMedida::findOrFail($unidadMedidaId);
        return $cantidad * $unidad->factor_conversion;
    }

    // Helper: Convertir de unidad base a unidad específica
    public function convertirDesdeUnidadBase($cantidadBase, $unidadMedidaId)
    {
        $unidad = UnidadMedida::findOrFail($unidadMedidaId);
        
        if ($unidad->factor_conversion == 0) {
            return 0;
        }
        
        return $cantidadBase / $unidad->factor_conversion;
    }

    // Helper: Obtener unidad base del producto (marcada en pivot)
    public function getUnidadBaseProducto()
    {
        return $this->unidadesMedida()->wherePivot('es_unidad_base', 1)->first();
    }

    // Helper: Agregar unidad de medida al producto
    public function agregarUnidadMedida($unidadMedidaId, $codigoBarras = null, $esUnidadBase = false)
    {
        // Si es unidad base, desmarcar las demás
        if ($esUnidadBase) {
            \DB::table('producto_unidades')
                ->where('producto_id', $this->id)
                ->update(['es_unidad_base' => 0]);
        }

        $this->unidadesMedida()->attach($unidadMedidaId, [
            'codigo_barras' => $codigoBarras,
            'es_unidad_base' => $esUnidadBase ? 1 : 0,
            'activo' => 1,
        ]);
    }

    // Helper: Actualizar unidad de medida del producto
    public function actualizarUnidadMedida($unidadMedidaId, $codigoBarras = null, $esUnidadBase = false)
    {
        // Si es unidad base, desmarcar las demás
        if ($esUnidadBase) {
            \DB::table('producto_unidades')
                ->where('producto_id', $this->id)
                ->update(['es_unidad_base' => 0]);
        }

        $this->unidadesMedida()->updateExistingPivot($unidadMedidaId, [
            'codigo_barras' => $codigoBarras,
            'es_unidad_base' => $esUnidadBase ? 1 : 0,
        ]);
    }

    // Relación: Inventario
    public function inventario()
    {
        return $this->hasOne(InventarioAlmacenCentral::class, 'producto_id');
    }

    // Helper: Obtener o crear inventario
    public function obtenerOCrearInventario()
    {
        return $this->inventario()->firstOrCreate(
            ['producto_id' => $this->id],
            [
                'stock_actual' => 0,
                'stock_minimo' => 0,
                'precio_unitario' => 0,
                'precio_total' => 0,
            ]
        );
    }
}