import { useState } from 'react';
import { router } from '@inertiajs/react';

export function useInventario(initialFilters = {}) {
    const [filters, setFilters] = useState({
        categoria_id: initialFilters.categoria_id || '',
        bajo_stock: initialFilters.bajo_stock || false,
    });

    const handleFilterCategoria = (categoriaId) => {
        const newFilters = { ...filters, categoria_id: categoriaId };
        setFilters(newFilters);
        
        router.get(route('almacen-central.inventario.index'), {
            categoria_id: categoriaId,
            bajo_stock: newFilters.bajo_stock ? 1 : null,
        }, {
            preserveState: true,
        });
    };

    const handleFilterBajoStock = (value) => {
        const newFilters = { ...filters, bajo_stock: value };
        setFilters(newFilters);
        
        router.get(route('almacen-central.inventario.index'), {
            categoria_id: newFilters.categoria_id,
            bajo_stock: value ? 1 : null,
        }, {
            preserveState: true,
        });
    };

    const clearFilters = () => {
        setFilters({
            categoria_id: '',
            bajo_stock: false,
        });
        
        router.get(route('almacen-central.inventario.index'));
    };

    return {
        filters,
        handleFilterCategoria,
        handleFilterBajoStock,
        clearFilters,
    };
}