import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Select from '@/Components/Select';
import Toggle from '@/Components/Toggle';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function EditForm({ local, empresas, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        empresa_id: local.empresa_id || '',
        nombre: local.nombre || '',
        direccion: local.direccion || '',
        distrito: local.distrito || '',
        provincia: local.provincia || '',
        departamento: local.departamento || '',
        telefono: local.telefono || '',
        permite_mesas: local.permite_mesas ?? true,
        activo: local.activo ?? true,
    });

    const empresaOptions = empresas.map(empresa => ({
        value: empresa.id,
        label: empresa.nombre_comercial || empresa.razon_social,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('configuracion.locales.update', local.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Empresa */}
                <div className="md:col-span-2">
                    <Label htmlFor="empresa_id" value="Empresa" required />
                    <Select
                        id="empresa_id"
                        value={data.empresa_id}
                        onChange={(e) => setData('empresa_id', e.target.value)}
                        options={empresaOptions}
                        error={errors.empresa_id}
                    />
                </div>

                {/* Nombre */}
                <div className="md:col-span-2">
                    <Label htmlFor="nombre" value="Nombre del Local" required />
                    <Input
                        id="nombre"
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        error={errors.nombre}
                    />
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                    <Label htmlFor="direccion" value="Dirección" required />
                    <Input
                        id="direccion"
                        type="text"
                        value={data.direccion}
                        onChange={(e) => setData('direccion', e.target.value)}
                        error={errors.direccion}
                    />
                </div>

                {/* Distrito */}
                <div>
                    <Label htmlFor="distrito" value="Distrito" />
                    <Input
                        id="distrito"
                        type="text"
                        value={data.distrito}
                        onChange={(e) => setData('distrito', e.target.value)}
                        error={errors.distrito}
                    />
                </div>

                {/* Provincia */}
                <div>
                    <Label htmlFor="provincia" value="Provincia" />
                    <Input
                        id="provincia"
                        type="text"
                        value={data.provincia}
                        onChange={(e) => setData('provincia', e.target.value)}
                        error={errors.provincia}
                    />
                </div>

                {/* Departamento */}
                <div>
                    <Label htmlFor="departamento" value="Departamento" />
                    <Input
                        id="departamento"
                        type="text"
                        value={data.departamento}
                        onChange={(e) => setData('departamento', e.target.value)}
                        error={errors.departamento}
                    />
                </div>

                {/* Teléfono */}
                <div>
                    <Label htmlFor="telefono" value="Teléfono" />
                    <Input
                        id="telefono"
                        type="text"
                        value={data.telefono}
                        onChange={(e) => setData('telefono', e.target.value)}
                        error={errors.telefono}
                    />
                </div>

                {/* Permite Mesas */}
                <div className="md:col-span-2">
                    <Toggle 
                        enabled={data.permite_mesas} 
                        onChange={(val) => setData('permite_mesas', val)} 
                        label="Gestión de Mesas"
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
                                checked={data.activo === true}
                                onChange={() => setData('activo', true)}
                                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-base text-gray-700">Activo</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="activo"
                                checked={data.activo === false}
                                onChange={() => setData('activo', false)}
                                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-base text-gray-700">Inactivo</span>
                        </label>
                    </div>
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