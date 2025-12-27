import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Ruler } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Table from '@/Components/Table';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import ActionButtons from '@/Components/ActionButtons';
import Modal from '@/Components/Modal';
import CreateForm from './Partials/CreateForm';
import EditForm from './Partials/EditForm';

export default function Index({ auth, unidades, unidadesBase, permisos }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUnidad, setSelectedUnidad] = useState(null);

    const handleEdit = (unidad) => {
        setSelectedUnidad(unidad);
        setShowEditModal(true);
    };

    const handleDelete = (unidad) => {
        setSelectedUnidad(unidad);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('configuracion.unidades-medida.destroy', selectedUnidad.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedUnidad(null);
            },
        });
    };

    const columns = [
        {
            key: 'nombre',
            label: 'Nombre',
            sortable: true,
        },
        {
            key: 'abreviatura',
            label: 'Abreviatura',
            sortable: true,
        },
        {
            key: 'tipo',
            label: 'Tipo',
            render: (unidad) => (
                unidad.unidad_base_id ? (
                    <Badge variant="default">Derivada</Badge>
                ) : (
                    <Badge variant="primary">Base</Badge>
                )
            ),
        },
        {
            key: 'unidad_base',
            label: 'Unidad Base',
            render: (unidad) => unidad.unidad_base?.nombre || '-',
        },
        {
            key: 'factor_conversion',
            label: 'Factor',
            render: (unidad) => (
                unidad.unidad_base_id ? (
                    <span className="text-sm">
                        1 {unidad.abreviatura} = {unidad.factor_conversion} {unidad.unidad_base?.abreviatura}
                    </span>
                ) : (
                    '-'
                )
            ),
        },
        {
            key: 'activo',
            label: 'Estado',
            render: (unidad) => (
                <Badge.fromBoolean value={unidad.activo === 1} />
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (unidad) => (
                <ActionButtons>
                    {permisos.puede_editar && (
                        <ActionButtons.Button
                            type="edit"
                            onClick={() => handleEdit(unidad)}
                        />
                    )}
                    {permisos.puede_eliminar && (
                        <ActionButtons.Button
                            type="delete"
                            onClick={() => handleDelete(unidad)}
                        />
                    )}
                </ActionButtons>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Unidades de Medida" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-3">
                                <Ruler className="h-7 w-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Unidades de Medida</h1>
                                <p className="text-base text-gray-600">Gestiona las unidades base y derivadas</p>
                            </div>
                        </div>

                        {permisos.puede_crear && (
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                <Plus className="mr-2 h-5 w-5" />
                                Nueva Unidad
                            </Button>
                        )}
                    </div>

                    {/* Tabla */}
                    <Table
                        data={unidades}
                        columns={columns}
                        searchPlaceholder="Buscar unidades de medida..."
                    />
                </div>
            </div>

            {/* Modal Crear */}
            <Modal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Nueva Unidad de Medida"
                maxWidth="lg"
            >
                <CreateForm 
                    unidadesBase={unidadesBase}
                    onClose={() => setShowCreateModal(false)} 
                />
            </Modal>

            {/* Modal Editar */}
            <Modal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedUnidad(null);
                }}
                title="Editar Unidad de Medida"
                maxWidth="lg"
            >
                {selectedUnidad && (
                    <EditForm 
                        unidad={selectedUnidad}
                        unidadesBase={unidadesBase}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedUnidad(null);
                        }} 
                    />
                )}
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedUnidad(null);
                }}
                title="Eliminar Unidad de Medida"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-base text-gray-600">
                        ¿Estás seguro de que deseas eliminar la unidad{' '}
                        <span className="font-semibold text-gray-900">
                            {selectedUnidad?.nombre}
                        </span>?
                    </p>
                    <p className="text-sm text-red-600">
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                <Modal.Footer>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setShowDeleteModal(false);
                            setSelectedUnidad(null);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </AuthenticatedLayout>
    );
}