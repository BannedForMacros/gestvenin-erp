<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Local extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'locales';

    protected $fillable = [
        'empresa_id',
        'nombre',
        'direccion',
        'distrito',
        'provincia',
        'departamento',
        'telefono',
        'permite_mesas',
        'activo',
    ];

    protected $casts = [
        'permite_mesas' => 'boolean',
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Relación con Empresa
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    /**
     * Relación con Usuarios
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}