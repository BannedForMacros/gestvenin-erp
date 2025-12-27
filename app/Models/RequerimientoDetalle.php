<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequerimientoDetalle extends Model
{
    protected $table = 'requerimiento_detalles';

    protected $fillable = [
        'requerimiento_id',
        'producto_id',
        'unidad_medida_id',
        'cantidad_solicitada',
        'cantidad_unidad_base',
        'precio_unitario',
        'precio_total',
        'orden',
    ];

    protected $casts = [
        'cantidad_solicitada' => 'decimal:2',
        'cantidad_unidad_base' => 'decimal:2',
        'precio_unitario' => 'decimal:2',
        'precio_total' => 'decimal:2',
        'orden' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        
        // Calcular precio_total antes de guardar
        static::saving(function ($detalle) {
            $detalle->precio_total = $detalle->cantidad_unidad_base * $detalle->precio_unitario;
        });
        
        // Recalcular totales del requerimiento después de guardar
        static::saved(function ($detalle) {
            $detalle->requerimiento->recalcularTotales();
        });
        
        // Recalcular totales del requerimiento después de eliminar
        static::deleted(function ($detalle) {
            $detalle->requerimiento->recalcularTotales();
        });
    }

    // Relación: Requerimiento
    public function requerimiento()
    {
        return $this->belongsTo(Requerimiento::class, 'requerimiento_id');
    }

    // Relación: Producto
    public function producto()
    {
        return $this->belongsTo(ProductoAlmacen::class, 'producto_id');
    }

    // Relación: Unidad de medida
    public function unidadMedida()
    {
        return $this->belongsTo(UnidadMedida::class, 'unidad_medida_id');
    }

    // Helper: Calcular cantidad en unidad base
    public static function calcularCantidadBase($cantidadSolicitada, $unidadMedidaId)
    {
        $unidad = UnidadMedida::findOrFail($unidadMedidaId);
        return $cantidadSolicitada * $unidad->factor_conversion;
    }

    // Helper: Obtener precio del inventario o usar manual
    public static function obtenerPrecioUnitario($productoId, $precioManual = null)
    {
        // Si hay precio manual, usarlo
        if ($precioManual !== null && $precioManual > 0) {
            return $precioManual;
        }

        // Intentar obtener del inventario
        $inventario = InventarioAlmacenCentral::where('producto_id', $productoId)->first();
        
        if ($inventario && $inventario->precio_unitario > 0) {
            return $inventario->precio_unitario;
        }

        // Si no hay inventario, retornar 0
        return 0;
    }

    // Accessor: Nombre completo con unidad
    public function getDescripcionCompletaAttribute()
    {
        return "{$this->cantidad_solicitada} {$this->unidadMedida->abreviatura} ({$this->cantidad_unidad_base} {$this->producto->unidadBase->abreviatura})";
    }
}