import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Tag } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Table from '@/Components/Table';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import ActionButtons from '@/Components/ActionButtons';
import Modal from '@/Components/Modal';
import CreateForm from './Partials/CreateForm';
import EditForm from './Partials/EditForm';

export default function Index({ auth, categorias, permisos }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState(null);

    const handleEdit = (categoria) => {
        setSelectedCategoria(categoria);
        setShowEditModal(true);
    };

    const handleDelete = (categoria) => {
        setSelectedCategoria(categoria);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('configuracion.categorias-almacen.destroy', selectedCategoria.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedCategoria(null);
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
            key: 'descripcion',
            label: 'Descripción',
            render: (cat) => cat.descripcion || '-',
        },
        {
            key: 'productos_count',
            label: 'Productos',
            render: (cat) => (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                    {cat.productos_count || 0}
                </span>
            ),
        },
        {
            key: 'activo',
            label: 'Estado',
            render: (cat) => (
                <Badge.fromBoolean value={cat.activo === 1} />
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (cat) => (
                <ActionButtons>
                    {permisos.puede_editar && (
                        <ActionButtons.Button
                            type="edit"
                            onClick={() => handleEdit(cat)}
                        />
                    )}
                    {permisos.puede_eliminar && cat.productos_count === 0 && (
                        <ActionButtons.Button
                            type="delete"
                            onClick={() => handleDelete(cat)}
                        />
                    )}
                </ActionButtons>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Categorías Almacén" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-3">
                                <Tag className="h-7 w-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Categorías de Almacén</h1>
                                <p className="text-base text-gray-600">Gestiona las categorías de productos</p>
                            </div>
                        </div>

                        {permisos.puede_crear && (
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                <Plus className="mr-2 h-5 w-5" />
                                Nueva Categoría
                            </Button>
                        )}
                    </div>

                    {/* Tabla */}
                    <Table
                        data={categorias}
                        columns={columns}
                        searchPlaceholder="Buscar categorías..."
                    />
                </div>
            </div>

            {/* Modal Crear */}
            <Modal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Nueva Categoría"
                maxWidth="lg"
            >
                <CreateForm onClose={() => setShowCreateModal(false)} />
            </Modal>

            {/* Modal Editar */}
            <Modal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedCategoria(null);
                }}
                title="Editar Categoría"
                maxWidth="lg"
            >
                {selectedCategoria && (
                    <EditForm 
                        categoria={selectedCategoria}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedCategoria(null);
                        }} 
                    />
                )}
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedCategoria(null);
                }}
                title="Eliminar Categoría"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-base text-gray-600">
                        ¿Estás seguro de que deseas eliminar la categoría{' '}
                        <span className="font-semibold text-gray-900">
                            {selectedCategoria?.nombre}
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
                            setSelectedCategoria(null);
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