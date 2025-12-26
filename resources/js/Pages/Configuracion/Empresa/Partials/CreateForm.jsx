import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function CreateForm({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        ruc: '',
        razon_social: '',
        nombre_comercial: '',
        direccion: '',
        distrito: '',
        provincia: '',
        departamento: '',
        telefono: '',
        email: '',
        logo: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('configuracion.empresa.store'), {
            onSuccess: () => {
                reset();
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
                        placeholder="20123456789"
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
                        placeholder="Mi Empresa S.A.C."
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
                        placeholder="Mi Empresa"
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

                {/* Email */}
                <div className="md:col-span-2">
                    <Label htmlFor="email" value="Email" />
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        placeholder="contacto@miempresa.com"
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
            </div>

            <Modal.Footer>
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="success" loading={processing}>
                    Crear Empresa
                </Button>
            </Modal.Footer>
        </form>
    );
}