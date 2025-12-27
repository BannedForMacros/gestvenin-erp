<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductoUnidad extends Pivot
{
    protected $table = 'producto_unidades';

    protected $fillable = [
        'producto_id',
        'unidad_medida_id',
        'factor_conversion',
        'codigo_barras',
        'es_unidad_base',
        'activo',
    ];

    protected $casts = [
        'factor_conversion' => 'decimal:4',
        'es_unidad_base' => 'integer',
        'activo' => 'integer',
    ];

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
}