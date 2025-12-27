<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Requerimiento extends Model
{
    protected $table = 'requerimientos';

    protected $fillable = [
        'codigo',
        'descripcion',
        'estado',
        'enviado_por',
        'fecha_envio',
        'validado_por',
        'estado_validacion',
        'fecha_validacion',
        'observacion_validacion',
        'comprado_por',
        'fecha_compra',
        'total_items',
        'monto_requerimiento',
    ];

    protected $casts = [
        'fecha_envio' => 'datetime',
        'fecha_validacion' => 'datetime',
        'fecha_compra' => 'datetime',
        'total_items' => 'integer',
        'monto_requerimiento' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        
        // Generar código automáticamente al crear
        static::creating(function ($requerimiento) {
            if (empty($requerimiento->codigo)) {
                $requerimiento->codigo = static::generarCodigo();
            }
        });
    }

    // Relación: Usuario que envió
    public function usuarioEnviado()
    {
        return $this->belongsTo(User::class, 'enviado_por');
    }

    // Relación: Usuario que validó
    public function usuarioValidado()
    {
        return $this->belongsTo(User::class, 'validado_por');
    }

    // Relación: Usuario que registró la compra
    public function usuarioComprado()
    {
        return $this->belongsTo(User::class, 'comprado_por');
    }

    // Relación: Detalles del requerimiento
    public function detalles()
    {
        return $this->hasMany(RequerimientoDetalle::class, 'requerimiento_id')->orderBy('orden');
    }

    // Helper: Generar código único
    public static function generarCodigo()
    {
        $fecha = now()->format('Y-m-d');
        $contador = static::whereDate('created_at', today())->count() + 1;
        return 'REQ-' . $fecha . '-' . str_pad($contador, 3, '0', STR_PAD_LEFT);
    }

    // Helper: Recalcular totales
    public function recalcularTotales()
    {
        $this->total_items = $this->detalles()->count();
        $this->monto_requerimiento = $this->detalles()->sum('precio_total');
        $this->saveQuietly(); // Sin disparar eventos
    }

    // Helper: Cambiar estado a "enviado"
    public function enviar($userId)
    {
        if ($this->estado !== 'borrador') {
            throw new \Exception('Solo se pueden enviar requerimientos en estado borrador');
        }

        $this->estado = 'enviado';
        $this->enviado_por = $userId;
        $this->fecha_envio = now();
        $this->save();
    }

    // Helper: Aprobar requerimiento
    public function aprobar($userId, $observacion = null)
    {
        if ($this->estado !== 'enviado') {
            throw new \Exception('Solo se pueden aprobar requerimientos enviados');
        }

        $this->estado = 'validado';
        $this->validado_por = $userId;
        $this->estado_validacion = 'aprobado';
        $this->fecha_validacion = now();
        $this->observacion_validacion = $observacion;
        $this->save();
    }

    // Helper: Rechazar requerimiento
    public function rechazar($userId, $observacion)
    {
        if ($this->estado !== 'enviado') {
            throw new \Exception('Solo se pueden rechazar requerimientos enviados');
        }

        if (empty($observacion)) {
            throw new \Exception('Debe proporcionar una observación al rechazar');
        }

        $this->estado = 'rechazado';
        $this->validado_por = $userId;
        $this->estado_validacion = 'rechazado';
        $this->fecha_validacion = now();
        $this->observacion_validacion = $observacion;
        $this->save();
    }

    // Helper: Marcar como comprado
    public function marcarComoComprado($userId)
    {
        if ($this->estado !== 'validado') {
            throw new \Exception('Solo se pueden marcar como comprados los requerimientos validados');
        }

        $this->estado = 'comprado';
        $this->comprado_por = $userId;
        $this->fecha_compra = now();
        $this->save();
    }

    // Scope: Por estado
    public function scopeEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    // Scope: Borradores
    public function scopeBorradores($query)
    {
        return $query->where('estado', 'borrador');
    }

    // Scope: Enviados
    public function scopeEnviados($query)
    {
        return $query->where('estado', 'enviado');
    }

    // Scope: Validados
    public function scopeValidados($query)
    {
        return $query->where('estado', 'validado');
    }

    // Scope: Rechazados
    public function scopeRechazados($query)
    {
        return $query->where('estado', 'rechazado');
    }

    // Scope: Comprados
    public function scopeComprados($query)
    {
        return $query->where('estado', 'comprado');
    }

    // Accessor: Puede editarse
    public function getPuedeEditarseAttribute()
    {
        return in_array($this->estado, ['borrador', 'rechazado']);
    }

    // Accessor: Puede enviarse
    public function getPuedeEnviarseAttribute()
    {
        return $this->estado === 'borrador' && $this->detalles()->count() > 0;
    }

    // Accessor: Puede validarse
    public function getPuedeValidarseAttribute()
    {
        return $this->estado === 'enviado';
    }
}