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
            ->withPivot('factor_conversion', 'codigo_barras', 'es_unidad_base', 'activo')
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
        $unidad = $this->unidadesMedida()->where('unidad_medida_id', $unidadMedidaId)->first();
        
        if (!$unidad) {
            throw new \Exception("Unidad de medida no configurada para este producto");
        }
        
        return $cantidad * $unidad->pivot->factor_conversion;
    }

    // Helper: Convertir de unidad base a unidad específica
    public function convertirDesdeUnidadBase($cantidadBase, $unidadMedidaId)
    {
        $unidad = $this->unidadesMedida()->where('unidad_medida_id', $unidadMedidaId)->first();
        
        if (!$unidad) {
            throw new \Exception("Unidad de medida no configurada para este producto");
        }
        
        if ($unidad->pivot->factor_conversion == 0) {
            return 0;
        }
        
        return $cantidadBase / $unidad->pivot->factor_conversion;
    }

    // Helper: Obtener unidad base del producto
    public function getUnidadBaseProducto()
    {
        return $this->unidadesMedida()->wherePivot('es_unidad_base', 1)->first();
    }

    // Helper: Agregar unidad de medida al producto
    public function agregarUnidadMedida($unidadMedidaId, $factorConversion, $codigoBarras = null, $esUnidadBase = false)
    {
        // Si es unidad base, desmarcar las demás
        if ($esUnidadBase) {
            $this->unidadesMedida()->update(['es_unidad_base' => 0]);
        }

        $this->unidadesMedida()->attach($unidadMedidaId, [
            'factor_conversion' => $factorConversion,
            'codigo_barras' => $codigoBarras,
            'es_unidad_base' => $esUnidadBase ? 1 : 0,
            'activo' => 1,
        ]);
    }

    // Helper: Actualizar unidad de medida del producto
    public function actualizarUnidadMedida($unidadMedidaId, $factorConversion, $codigoBarras = null, $esUnidadBase = false)
    {
        // Si es unidad base, desmarcar las demás
        if ($esUnidadBase) {
            $this->unidadesMedida()->updateExistingPivot(
                $this->unidadesMedida()->pluck('id')->toArray(),
                ['es_unidad_base' => 0]
            );
        }

        $this->unidadesMedida()->updateExistingPivot($unidadMedidaId, [
            'factor_conversion' => $factorConversion,
            'codigo_barras' => $codigoBarras,
            'es_unidad_base' => $esUnidadBase ? 1 : 0,
        ]);
    }
}