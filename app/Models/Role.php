<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombre',
        'es_global',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'es_global' => 'boolean',
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relación con Usuarios
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Relación con Módulos (permisos del rol)
     */
    public function roleModules()
    {
        return $this->hasMany(RoleModule::class);
    }

    /**
     * Relación muchos a muchos con Módulos
     */
    public function modules()
    {
        return $this->belongsToMany(Module::class, 'role_modules')
            ->withPivot('puede_ver', 'puede_crear', 'puede_editar', 'puede_eliminar', 'activo')
            ->withTimestamps();
    }
}