import Badge from '@/Components/Badge';

export default function VerUnidadesModal({ producto }) {
    return (
        <div className="space-y-4">
            {/* Info del producto */}
            <div className="rounded-lg bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-600">Categoría:</span>
                        <p className="font-semibold text-gray-900">{producto.categoria?.nombre}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Unidad de Inventario:</span>
                        <p className="font-semibold text-gray-900">
                            {producto.unidad_base?.nombre} ({producto.unidad_base?.abreviatura})
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabla de unidades */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-900">
                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-white">
                                Unidad
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                Factor
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                Código Barras
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                Tipo
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {producto.unidades_medida?.length > 0 ? (
                            producto.unidades_medida.map((unidad, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-base text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{unidad.nombre}</span>
                                            <span className="text-gray-500">({unidad.abreviatura})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-base text-gray-900">
                                        <Badge variant="default">
                                            1 {unidad.abreviatura} = {unidad.pivot?.factor_conversion} {producto.unidad_base?.abreviatura}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                                        {unidad.pivot?.codigo_barras || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {unidad.pivot?.es_unidad_base === 1 ? (
                                            <Badge variant="primary">Base</Badge>
                                        ) : (
                                            <Badge variant="default">Derivada</Badge>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-16 text-center text-gray-500">
                                    No hay unidades de medida configuradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}