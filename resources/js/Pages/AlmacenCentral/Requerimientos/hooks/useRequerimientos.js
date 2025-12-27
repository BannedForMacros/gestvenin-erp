import { useState } from 'react';
import { router } from '@inertiajs/react';

export function useRequerimientos(initialFilters = {}) {
    const [filters, setFilters] = useState({
        estado: initialFilters.estado || '',
    });

    const handleFilterEstado = (estado) => {
        setFilters({ estado });
        
        router.get(route('almacen-central.requerimientos.index'), {
            estado: estado,
        }, {
            preserveState: true,
        });
    };

    const handleEnviar = (requerimientoId) => {
        if (confirm('¿Está seguro de enviar este requerimiento?')) {
            router.post(route('almacen-central.requerimientos.enviar', requerimientoId));
        }
    };

    const handleAprobar = (requerimientoId, observacion = null) => {
        router.post(route('almacen-central.requerimientos.aprobar', requerimientoId), {
            observacion: observacion,
        });
    };

    const handleRechazar = (requerimientoId, observacion) => {
        if (!observacion || observacion.trim() === '') {
            alert('Debe proporcionar una observación para rechazar');
            return;
        }

        router.post(route('almacen-central.requerimientos.rechazar', requerimientoId), {
            observacion: observacion,
        });
    };

    const handleGenerarAutomatico = () => {
        if (confirm('¿Desea generar un requerimiento automático basado en productos bajo stock mínimo?')) {
            router.post(route('almacen-central.requerimientos.generar-automatico'));
        }
    };

    const handleEliminar = (requerimientoId) => {
        if (confirm('¿Está seguro de eliminar este requerimiento?')) {
            router.delete(route('almacen-central.requerimientos.destroy', requerimientoId));
        }
    };

    return {
        filters,
        handleFilterEstado,
        handleEnviar,
        handleAprobar,
        handleRechazar,
        handleGenerarAutomatico,
        handleEliminar,
    };
}