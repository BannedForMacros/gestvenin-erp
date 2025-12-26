<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleModule extends Model
{
    use HasFactory;

    protected $fillable = [
        'role_id',
        'module_id',
        'puede_ver',
        'puede_crear',
        'puede_editar',
        'puede_eliminar',
        'activo',
    ];

    protected $casts = [
        'puede_ver' => 'boolean',
        'puede_crear' => 'boolean',
        'puede_editar' => 'boolean',
        'puede_eliminar' => 'boolean',
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con Role
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Relación con Module
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}