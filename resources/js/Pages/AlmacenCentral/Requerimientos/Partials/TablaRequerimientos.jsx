import { router } from '@inertiajs/react';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import ActionButtons from '@/Components/ActionButtons';

export default function TablaRequerimientos({ requerimientos, permisos, onEliminar }) {
    const columns = [
        {
            key: 'codigo',
            label: 'Código',
            sortable: true,
            render: (req) => (
                <div className="font-mono font-semibold text-primary-600">
                    {req.codigo}
                </div>
            ),
        },
        {
            key: 'descripcion',
            label: 'Descripción',
            render: (req) => (
                <div className="max-w-xs truncate text-gray-900">
                    {req.descripcion || '-'}
                </div>
            ),
        },
        {
            key: 'total_items',
            label: 'Items',
            sortable: true,
            render: (req) => (
                <div className="text-center">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                        {req.total_items}
                    </span>
                </div>
            ),
        },
        {
            key: 'monto_requerimiento',
            label: 'Monto',
            sortable: true,
            render: (req) => (
                <div className="text-right font-semibold text-gray-900">
                    S/ {parseFloat(req.monto_requerimiento).toFixed(2)}
                </div>
            ),
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (req) => <Badge.fromStatus status={req.estado} />,
        },
        {
            key: 'created_at',
            label: 'Fecha',
            sortable: true,
            render: (req) => (
                <div className="text-sm text-gray-600">
                    {new Date(req.created_at).toLocaleDateString('es-PE')}
                </div>
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (req) => (
                <ActionButtons>
                    <ActionButtons.Button
                        type="view"
                        onClick={() => router.visit(route('almacen-central.requerimientos.show', req.id))}
                    />
                    {permisos.puede_editar && (req.estado === 'borrador' || req.estado === 'rechazado') && (
                        <ActionButtons.Button
                            type="edit"
                            onClick={() => router.visit(route('almacen-central.requerimientos.edit', req.id))}
                        />
                    )}
                    {permisos.puede_eliminar && (req.estado === 'borrador' || req.estado === 'rechazado') && (
                        <ActionButtons.Button
                            type="delete"
                            onClick={() => onEliminar(req.id)}
                        />
                    )}
                </ActionButtons>
            ),
        },
    ];

    return (
        <Table
            data={requerimientos}
            columns={columns}
            searchPlaceholder="Buscar requerimientos..."
        />
    );
}