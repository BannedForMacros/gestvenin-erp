import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Table from '@/Components/Table';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import ActionButtons from '@/Components/ActionButtons';
import Modal from '@/Components/Modal';
import CreateForm from './Partials/CreateForm';
import EditForm from './Partials/EditForm';

export default function Index({ auth, users, permisos, empresas, roles, locales }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('configuracion.usuarios.destroy', selectedUser.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedUser(null);
            },
        });
    };

    const columns = [
        {
            key: 'name',
            label: 'Nombre',
            sortable: true,
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
        },
        {
            key: 'role',
            label: 'Rol',
            render: (user) => (
                <Badge variant={user.role?.es_global ? 'primary' : 'default'}>
                    {user.role?.nombre || '-'}
                </Badge>
            ),
        },
        {
            key: 'empresa',
            label: 'Empresa',
            render: (user) => user.empresa?.nombre_comercial || user.empresa?.razon_social || '-',
        },
        {
            key: 'local',
            label: 'Local',
            render: (user) => user.local?.nombre || '-',
        },
        {
            key: 'activo',
            label: 'Estado',
            render: (user) => (
                <Badge.fromBoolean value={user.activo} />
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (user) => (
                <ActionButtons>
                    {permisos.puede_editar && (
                        <ActionButtons.Button
                            type="edit"
                            onClick={() => handleEdit(user)}
                        />
                    )}
                    {permisos.puede_eliminar && user.id !== auth.user.id && (
                        <ActionButtons.Button
                            type="delete"
                            onClick={() => handleDelete(user)}
                        />
                    )}
                </ActionButtons>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Usuarios" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-3">
                                <Users className="h-7 w-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
                                <p className="text-base text-gray-600">Gestiona los usuarios del sistema</p>
                            </div>
                        </div>

                        {permisos.puede_crear && (
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                <Plus className="mr-2 h-5 w-5" />
                                Nuevo Usuario
                            </Button>
                        )}
                    </div>

                    {/* Tabla */}
                    <Table
                        data={users}
                        columns={columns}
                        searchPlaceholder="Buscar por nombre o email..."
                    />
                </div>
            </div>

            {/* Modal Crear */}
            <Modal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Nuevo Usuario"
                maxWidth="2xl"
            >
                <CreateForm 
                    empresas={empresas}
                    roles={roles}
                    locales={locales}
                    onClose={() => setShowCreateModal(false)} 
                />
            </Modal>

            {/* Modal Editar */}
            <Modal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                }}
                title="Editar Usuario"
                maxWidth="2xl"
            >
                {selectedUser && (
                    <EditForm 
                        usuario={selectedUser}
                        empresas={empresas}
                        roles={roles}
                        locales={locales}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedUser(null);
                        }} 
                    />
                )}
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                }}
                title="Eliminar Usuario"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-base text-gray-600">
                        ¿Estás seguro de que deseas eliminar al usuario{' '}
                        <span className="font-semibold text-gray-900">
                            {selectedUser?.name}
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
                            setSelectedUser(null);
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