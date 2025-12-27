export default function ResumenRequerimiento({ totales }) {
    return (
        <div className="rounded-lg bg-gradient-to-r from-primary-50 to-blue-50 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="text-sm text-gray-600">Total de Items</div>
                    <div className="text-3xl font-bold text-gray-900">
                        {totales.total_items}
                    </div>
                    <div className="text-xs text-gray-500">Productos diferentes</div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="text-sm text-gray-600">Monto Total</div>
                    <div className="text-3xl font-bold text-primary-600">
                        S/ {parseFloat(totales.monto_total).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Costo estimado del requerimiento</div>
                </div>
            </div>
        </div>
    );
}