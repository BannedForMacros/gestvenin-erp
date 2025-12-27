import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import Label from '@/Components/Label';
import Textarea from '@/Components/Textarea';
import FormularioDetalles from './Partials/FormularioDetalles';
import TablaDetalles from './Partials/TablaDetalles';
import ResumenRequerimiento from './Partials/ResumenRequerimiento';
import { useRequerimientoForm } from './hooks/useRequerimientoForm';

export default function Create({ auth, productos }) {
    // ✅ NO USAR useForm de Inertia para este caso
    const [descripcion, setDescripcion] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const {
        detalles,
        detalleTemp,
        setDetalleTemp,
        agregarDetalle,
        eliminarDetalle,
        calcularTotales,
    } = useRequerimientoForm([]);

    const handleAgregar = () => {
        agregarDetalle(productos);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (detalles.length === 0) {
            alert('Debe agregar al menos un producto');
            return;
        }

        const detallesParaEnviar = detalles.map(d => ({
            producto_id: d.producto_id,
            unidad_medida_id: d.unidad_medida_id,
            cantidad_solicitada: d.cantidad_solicitada,
            precio_unitario: d.precio_unitario || 0,
        }));

        // ✅ USAR router.post directamente
        setProcessing(true);
        
        router.post(route('almacen-central.requerimientos.store'), {
            descripcion: descripcion,
            detalles: detallesParaEnviar,
        }, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
            },
        });
    };

    const totales = calcularTotales();

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Nuevo Requerimiento" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.visit(route('almacen-central.requerimientos.index'))}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Nuevo Requerimiento</h1>
                                    <p className="text-base text-gray-600">Complete la información del requerimiento</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow">
                            <Label htmlFor="descripcion" value="Descripción" />
                            <Textarea
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                error={errors.descripcion}
                                rows={2}
                                placeholder="Descripción opcional del requerimiento"
                            />
                        </div>

                        <FormularioDetalles
                            productos={productos}
                            detalleTemp={detalleTemp}
                            setDetalleTemp={setDetalleTemp}
                            onAgregar={handleAgregar}
                        />

                        <div className="rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Productos Agregados ({detalles.length})
                            </h3>
                            <TablaDetalles
                                detalles={detalles}
                                onEliminar={eliminarDetalle}
                            />
                        </div>

                        {detalles.length > 0 && (
                            <ResumenRequerimiento totales={totales} />
                        )}

                        {errors.detalles && (
                            <div className="rounded-lg bg-red-50 p-4">
                                <p className="text-sm text-red-600">{errors.detalles}</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.visit(route('almacen-central.requerimientos.index'))}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="success"
                                loading={processing}
                                disabled={detalles.length === 0}
                            >
                                <Save className="mr-2 h-5 w-5" />
                                Guardar Requerimiento
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}