import Select from '@/Components/Select';

export default function FiltrosRequerimientos({ filters, onFilterEstado }) {
    const estadoOptions = [
        { value: '', label: 'Todos los estados' },
        { value: 'borrador', label: 'Borrador' },
        { value: 'enviado', label: 'Enviado' },
        { value: 'validado', label: 'Validado' },
        { value: 'rechazado', label: 'Rechazado' },
        { value: 'comprado', label: 'Comprado' },
    ];

    return (
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Estado
                    </label>
                    <Select
                        value={filters.estado}
                        onChange={(e) => onFilterEstado(e.target.value)}
                        options={estadoOptions}
                    />
                </div>
            </div>
        </div>
    );
}