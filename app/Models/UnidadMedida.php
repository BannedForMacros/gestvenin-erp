<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnidadMedida extends Model
{
    protected $table = 'unidades_medida';

    protected $fillable = [
        'nombre',
        'abreviatura',
        'unidad_base_id',
        'factor_conversion',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'factor_conversion' => 'decimal:4',
        'activo' => 'integer',
    ];

    // Relación: Unidad Base (recursiva)
    public function unidadBase()
    {
        return $this->belongsTo(UnidadMedida::class, 'unidad_base_id');
    }

    // Relación: Unidades derivadas de esta
    public function unidadesDerivadas()
    {
        return $this->hasMany(UnidadMedida::class, 'unidad_base_id');
    }

    // Relación: Productos que usan esta unidad
    public function productos()
    {
        return $this->belongsToMany(ProductoAlmacen::class, 'producto_unidades', 'unidad_medida_id', 'producto_id')
            ->withPivot('factor_conversion', 'codigo_barras', 'es_unidad_base', 'activo')
            ->withTimestamps();
    }

    // Scope: Solo activos
    public function scopeActivos($query)
    {
        return $query->where('activo', 1);
    }

    // Scope: Solo unidades base
    public function scopeBase($query)
    {
        return $query->whereNull('unidad_base_id');
    }

    // Helper: Es unidad base
    public function esBase()
    {
        return is_null($this->unidad_base_id);
    }

    // Helper: Convertir cantidad a unidad base
    public function convertirABase($cantidad)
    {
        if ($this->esBase()) {
            return $cantidad;
        }
        
        return $cantidad * $this->factor_conversion;
    }

    // Atributo: Nombre completo con factor
    public function getNombreCompletoAttribute()
    {
        if ($this->esBase()) {
            return $this->nombre;
        }
        
        return "{$this->nombre} ({$this->factor_conversion} {$this->unidadBase->abreviatura})";
    }
}