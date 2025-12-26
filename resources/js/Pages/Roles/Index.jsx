import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Shield } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Table from '@/Components/Table';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import ActionButtons from '@/Components/ActionButtons';
import Modal from '@/Components/Modal';
import CreateForm from './Partials/CreateForm';
import EditForm from './Partials/EditForm';

export default function Index({ auth, roles, permisos }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const handleEdit = (role) => {
        setSelectedRole(role);
        setShowEditModal(true);
    };

    const handleDelete = (role) => {
        setSelectedRole(role);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('configuracion.roles.destroy', selectedRole.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedRole(null);
            },
            onError: (errors) => {
                console.error(errors);
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
            key: 'es_global',
            label: 'Alcance',
            render: (role) => (
                <Badge variant={role.es_global ? 'primary' : 'default'}>
                    {role.es_global ? 'Global' : 'Por Local'}
                </Badge>
            ),
        },
        {
            key: 'descripcion',
            label: 'Descripción',
            render: (role) => (
                <span className="text-sm text-gray-600">
                    {role.descripcion || '-'}
                </span>
            ),
        },
        {
            key: 'users_count',
            label: 'Usuarios',
            render: (role) => (
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                        {role.users_count || 0}
                    </span>
                </div>
            ),
        },
        {
            key: 'activo',
            label: 'Estado',
            render: (role) => (
                <Badge.fromBoolean value={role.activo} />
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (role) => (
                <ActionButtons>
                    {permisos.puede_editar && (
                        <ActionButtons.Button
                            type="edit"
                            onClick={() => handleEdit(role)}
                        />
                    )}
                    {permisos.puede_eliminar && (
                        <ActionButtons.Button
                            type="delete"
                            onClick={() => handleDelete(role)}
                            disabled={role.users_count > 0}
                        />
                    )}
                </ActionButtons>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Roles" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-3">
                                <Shield className="h-7 w-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
                                <p className="text-base text-gray-600">Gestiona los roles del sistema</p>
                            </div>
                        </div>

                        {permisos.puede_crear && (
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                <Plus className="mr-2 h-5 w-5" />
                                Nuevo Rol
                            </Button>
                        )}
                    </div>

                    {/* Tabla */}
                    <Table
                        data={roles}
                        columns={columns}
                        searchPlaceholder="Buscar por nombre o descripción..."
                    />
                </div>
            </div>

            {/* Modal Crear */}
            <Modal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Nuevo Rol"
                maxWidth="lg"
            >
                <CreateForm onClose={() => setShowCreateModal(false)} />
            </Modal>

            {/* Modal Editar */}
            <Modal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedRole(null);
                }}
                title="Editar Rol"
                maxWidth="lg"
            >
                {selectedRole && (
                    <EditForm 
                        role={selectedRole}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedRole(null);
                        }} 
                    />
                )}
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedRole(null);
                }}
                title="Eliminar Rol"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-base text-gray-600">
                        ¿Estás seguro de que deseas eliminar el rol{' '}
                        <span className="font-semibold text-gray-900">
                            {selectedRole?.nombre}
                        </span>?
                    </p>
                    {selectedRole?.users_count > 0 ? (
                        <div className="rounded-lg bg-red-50 p-4">
                            <p className="text-sm text-red-800">
                                No se puede eliminar este rol porque tiene{' '}
                                <span className="font-semibold">{selectedRole.users_count}</span>{' '}
                                usuario{selectedRole.users_count !== 1 ? 's' : ''} asignado{selectedRole.users_count !== 1 ? 's' : ''}.
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-red-600">
                            Esta acción no se puede deshacer.
                        </p>
                    )}
                </div>

                <Modal.Footer>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setShowDeleteModal(false);
                            setSelectedRole(null);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={confirmDelete}
                        disabled={selectedRole?.users_count > 0}
                    >
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </AuthenticatedLayout>
    );
}