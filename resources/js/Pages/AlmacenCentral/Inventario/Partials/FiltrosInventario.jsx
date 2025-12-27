import Select from '@/Components/Select';

export default function FiltrosInventario({ 
    filters, 
    categorias,
    onFilterCategoria,
    onFilterBajoStock,
}) {
    const categoriaOptions = [
        { value: '', label: 'Todas las categorías' },
        ...categorias.map(cat => ({
            value: cat.id,
            label: cat.nombre,
        })),
    ];

    return (
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Categoría
                    </label>
                    <Select
                        value={filters.categoria_id}
                        onChange={(e) => onFilterCategoria(e.target.value)}
                        options={categoriaOptions}
                    />
                </div>
                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.bajo_stock}
                            onChange={(e) => onFilterBajoStock(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-base text-gray-700">
                            Solo productos bajo stock mínimo
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}