import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Table from '@/Components/Table';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';
import CreateForm from './Partials/CreateForm';
import EditForm from './Partials/EditForm';
import Badge from '@/Components/Badge';
import ActionButtons from '@/Components/ActionButtons';

export default function Index({ auth, empresas, filters, permisos }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);

    const handleSearch = (search) => {
        router.get(route('configuracion.empresa.index'), 
            { search, limit: filters.limit },
            { preserveState: true, replace: true }
        );
    };

    const handleEdit = (empresa) => {
        setSelectedEmpresa(empresa);
        setShowEditModal(true);
    };

    const handleDelete = (empresa) => {
        setSelectedEmpresa(empresa);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('configuracion.empresa.destroy', selectedEmpresa.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedEmpresa(null);
            },
        });
    };

    const columns = [
        {
            key: 'ruc',
            label: 'RUC',
            sortable: true,
        },
        {
            key: 'razon_social',
            label: 'Razón Social',
            sortable: true,
        },
        {
            key: 'nombre_comercial',
            label: 'Nombre Comercial',
            sortable: true,
        },
        {
            key: 'direccion',
            label: 'Dirección',
        },
        {
            key: 'telefono',
            label: 'Teléfono',
        },
        {
            key: 'activo',
            label: 'Estado',
            render: (empresa) => (
                <Badge.fromBoolean 
                    value={empresa.activo}
                    trueLabel="Activo"
                    falseLabel="Inactivo"
                />
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (empresa) => (
                <ActionButtons>
                    {permisos.puede_editar && (
                        <ActionButtons.Button
                            type="edit"
                            onClick={() => handleEdit(empresa)}
                        />
                    )}
                    {permisos.puede_eliminar && (
                        <ActionButtons.Button
                            type="delete"
                            onClick={() => handleDelete(empresa)}
                        />
                    )}
                </ActionButtons>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Empresas" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-2">
                                <Building2 className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
                                <p className="text-sm text-gray-600">Gestiona las empresas del sistema</p>
                            </div>
                        </div>

                        {permisos.puede_crear && (
                            <Button
                                variant="primary"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Empresa
                            </Button>
                        )}
                    </div>

                    {/* Tabla */}
                        <Table
                            data={empresas}
                            columns={columns}
                            onSearch={handleSearch}
                            searchPlaceholder="Buscar por RUC, razón social o nombre comercial..."
                        />
                </div>
            </div>

            {/* Modal Crear */}
            <Modal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Nueva Empresa"
                maxWidth="2xl"
            >
                <CreateForm onClose={() => setShowCreateModal(false)} />
            </Modal>

            {/* Modal Editar */}
            <Modal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedEmpresa(null);
                }}
                title="Editar Empresa"
                maxWidth="2xl"
            >
                {selectedEmpresa && (
                    <EditForm 
                        empresa={selectedEmpresa} 
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedEmpresa(null);
                        }} 
                    />
                )}
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedEmpresa(null);
                }}
                title="Eliminar Empresa"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        ¿Estás seguro de que deseas eliminar la empresa{' '}
                        <span className="font-semibold text-gray-900">
                            {selectedEmpresa?.razon_social}
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
                            setSelectedEmpresa(null);
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