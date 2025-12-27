import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Select from '@/Components/Select';
import Textarea from '@/Components/Textarea';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function EditForm({ unidad, unidadesBase, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: unidad.nombre || '',
        abreviatura: unidad.abreviatura || '',
        unidad_base_id: unidad.unidad_base_id || '',
        factor_conversion: unidad.factor_conversion || '1',
        descripcion: unidad.descripcion || '',
        activo: unidad.activo ?? 1,
    });

    const [esBase, setEsBase] = useState(!unidad.unidad_base_id);

    useEffect(() => {
        setEsBase(!data.unidad_base_id);
    }, [data.unidad_base_id]);

    const handleTipoChange = (valor) => {
        setEsBase(valor === 'base');
        if (valor === 'base') {
            setData({
                ...data,
                unidad_base_id: '',
                factor_conversion: '1',
            });
        }
    };

    const unidadesBaseOptions = unidadesBase
        .filter(u => u.id !== unidad.id) // No puede ser su propia base
        .map(u => ({
            value: u.id,
            label: `${u.nombre} (${u.abreviatura})`,
        }));

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('configuracion.unidades-medida.update', unidad.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo */}
            <div>
                <Label value="Tipo de Unidad" required />
                <div className="mt-2 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="tipo"
                            checked={esBase}
                            onChange={() => handleTipoChange('base')}
                            className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-base text-gray-700">Unidad Base</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="tipo"
                            checked={!esBase}
                            onChange={() => handleTipoChange('derivada')}
                            className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-base text-gray-700">Unidad Derivada</span>
                    </label>
                </div>
            </div>

            {/* Nombre */}
            <div>
                <Label htmlFor="nombre" value="Nombre" required />
                <Input
                    id="nombre"
                    type="text"
                    value={data.nombre}
                    onChange={(e) => setData('nombre', e.target.value)}
                    error={errors.nombre}
                />
            </div>

            {/* Abreviatura */}
            <div>
                <Label htmlFor="abreviatura" value="Abreviatura" required />
                <Input
                    id="abreviatura"
                    type="text"
                    value={data.abreviatura}
                    onChange={(e) => setData('abreviatura', e.target.value)}
                    error={errors.abreviatura}
                />
            </div>

            {/* Unidad Base (solo si es derivada) */}
            {!esBase && (
                <div>
                    <Label htmlFor="unidad_base_id" value="Unidad Base" required />
                    <Select
                        id="unidad_base_id"
                        value={data.unidad_base_id}
                        onChange={(e) => setData('unidad_base_id', e.target.value)}
                        options={unidadesBaseOptions}
                        error={errors.unidad_base_id}
                        placeholder="Selecciona la unidad base"
                    />
                </div>
            )}

            {/* Factor de Conversión (solo si es derivada) */}
            {!esBase && (
                <div>
                    <Label htmlFor="factor_conversion" value="Factor de Conversión" required />
                    <Input
                        id="factor_conversion"
                        type="number"
                        step="0.0001"
                        min="0.0001"
                        value={data.factor_conversion}
                        onChange={(e) => setData('factor_conversion', e.target.value)}
                        error={errors.factor_conversion}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        1 {data.abreviatura} = {data.factor_conversion} {unidadesBase.find(u => u.id === parseInt(data.unidad_base_id))?.abreviatura || 'unidad base'}
                    </p>
                </div>
            )}

            {/* Descripción */}
            <div>
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
            <div>
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