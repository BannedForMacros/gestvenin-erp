<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventarioAlmacenCentral extends Model
{
    protected $table = 'inventario_almacen_central';

    protected $fillable = [
        'producto_id',
        'stock_actual',
        'stock_minimo',
        'precio_unitario',
        'precio_total',
    ];

    protected $casts = [
        'stock_actual' => 'decimal:2',
        'stock_minimo' => 'decimal:2',
        'precio_unitario' => 'decimal:2',
        'precio_total' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        
        // Calcular precio_total automáticamente antes de guardar
        static::saving(function ($inventario) {
            $inventario->precio_total = $inventario->stock_actual * $inventario->precio_unitario;
        });
    }

    // Relación: Producto
    public function producto()
    {
        return $this->belongsTo(ProductoAlmacen::class, 'producto_id');
    }

    // Helper: Actualizar stock (entrada)
    public function agregarStock($cantidad, $precioUnitarioNuevo)
    {
        // Calcular promedio ponderado
        $valorActual = $this->stock_actual * $this->precio_unitario;
        $valorNuevo = $cantidad * $precioUnitarioNuevo;
        $stockTotal = $this->stock_actual + $cantidad;
        
        if ($stockTotal > 0) {
            $this->precio_unitario = ($valorActual + $valorNuevo) / $stockTotal;
        }
        
        $this->stock_actual = $stockTotal;
        $this->save();
    }

    // Helper: Reducir stock (salida)
    public function reducirStock($cantidad)
    {
        if ($this->stock_actual < $cantidad) {
            throw new \Exception("Stock insuficiente. Disponible: {$this->stock_actual}, Solicitado: {$cantidad}");
        }
        
        $this->stock_actual -= $cantidad;
        $this->save();
    }

    // Helper: Verificar si está por debajo del mínimo
    public function bajoDeMinimoStock()
    {
        return $this->stock_actual < $this->stock_minimo;
    }

    // Helper: Cantidad faltante para llegar al mínimo
    public function cantidadFaltante()
    {
        $faltante = $this->stock_minimo - $this->stock_actual;
        return $faltante > 0 ? $faltante : 0;
    }

    // Scope: Productos bajo stock mínimo
    public function scopeBajoStockMinimo($query)
    {
        return $query->whereRaw('stock_actual < stock_minimo');
    }

    // Scope: Por producto
    public function scopeProducto($query, $productoId)
    {
        return $query->where('producto_id', $productoId);
    }
}