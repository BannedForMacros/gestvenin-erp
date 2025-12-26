import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Select from '@/Components/Select';
import Toggle from '@/Components/Toggle';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function CreateForm({ empresas, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        empresa_id: '',
        nombre: '',
        direccion: '',
        distrito: '',
        provincia: '',
        departamento: '',
        telefono: '',
        permite_mesas: true,
    });

    const empresaOptions = empresas.map(empresa => ({
        value: empresa.id,
        label: empresa.nombre_comercial || empresa.razon_social,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('configuracion.locales.store'), {
            onSuccess: () => {
                reset();
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
                        placeholder="Selecciona una empresa"
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
                        placeholder="Local Centro"
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
                        placeholder="Av. Principal 123"
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
                        placeholder="Trujillo"
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
                        placeholder="Trujillo"
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
                        placeholder="La Libertad"
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
                        placeholder="999999999"
                    />
                </div>

                {/* Permite Mesas */}
                <div className="md:col-span-2">
                    <Toggle
                        enabled={data.permite_mesas}
                        onChange={(value) => setData('permite_mesas', value)}
                        label="Gestión de Mesas"
                        description="Habilita el módulo de mesas para este local"
                    />
                </div>
            </div>

            <Modal.Footer>
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="success" loading={processing}>
                    Crear Local
                </Button>
            </Modal.Footer>
        </form>
    );
}