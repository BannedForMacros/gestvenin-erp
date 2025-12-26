<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Module extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombre',
        'slug',
        'icono',
        'ruta',
        'parent_id',
        'orden',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relación con Módulo Padre
     */
    public function parent()
    {
        return $this->belongsTo(Module::class, 'parent_id');
    }

    /**
     * Relación con Módulos Hijos
     */
    public function children()
    {
        return $this->hasMany(Module::class, 'parent_id')->orderBy('orden');
    }

    /**
     * Relación muchos a muchos con Roles
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_modules')
            ->withPivot('puede_ver', 'puede_crear', 'puede_editar', 'puede_eliminar', 'activo')
            ->withTimestamps();
    }

    /**
     * Relación con RoleModules
     */
    public function roleModules()
    {
        return $this->hasMany(RoleModule::class);
    }

    /**
     * Relación con UserModules
     */
    public function userModules()
    {
        return $this->hasMany(UserModule::class);
    }

    /**
     * Scope para obtener solo módulos padres
     */
    public function scopePadres($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope para obtener solo módulos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true)->whereNull('deleted_at');
    }
}