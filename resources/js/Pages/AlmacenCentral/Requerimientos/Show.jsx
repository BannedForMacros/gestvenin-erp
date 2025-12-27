import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Send, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import TablaDetalles from './Partials/TablaDetalles';
import ResumenRequerimiento from './Partials/ResumenRequerimiento';
import ModalValidacion from './Partials/ModalValidacion';
import { useRequerimientos } from './hooks/useRequerimientos';

export default function Show({ auth, requerimiento, permisos }) {
    const [showModalAprobar, setShowModalAprobar] = useState(false);
    const [showModalRechazar, setShowModalRechazar] = useState(false);

    const { handleEnviar, handleAprobar, handleRechazar, handleEliminar } = useRequerimientos({});

    const totales = {
        total_items: requerimiento.total_items,
        monto_total: requerimiento.monto_requerimiento,
    };

    const puedeEditar = permisos.puede_editar && (requerimiento.estado === 'borrador' || requerimiento.estado === 'rechazado');
    const puedeEliminar = permisos.puede_eliminar && (requerimiento.estado === 'borrador' || requerimiento.estado === 'rechazado');
    const puedeEnviar = permisos.puede_editar && requerimiento.estado === 'borrador';
    const puedeValidar = permisos.puede_validar && requerimiento.estado === 'enviado';

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={requerimiento.codigo} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => router.visit(route('almacen-central.requerimientos.index'))}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {requerimiento.codigo}
                                    </h1>
                                    <Badge.fromStatus status={requerimiento.estado} />
                                </div>
                                <p className="text-base text-gray-600">Detalle del requerimiento</p>
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-2">
                                {puedeEditar && (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.visit(route('almacen-central.requerimientos.edit', requerimiento.id))}
                                    >
                                        <Edit className="mr-2 h-5 w-5" />
                                        Editar
                                    </Button>
                                )}

                                {puedeEnviar && (
                                    <Button
                                        variant="primary"
                                        onClick={() => handleEnviar(requerimiento.id)}
                                    >
                                        <Send className="mr-2 h-5 w-5" />
                                        Enviar
                                    </Button>
                                )}

                                {puedeValidar && (
                                    <>
                                        <Button
                                            variant="success"
                                            onClick={() => setShowModalAprobar(true)}
                                        >
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Aprobar
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => setShowModalRechazar(true)}
                                        >
                                            <XCircle className="mr-2 h-5 w-5" />
                                            Rechazar
                                        </Button>
                                    </>
                                )}

                                {puedeEliminar && (
                                    <Button
                                        variant="danger"
                                        onClick={() => handleEliminar(requerimiento.id)}
                                    >
                                        <Trash2 className="mr-2 h-5 w-5" />
                                        Eliminar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Información General */}
                    <div className="mb-6 rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Información General</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <span className="text-sm text-gray-600">Descripción:</span>
                                <p className="font-semibold text-gray-900">
                                    {requerimiento.descripcion || '-'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Fecha de Creación:</span>
                                <p className="font-semibold text-gray-900">
                                    {new Date(requerimiento.created_at).toLocaleString('es-PE')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Auditoría */}
                    {(requerimiento.enviado_por || requerimiento.validado_por || requerimiento.comprado_por) && (
                        <div className="mb-6 rounded-lg bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Auditoría</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {requerimiento.enviado_por && (
                                    <div className="rounded-lg bg-blue-50 p-4">
                                        <div className="text-sm font-semibold text-blue-900">Enviado por</div>
                                        <div className="text-gray-900">{requerimiento.usuario_enviado?.name}</div>
                                        <div className="text-xs text-gray-600">
                                            {new Date(requerimiento.fecha_envio).toLocaleString('es-PE')}
                                        </div>
                                    </div>
                                )}

                                {requerimiento.validado_por && (
                                    <div className={`rounded-lg p-4 ${requerimiento.estado_validacion === 'aprobado' ? 'bg-green-50' : 'bg-red-50'}`}>
                                        <div className={`text-sm font-semibold ${requerimiento.estado_validacion === 'aprobado' ? 'text-green-900' : 'text-red-900'}`}>
                                            {requerimiento.estado_validacion === 'aprobado' ? 'Aprobado por' : 'Rechazado por'}
                                        </div>
                                        <div className="text-gray-900">{requerimiento.usuario_validado?.name}</div>
                                        <div className="text-xs text-gray-600">
                                            {new Date(requerimiento.fecha_validacion).toLocaleString('es-PE')}
                                        </div>
                                        {requerimiento.observacion_validacion && (
                                            <div className="mt-2 rounded bg-white p-2 text-xs text-gray-700">
                                                <strong>Observación:</strong> {requerimiento.observacion_validacion}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {requerimiento.comprado_por && (
                                    <div className="rounded-lg bg-cyan-50 p-4">
                                        <div className="text-sm font-semibold text-cyan-900">Comprado por</div>
                                        <div className="text-gray-900">{requerimiento.usuario_comprado?.name}</div>
                                        <div className="text-xs text-gray-600">
                                            {new Date(requerimiento.fecha_compra).toLocaleString('es-PE')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tabla de Productos */}
                    <div className="mb-6 rounded-lg bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Productos Solicitados ({requerimiento.detalles?.length || 0})
                        </h3>
                        <TablaDetalles
                            detalles={requerimiento.detalles || []}
                            readOnly={true}
                        />
                    </div>

                    {/* Resumen */}
                    <ResumenRequerimiento totales={totales} />
                </div>
            </div>

            {/* Modal Aprobar */}
            <ModalValidacion
                show={showModalAprobar}
                onClose={() => setShowModalAprobar(false)}
                title="Aprobar Requerimiento"
                tipo="aprobar"
                onConfirm={(observacion) => {
                    handleAprobar(requerimiento.id, observacion);
                    setShowModalAprobar(false);
                }}
            />

            {/* Modal Rechazar */}
            <ModalValidacion
                show={showModalRechazar}
                onClose={() => setShowModalRechazar(false)}
                title="Rechazar Requerimiento"
                tipo="rechazar"
                onConfirm={(observacion) => {
                    handleRechazar(requerimiento.id, observacion);
                    setShowModalRechazar(false);
                }}
            />
        </AuthenticatedLayout>
    );
}