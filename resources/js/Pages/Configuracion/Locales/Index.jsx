import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Building } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Table from '@/Components/Table';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import ActionButtons from '@/Components/ActionButtons';
import Modal from '@/Components/Modal';
import CreateForm from './Partials/CreateForm';
import EditForm from './Partials/EditForm';

export default function Index({ auth, locales, filters, permisos, empresas }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLocal, setSelectedLocal] = useState(null);

    const handleSearch = (search) => {
        router.get(route('configuracion.locales.index'), 
            { search, limit: filters.limit },
            { preserveState: true, replace: true }
        );
    };

    const handleEdit = (local) => {
        setSelectedLocal(local);
        setShowEditModal(true);
    };

    const handleDelete = (local) => {
        setSelectedLocal(local);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('configuracion.locales.destroy', selectedLocal.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedLocal(null);
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
            key: 'empresa',
            label: 'Empresa',
            sortable: true,
            render: (local) => local.empresa?.nombre_comercial || local.empresa?.razon_social || '-',
        },
        {
            key: 'direccion',
            label: 'Dirección',
        },
        {
            key: 'distrito',
            label: 'Distrito',
        },
        {
            key: 'telefono',
            label: 'Teléfono',
        },
        {
            key: 'permite_mesas',
            label: 'Mesas',
            render: (local) => (
                <Badge variant={local.permite_mesas ? 'success' : 'default'}>
                    {local.permite_mesas ? 'Habilitado' : 'Deshabilitado'}
                </Badge>
            ),
        },
        {
            key: 'activo',
            label: 'Estado',
            render: (local) => (
                <Badge.fromBoolean value={local.activo} />
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (local) => (
                <ActionButtons>
                    {permisos.puede_editar && (
                        <ActionButtons.Button
                            type="edit"
                            onClick={() => handleEdit(local)}
                        />
                    )}
                    {permisos.puede_eliminar && (
                        <ActionButtons.Button
                            type="delete"
                            onClick={() => handleDelete(local)}
                        />
                    )}
                </ActionButtons>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Locales" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-3">
                                <Building className="h-7 w-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Locales</h1>
                                <p className="text-base text-gray-600">Gestiona los locales de tus empresas</p>
                            </div>
                        </div>

                        {permisos.puede_crear && (
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                <Plus className="mr-2 h-5 w-5" />
                                Nuevo Local
                            </Button>
                        )}
                    </div>

                    {/* Tabla */}
                    <Table
                        data={locales}
                        columns={columns}
                        onSearch={handleSearch}
                        searchPlaceholder="Buscar por nombre, dirección o distrito..."
                    />
                </div>
            </div>

            {/* Modal Crear */}
            <Modal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Nuevo Local"
                maxWidth="2xl"
            >
                <CreateForm 
                    empresas={empresas}
                    onClose={() => setShowCreateModal(false)} 
                />
            </Modal>

            {/* Modal Editar */}
            <Modal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedLocal(null);
                }}
                title="Editar Local"
                maxWidth="2xl"
            >
                {selectedLocal && (
                    <EditForm 
                        local={selectedLocal}
                        empresas={empresas}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedLocal(null);
                        }} 
                    />
                )}
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedLocal(null);
                }}
                title="Eliminar Local"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-base text-gray-600">
                        ¿Estás seguro de que deseas eliminar el local{' '}
                        <span className="font-semibold text-gray-900">
                            {selectedLocal?.nombre}
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
                            setSelectedLocal(null);
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