import { router } from '@inertiajs/react';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import ActionButtons from '@/Components/ActionButtons';

export default function TablaInventario({ inventarios, permisos, onEdit }) {
    const columns = [
        {
            key: 'producto',
            label: 'Producto',
            sortable: true,
            render: (inv) => (
                <div>
                    <div className="font-semibold text-gray-900">{inv.producto.nombre}</div>
                    <div className="text-sm text-gray-500">{inv.producto.categoria?.nombre}</div>
                </div>
            ),
        },
        {
            key: 'stock_actual',
            label: 'Stock Actual',
            sortable: true,
            render: (inv) => (
                <div className="text-center">
                    <div className={`text-base font-semibold ${inv.bajo_minimo ? 'text-red-600' : 'text-gray-900'}`}>
                        {inv.stock_actual} {inv.producto.unidad_base?.abreviatura}
                    </div>
                    {inv.bajo_minimo && (
                        <div className="text-xs text-red-600">
                            Faltan: {inv.cantidad_faltante}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'stock_minimo',
            label: 'Stock Mínimo',
            sortable: true,
            render: (inv) => (
                <div className="text-center text-gray-700">
                    {inv.stock_minimo} {inv.producto.unidad_base?.abreviatura}
                </div>
            ),
        },
        {
            key: 'precio_unitario',
            label: 'Precio Unit.',
            sortable: true,
            render: (inv) => (
                <div className="text-right text-gray-900">
                    S/ {parseFloat(inv.precio_unitario).toFixed(2)}
                </div>
            ),
        },
        {
            key: 'precio_total',
            label: 'Valorización',
            sortable: true,
            render: (inv) => (
                <div className="text-right font-semibold text-gray-900">
                    S/ {parseFloat(inv.precio_total).toFixed(2)}
                </div>
            ),
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (inv) => (
                inv.bajo_minimo ? (
                    <Badge variant="danger">Bajo Mínimo</Badge>
                ) : (
                    <Badge variant="success">Normal</Badge>
                )
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (inv) => (
                <ActionButtons>
                    <ActionButtons.Button
                        type="view"
                        onClick={() => router.visit(route('almacen-central.inventario.show', inv.id))}
                    />
                    {permisos.puede_editar && (
                        <ActionButtons.Button
                            type="edit"
                            onClick={() => onEdit(inv)}
                        />
                    )}
                </ActionButtons>
            ),
        },
    ];

    return (
        <Table
            data={inventarios}
            columns={columns}
            searchPlaceholder="Buscar productos..."
        />
    );
}