<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'empresa_id',
        'role_id',
        'local_id',
        'activo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'activo' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Relación con Empresa
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    /**
     * Relación con Rol
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Relación con Local
     */
    public function local()
    {
        return $this->belongsTo(Local::class);
    }

    /**
     * Relación con Permisos Personalizados
     */
    public function userModules()
    {
        return $this->hasMany(UserModule::class);
    }

    /**
     * Verificar si el usuario puede acceder a un módulo
     */
    public function puedeVer($moduleSlug)
    {
        $module = Module::where('slug', $moduleSlug)->first();
        
        if (!$module) return false;

        // 1. Verificar permisos personalizados del usuario
        $userModule = $this->userModules()
            ->where('module_id', $module->id)
            ->where('activo', true)
            ->first();

        if ($userModule) {
            if ($userModule->accion === 'denegar') {
                return false;
            }
            return $userModule->puede_ver;
        }

        // 2. Verificar permisos del rol
        $roleModule = $this->role->roleModules()
            ->where('module_id', $module->id)
            ->where('activo', true)
            ->first();

        return $roleModule ? $roleModule->puede_ver : false;
    }

    /**
     * Verificar si el usuario puede crear en un módulo
     */
    public function puedeCrear($moduleSlug)
    {
        $module = Module::where('slug', $moduleSlug)->first();
        
        if (!$module) return false;

        $userModule = $this->userModules()
            ->where('module_id', $module->id)
            ->where('activo', true)
            ->first();

        if ($userModule) {
            if ($userModule->accion === 'denegar') {
                return false;
            }
            return $userModule->puede_crear;
        }

        $roleModule = $this->role->roleModules()
            ->where('module_id', $module->id)
            ->where('activo', true)
            ->first();

        return $roleModule ? $roleModule->puede_crear : false;
    }

    /**
     * Verificar si el usuario puede editar en un módulo
     */
    public function puedeEditar($moduleSlug)
    {
        $module = Module::where('slug', $moduleSlug)->first();
        
        if (!$module) return false;

        $userModule = $this->userModules()
            ->where('module_id', $module->id)
            ->where('activo', true)
            ->first();

        if ($userModule) {
            if ($userModule->accion === 'denegar') {
                return false;
            }
            return $userModule->puede_editar;
        }

        $roleModule = $this->role->roleModules()
            ->where('module_id', $module->id)
            ->where('activo', true)
            ->first();

        return $roleModule ? $roleModule->puede_editar : false;
    }

    /**
     * Verificar si el usuario puede eliminar en un módulo
     */
    public function puedeEliminar($moduleSlug)
    {
        $module = Module::where('slug', $moduleSlug)->first();
        
        if (!$module) return false;

        $userModule = $this->userModules()
            ->where('module_id', $module->id)
            ->where('activo', true)
            ->first();

        if ($userModule) {
            if ($userModule->accion === 'denegar') {
                return false;
            }
            return $userModule->puede_eliminar;
        }

        $roleModule = $this->role->roleModules()
            ->where('module_id', $module->id)
            ->where('activo', true)
            ->first();

        return $roleModule ? $roleModule->puede_eliminar : false;
    }

    /**
     * Obtener módulos que el usuario puede ver
     */
    public function getModulosDisponibles()
    {
        // Si es rol global, obtiene todos los módulos
        if ($this->role && $this->role->es_global) {
            return Module::where('activo', true)
                ->whereNull('deleted_at')
                ->orderBy('orden')
                ->get();
        }

        // Obtener módulos del rol
        $moduleIdsFromRole = $this->role->roleModules()
            ->where('puede_ver', true)
            ->where('activo', true)
            ->pluck('module_id');

        // Obtener módulos permitidos personalizados
        $moduleIdsPermitidos = $this->userModules()
            ->where('accion', 'permitir')
            ->where('puede_ver', true)
            ->where('activo', true)
            ->pluck('module_id');

        // Obtener módulos denegados personalizados
        $moduleIdsDenegados = $this->userModules()
            ->where('accion', 'denegar')
            ->where('activo', true)
            ->pluck('module_id');

        // Combinar: (rol + permitidos) - denegados
        $finalModuleIds = $moduleIdsFromRole
            ->merge($moduleIdsPermitidos)
            ->diff($moduleIdsDenegados)
            ->unique();

        return Module::whereIn('id', $finalModuleIds)
            ->where('activo', true)
            ->whereNull('deleted_at')
            ->orderBy('orden')
            ->get();
    }
}