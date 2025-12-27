import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import Textarea from '@/Components/Textarea';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';

export default function EditForm({ categoria, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: categoria.nombre || '',
        descripcion: categoria.descripcion || '',
        activo: categoria.activo ?? 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('configuracion.categorias-almacen.update', categoria.id), {
            onSuccess: () => {
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
                    rows={3}
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