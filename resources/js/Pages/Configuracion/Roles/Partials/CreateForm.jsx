import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Textarea from '@/Components/Textarea';
import Toggle from '@/Components/Toggle';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function CreateForm({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        es_global: false,
        descripcion: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('configuracion.roles.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
                <Label htmlFor="nombre" value="Nombre del Rol" required />
                <Input
                    id="nombre"
                    type="text"
                    value={data.nombre}
                    onChange={(e) => setData('nombre', e.target.value)}
                    error={errors.nombre}
                    placeholder="Ejemplo: Cajero"
                />
            </div>

            {/* Es Global */}
            <div>
                <Toggle
                    enabled={data.es_global}
                    onChange={(value) => setData('es_global', value)}
                    label="Rol Global"
                    description="Los roles globales aplican a todos los locales. Los roles no globales están limitados a un local específico."
                />
            </div>

            {/* Descripción */}
            <div>
                <Label htmlFor="descripcion" value="Descripción" />
                <Textarea
                    id="descripcion"
                    value={data.descripcion}
                    onChange={(e) => setData('descripcion', e.target.value)}
                    error={errors.descripcion}
                    placeholder="Describe las responsabilidades de este rol..."
                    rows={4}
                />
            </div>

            <Modal.Footer>
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="success" loading={processing}>
                    Crear Rol
                </Button>
            </Modal.Footer>
        </form>
    );
}