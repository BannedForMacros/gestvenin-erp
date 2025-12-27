<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoriaProducto extends Model
{
    protected $table = 'categorias_productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'integer',
    ];

    // Relación: Productos de esta categoría
    public function productos()
    {
        return $this->hasMany(ProductoAlmacen::class, 'categoria_id');
    }

    // Scope: Solo activos
    public function scopeActivos($query)
    {
        return $query->where('activo', 1);
    }
}