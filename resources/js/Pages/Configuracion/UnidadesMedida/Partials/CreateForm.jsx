import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Select from '@/Components/Select';
import Textarea from '@/Components/Textarea';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function CreateForm({ unidadesBase, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        abreviatura: '',
        unidad_base_id: '',
        factor_conversion: '1',
        descripcion: '',
    });

    const [esBase, setEsBase] = useState(true);

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

    const unidadesBaseOptions = unidadesBase.map(unidad => ({
        value: unidad.id,
        label: `${unidad.nombre} (${unidad.abreviatura})`,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('configuracion.unidades-medida.store'), {
            onSuccess: () => {
                reset();
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
                <p className="mt-1 text-sm text-gray-500">
                    {esBase 
                        ? 'Unidad fundamental (ej: Unidad, Kilogramo, Litro)'
                        : 'Unidad que deriva de una base (ej: Caja x 250, Docena)'
                    }
                </p>
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
                    placeholder={esBase ? "Unidad, Kilogramo, Litro..." : "Caja x 250, Docena, Saco x 50kg..."}
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
                    placeholder={esBase ? "uni, kg, L..." : "cj250, doc, saco50..."}
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
                        step="0.01"
                        min="0.01"
                        value={data.factor_conversion}
                        onChange={(e) => setData('factor_conversion', e.target.value)}
                        error={errors.factor_conversion}
                        placeholder="250"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Cuántas unidades base representa. Ej: Caja x 250 = 250 unidades
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
                    placeholder="Descripción opcional"
                />
            </div>

            <Modal.Footer>
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="success" loading={processing}>
                    Crear Unidad
                </Button>
            </Modal.Footer>
        </form>
    );
}