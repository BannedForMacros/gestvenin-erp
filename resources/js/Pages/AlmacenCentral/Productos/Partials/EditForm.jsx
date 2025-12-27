import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Select from '@/Components/Select';
import Textarea from '@/Components/Textarea';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function EditForm({ producto, categorias, unidadesBase, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        categoria_id: producto.categoria_id || '',
        unidad_base_id: producto.unidad_base_id || '',
        activo: producto.activo ?? 1,
        unidades_medida: [],
    });

    const [nuevaUnidad, setNuevaUnidad] = useState({
        unidad_medida_id: '',
        codigo_barras: '',
        es_unidad_base: false,
    });

    // Cargar unidades existentes del producto
    useEffect(() => {
        if (producto.unidades_medida && producto.unidades_medida.length > 0) {
            const unidadesFormateadas = producto.unidades_medida.map(unidad => ({
                unidad_medida_id: unidad.id,
                codigo_barras: unidad.pivot?.codigo_barras || '',
                es_unidad_base: unidad.pivot?.es_unidad_base === 1,
            }));
            setData('unidades_medida', unidadesFormateadas);
        }
    }, [producto]);

    const categoriaOptions = categorias.map(cat => ({
        value: cat.id,
        label: cat.nombre,
    }));

    const unidadBaseOptions = unidadesBase.map(unidad => ({
        value: unidad.id,
        label: `${unidad.nombre} (${unidad.abreviatura})`,
    }));

    // Actualizar unidad_base_id cuando cambian las unidades
    useEffect(() => {
        if (data.unidades_medida.length > 0) {
            const unidadBase = data.unidades_medida.find(u => u.es_unidad_base);
            if (unidadBase) {
                setData('unidad_base_id', unidadBase.unidad_medida_id);
            }
        }
    }, [data.unidades_medida]);

    const handleAgregarUnidad = () => {
        if (!nuevaUnidad.unidad_medida_id) {
            return;
        }

        // Verificar duplicados
        const yaExiste = data.unidades_medida.some(
            u => u.unidad_medida_id === nuevaUnidad.unidad_medida_id
        );

        if (yaExiste) {
            alert('Esta unidad ya fue agregada');
            return;
        }

        // Si es la primera unidad, marcarla automáticamente como base
        const esPrimeraUnidad = data.unidades_medida.length === 0;
        const esUnidadBase = esPrimeraUnidad || nuevaUnidad.es_unidad_base;

        // Si marca como unidad base, desmarcar las demás
        const unidadesActualizadas = esUnidadBase
            ? data.unidades_medida.map(u => ({ ...u, es_unidad_base: false }))
            : data.unidades_medida;

        setData('unidades_medida', [
            ...unidadesActualizadas,
            { ...nuevaUnidad, es_unidad_base: esUnidadBase },
        ]);

        // Limpiar formulario
        setNuevaUnidad({
            unidad_medida_id: '',
            codigo_barras: '',
            es_unidad_base: false,
        });
    };

    const handleEliminarUnidad = (index) => {
        const unidadEliminada = data.unidades_medida[index];
        const nuevasUnidades = data.unidades_medida.filter((_, i) => i !== index);
        
        // Si eliminamos la unidad base y quedan más, marcar la primera como base
        if (unidadEliminada.es_unidad_base && nuevasUnidades.length > 0) {
            nuevasUnidades[0].es_unidad_base = true;
        }
        
        setData('unidades_medida', nuevasUnidades);
    };

    const handleMarcarComoBase = (index) => {
        const nuevasUnidades = data.unidades_medida.map((unidad, i) => ({
            ...unidad,
            es_unidad_base: i === index,
        }));
        setData('unidades_medida', nuevasUnidades);
    };

    const getUnidadNombre = (unidadId) => {
        const unidad = unidadesBase.find(u => u.id === parseInt(unidadId));
        return unidad ? `${unidad.nombre} (${unidad.abreviatura})` : '';
    };

    const getUnidadFactor = (unidadId) => {
        const unidad = unidadesBase.find(u => u.id === parseInt(unidadId));
        return unidad ? unidad.factor_conversion : 1;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.unidades_medida.length === 0) {
            alert('Debes tener al menos una unidad de medida');
            return;
        }

        const tieneUnidadBase = data.unidades_medida.some(u => u.es_unidad_base);
        if (!tieneUnidadBase) {
            alert('Debes marcar una unidad como base');
            return;
        }

        put(route('almacen-central.productos.update', producto.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Nombre */}
                <div className="md:col-span-2">
                    <Label htmlFor="nombre" value="Nombre del Producto" required />
                    <Input
                        id="nombre"
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        error={errors.nombre}
                    />
                </div>

                {/* Categoría */}
                <div className="md:col-span-2">
                    <Label htmlFor="categoria_id" value="Categoría" required />
                    <Select
                        id="categoria_id"
                        value={data.categoria_id}
                        onChange={(e) => setData('categoria_id', e.target.value)}
                        options={categoriaOptions}
                        error={errors.categoria_id}
                    />
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                    <Label htmlFor="descripcion" value="Descripción" />
                    <Textarea
                        id="descripcion"
                        value={data.descripcion}
                        onChange={(e) => setData('descripcion', e.target.value)}
                        error={errors.descripcion}
                        rows={2}
                    />
                </div>

                {/* Estado */}
                <div className="md:col-span-2">
                    <Label value="Estado" />
                    <div className="mt-2 flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="activo"
                                checked={data.activo === 1}
                                onChange={() => setData('activo', 1)}
                                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-base text-gray-700">Activo</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="activo"
                                checked={data.activo === 0}
                                onChange={() => setData('activo', 0)}
                                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-base text-gray-700">Inactivo</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            {data.unidades_medida.length > 0 && (
                <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Unidad de Inventario:</strong> El stock se guardará en{' '}
                        <span className="font-semibold">
                            {getUnidadNombre(data.unidad_base_id)}
                        </span>
                    </p>
                </div>
            )}

            {/* Sección: Unidades de Medida */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Unidades de Medida</h3>
                
                {/* Formulario para agregar unidad */}
                <div className="mb-4 space-y-4 rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                        {/* Unidad */}
                        <div className="md:col-span-4">
                            <Label htmlFor="nueva_unidad" value="Unidad" />
                            <Select
                                id="nueva_unidad"
                                value={nuevaUnidad.unidad_medida_id}
                                onChange={(e) => setNuevaUnidad({ ...nuevaUnidad, unidad_medida_id: e.target.value })}
                                options={unidadBaseOptions}
                                placeholder="Seleccionar"
                            />
                        </div>

                        {/* Código Barras */}
                        <div className="md:col-span-1">
                            <Label htmlFor="codigo_barras" value="Código Barras" />
                            <Input
                                id="codigo_barras"
                                type="text"
                                value={nuevaUnidad.codigo_barras}
                                onChange={(e) => setNuevaUnidad({ ...nuevaUnidad, codigo_barras: e.target.value })}
                                placeholder="Opcional"
                            />
                        </div>

                        {/* Botón Agregar */}
                        <div className="flex items-end md:col-span-1">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleAgregarUnidad}
                                className="w-full"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Checkbox: Solo si NO es la primera */}
                    {data.unidades_medida.length > 0 && (
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={nuevaUnidad.es_unidad_base}
                                    onChange={(e) => setNuevaUnidad({ ...nuevaUnidad, es_unidad_base: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">
                                    Marcar como unidad base
                                </span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Tabla de unidades agregadas */}
                {data.unidades_medida.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Unidad</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Factor</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Código Barras</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Tipo</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {data.unidades_medida.map((unidad, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {getUnidadNombre(unidad.unidad_medida_id)}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                                            {getUnidadFactor(unidad.unidad_medida_id)}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-600">
                                            {unidad.codigo_barras || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {unidad.es_unidad_base ? (
                                                <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700">
                                                    Base
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleMarcarComoBase(index)}
                                                    className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                                                >
                                                    Marcar como base
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleEliminarUnidad(index)}
                                                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                        <p className="text-sm text-gray-500">
                            No hay unidades agregadas.
                        </p>
                    </div>
                )}
            </div>

            <Modal.Footer>
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="success" loading={processing}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </form>
    );
}