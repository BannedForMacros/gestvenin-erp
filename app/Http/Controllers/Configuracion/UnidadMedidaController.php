<?php

namespace App\Http\Controllers\Configuracion;

use App\Http\Controllers\Controller;
use App\Models\UnidadMedida;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnidadMedidaController extends Controller
{
    public function index(Request $request)
    {
        if (!auth()->user()->puedeVer('unidades-medida')) {
            abort(403, 'No tienes permiso para ver unidades de medida');
        }

        $unidades = UnidadMedida::with('unidadBase')
            ->orderByRaw('unidad_base_id IS NULL DESC')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Configuracion/UnidadesMedida/Index', [
            'unidades' => [
                'data' => $unidades,
                'total' => $unidades->count(),
            ],
            'unidadesBase' => UnidadMedida::base()->activos()->get(['id', 'nombre', 'abreviatura']),
            'permisos' => [
                'puede_crear' => auth()->user()->puedeCrear('unidades-medida'),
                'puede_editar' => auth()->user()->puedeEditar('unidades-medida'),
                'puede_eliminar' => auth()->user()->puedeEliminar('unidades-medida'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->puedeCrear('unidades-medida')) {
            abort(403, 'No tienes permiso para crear unidades de medida');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'abreviatura' => 'required|string|max:20',
            'unidad_base_id' => 'nullable|exists:unidades_medida,id',
            'factor_conversion' => 'required|numeric|min:0.01',
            'descripcion' => 'nullable|string',
        ]);

        // Si no tiene unidad base, el factor debe ser 1
        if (is_null($validated['unidad_base_id'])) {
            $validated['factor_conversion'] = 1;
        }

        UnidadMedida::create($validated);

        return redirect()->route('configuracion.unidades-medida.index')
            ->with('success', 'Unidad de medida creada exitosamente');
    }

    public function update(Request $request, $id)
    {
        if (!auth()->user()->puedeEditar('unidades-medida')) {
            abort(403, 'No tienes permiso para editar unidades de medida');
        }

        $unidad = UnidadMedida::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'abreviatura' => 'required|string|max:20',
            'unidad_base_id' => 'nullable|exists:unidades_medida,id',
            'factor_conversion' => 'required|numeric|min:0.01',
            'descripcion' => 'nullable|string',
            'activo' => 'required|integer|in:0,1',
        ]);

        // Si no tiene unidad base, el factor debe ser 1
        if (is_null($validated['unidad_base_id'])) {
            $validated['factor_conversion'] = 1;
        }

        // Validar que no se asigne a sí misma como base
        if ($validated['unidad_base_id'] == $id) {
            return redirect()->route('configuracion.unidades-medida.index')
                ->with('error', 'Una unidad no puede ser su propia unidad base');
        }

        $unidad->update($validated);

        return redirect()->route('configuracion.unidades-medida.index')
            ->with('success', 'Unidad de medida actualizada exitosamente');
    }

    public function destroy($id)
    {
        if (!auth()->user()->puedeEliminar('unidades-medida')) {
            abort(403, 'No tienes permiso para eliminar unidades de medida');
        }

        $unidad = UnidadMedida::findOrFail($id);

        // Verificar que no tenga unidades derivadas
        if ($unidad->unidadesDerivadas()->count() > 0) {
            return redirect()->route('configuracion.unidades-medida.index')
                ->with('error', 'No se puede eliminar porque tiene unidades derivadas');
        }

        // Verificar que no esté en uso en productos
        if ($unidad->productos()->count() > 0) {
            return redirect()->route('configuracion.unidades-medida.index')
                ->with('error', 'No se puede eliminar porque está en uso en productos');
        }

        $unidad->update(['activo' => 0]);

        return redirect()->route('configuracion.unidades-medida.index')
            ->with('success', 'Unidad de medida eliminada exitosamente');
    }
}