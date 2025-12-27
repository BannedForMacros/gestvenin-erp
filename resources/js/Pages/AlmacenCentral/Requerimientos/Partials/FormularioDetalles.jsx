import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Select from '@/Components/Select';
import Button from '@/Components/Button';

export default function FormularioDetalles({ 
    productos, 
    detalleTemp, 
    setDetalleTemp, 
    onAgregar 
}) {
    const productoSeleccionado = productos.find(p => p.id === parseInt(detalleTemp.producto_id));
    
    // Auto-cargar precio del inventario cuando selecciona producto
    useEffect(() => {
        if (productoSeleccionado && productoSeleccionado.inventario) {
            setDetalleTemp(prev => ({
                ...prev,
                precio_unitario: productoSeleccionado.inventario.precio_unitario || '',
            }));
        }
    }, [productoSeleccionado]);

    // Limpiar unidad cuando cambia el producto
    useEffect(() => {
        setDetalleTemp(prev => ({
            ...prev,
            unidad_medida_id: '',
        }));
    }, [detalleTemp.producto_id]);

    const productoOptions = productos.map(prod => ({
        value: prod.id,
        label: `${prod.nombre} - ${prod.categoria?.nombre}`,
    }));

    // ✅ CORRECCIÓN: Labels más cortos
    const unidadOptions = productoSeleccionado?.unidades_medida?.map(unidad => ({
        value: unidad.id,
        label: `${unidad.nombre} (${unidad.abreviatura}) - ${unidad.factor_conversion} ${productoSeleccionado.unidad_base?.abreviatura}`,
    })) || [];

    return (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Agregar Producto</h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                {/* Producto */}
                <div className="md:col-span-4">
                    <Label htmlFor="producto" value="Producto" required />
                    <Select
                        id="producto"
                        value={detalleTemp.producto_id}
                        onChange={(e) => setDetalleTemp({ ...detalleTemp, producto_id: e.target.value })}
                        options={productoOptions}
                        placeholder="Seleccionar producto"
                    />
                </div>

                {/* Unidad de Medida */}
                <div className="md:col-span-3">
                    <Label htmlFor="unidad" value="Unidad" required />
                    <Select
                        id="unidad"
                        value={detalleTemp.unidad_medida_id}
                        onChange={(e) => setDetalleTemp({ ...detalleTemp, unidad_medida_id: e.target.value })}
                        options={unidadOptions}
                        placeholder="Seleccionar"
                        disabled={!detalleTemp.producto_id}
                    />
                </div>

                {/* Cantidad */}
                <div className="md:col-span-2">
                    <Label htmlFor="cantidad" value="Cantidad" required />
                    <Input
                        id="cantidad"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={detalleTemp.cantidad_solicitada}
                        onChange={(e) => setDetalleTemp({ ...detalleTemp, cantidad_solicitada: e.target.value })}
                        placeholder="0"
                    />
                </div>

                {/* Precio Unitario */}
                <div className="md:col-span-2">
                    <Label htmlFor="precio" value="Precio Unit." />
                    <Input
                        id="precio"
                        type="number"
                        step="0.01"
                        min="0"
                        value={detalleTemp.precio_unitario}
                        onChange={(e) => setDetalleTemp({ ...detalleTemp, precio_unitario: e.target.value })}
                        placeholder="Auto"
                    />
                    <p className="mt-1 text-xs text-gray-500">Del inventario</p>
                </div>

                {/* Botón Agregar */}
                <div className="flex items-end md:col-span-1">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={onAgregar}
                        className="w-full"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Info del Producto Seleccionado */}
            {productoSeleccionado && (
                <div className="mt-4 rounded-lg bg-blue-50 p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-600">Categoría:</span>
                            <span className="ml-2 font-semibold text-gray-900">
                                {productoSeleccionado.categoria?.nombre}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Unidad Base:</span>
                            <span className="ml-2 font-semibold text-gray-900">
                                {productoSeleccionado.unidad_base?.nombre}
                            </span>
                        </div>
                        {productoSeleccionado.inventario && (
                            <>
                                <div>
                                    <span className="text-gray-600">Stock Actual:</span>
                                    <span className="ml-2 font-semibold text-gray-900">
                                        {productoSeleccionado.inventario.stock_actual} {productoSeleccionado.unidad_base?.abreviatura}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Precio Inventario:</span>
                                    <span className="ml-2 font-semibold text-gray-900">
                                        S/ {parseFloat(productoSeleccionado.inventario.precio_unitario).toFixed(2)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}