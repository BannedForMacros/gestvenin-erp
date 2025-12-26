import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function EditForm({ empresa, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        ruc: empresa.ruc || '',
        razon_social: empresa.razon_social || '',
        nombre_comercial: empresa.nombre_comercial || '',
        direccion: empresa.direccion || '',
        distrito: empresa.distrito || '',
        provincia: empresa.provincia || '',
        departamento: empresa.departamento || '',
        telefono: empresa.telefono || '',
        email: empresa.email || '',
        logo: empresa.logo || '',
        activo: empresa.activo ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('configuracion.empresa.update', empresa.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* RUC */}
                <div>
                    <Label htmlFor="ruc" value="RUC" required />
                    <Input
                        id="ruc"
                        type="text"
                        value={data.ruc}
                        onChange={(e) => setData('ruc', e.target.value)}
                        error={errors.ruc}
                        maxLength={11}
                    />
                </div>

                {/* Razón Social */}
                <div>
                    <Label htmlFor="razon_social" value="Razón Social" required />
                    <Input
                        id="razon_social"
                        type="text"
                        value={data.razon_social}
                        onChange={(e) => setData('razon_social', e.target.value)}
                        error={errors.razon_social}
                    />
                </div>

                {/* Nombre Comercial */}
                <div>
                    <Label htmlFor="nombre_comercial" value="Nombre Comercial" />
                    <Input
                        id="nombre_comercial"
                        type="text"
                        value={data.nombre_comercial}
                        onChange={(e) => setData('nombre_comercial', e.target.value)}
                        error={errors.nombre_comercial}
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

                {/* Email */}
                <div className="md:col-span-2">
                    <Label htmlFor="email" value="Email" />
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
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

                {/* Estado */}
                <div className="md:col-span-2">
                    <Label htmlFor="activo" value="Estado" />
                    <div className="mt-2 flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="activo"
                                checked={data.activo === true}
                                onChange={() => setData('activo', true)}
                                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">Activo</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="activo"
                                checked={data.activo === false}
                                onChange={() => setData('activo', false)}
                                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">Inactivo</span>
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