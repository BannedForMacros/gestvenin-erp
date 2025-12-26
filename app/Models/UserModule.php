<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserModule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'module_id',
        'accion',
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
     * Relación con User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con Module
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}