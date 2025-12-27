import { Head, router } from '@inertiajs/react';
import { Plus, FileText, Wand2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import FiltrosRequerimientos from './Partials/FiltrosRequerimientos';
import TablaRequerimientos from './Partials/TablaRequerimientos';
import { useRequerimientos } from './hooks/useRequerimientos';

export default function Index({ auth, requerimientos, filtros, permisos }) {
    const {
        filters,
        handleFilterEstado,
        handleGenerarAutomatico,
        handleEliminar,
    } = useRequerimientos(filtros);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Requerimientos" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-3">
                                <FileText className="h-7 w-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Requerimientos</h1>
                                <p className="text-base text-gray-600">Gestión de requerimientos de compra</p>
                            </div>
                        </div>

                        {permisos.puede_crear && (
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleGenerarAutomatico}
                                >
                                    <Wand2 className="mr-2 h-5 w-5" />
                                    Generar Automático
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => router.visit(route('almacen-central.requerimientos.create'))}
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Nuevo Requerimiento
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Filtros */}
                    <FiltrosRequerimientos
                        filters={filters}
                        onFilterEstado={handleFilterEstado}
                    />

                    {/* Tabla */}
                    <TablaRequerimientos
                        requerimientos={requerimientos}
                        permisos={permisos}
                        onEliminar={handleEliminar}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}