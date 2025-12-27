import { Trash2 } from 'lucide-react';

export default function TablaDetalles({ detalles, onEliminar, readOnly = false }) {
    if (detalles.length === 0) {
        return (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">No hay productos agregados</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
                <thead className="bg-gray-900">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-white">
                            Producto
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-white">
                            Cantidad Solicitada
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-white">
                            Cantidad Base
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold uppercase tracking-wider text-white">
                            Precio Unit.
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold uppercase tracking-wider text-white">
                            Subtotal
                        </th>
                        {!readOnly && (
                            <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                Acciones
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {detalles.map((detalle, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="font-semibold text-gray-900">
                                    {detalle.producto?.nombre || 'Producto'}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {detalle.producto?.categoria?.nombre}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <div className="font-semibold text-gray-900">
                                    {detalle.cantidad_solicitada} {detalle.unidad_medida?.abreviatura}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">
                                {detalle.cantidad_unidad_base} {detalle.producto?.unidad_base?.abreviatura}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900">
                                S/ {parseFloat(detalle.precio_unitario).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                S/ {parseFloat(detalle.precio_total).toFixed(2)}
                            </td>
                            {!readOnly && (
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => onEliminar(index)}
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}