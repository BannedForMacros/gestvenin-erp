<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Empresa extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ruc',
        'razon_social',
        'nombre_comercial',
        'direccion',
        'distrito',
        'provincia',
        'departamento',
        'telefono',
        'email',
        'logo',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relación con Locales
     */
    public function locales()
    {
        return $this->hasMany(Local::class);
    }

    /**
     * Relación con Usuarios
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}