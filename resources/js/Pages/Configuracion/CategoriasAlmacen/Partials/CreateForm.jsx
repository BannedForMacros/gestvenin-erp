import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Textarea from '@/Components/Textarea';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function CreateForm({ onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('configuracion.categorias-almacen.store'), {
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
                <Label htmlFor="nombre" value="Nombre" required />
                <Input
                    id="nombre"
                    type="text"
                    value={data.nombre}
                    onChange={(e) => setData('nombre', e.target.value)}
                    error={errors.nombre}
                    placeholder="Insumos, Bebidas, Abarrotes..."
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
                    placeholder="Descripción opcional de la categoría"
                    rows={3}
                />
            </div>

            <Modal.Footer>
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="submit" variant="success" loading={processing}>
                    Crear Categoría
                </Button>
            </Modal.Footer>
        </form>
    );
}