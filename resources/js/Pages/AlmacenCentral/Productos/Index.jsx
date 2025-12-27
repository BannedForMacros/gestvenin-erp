import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Box } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Table from '@/Components/Table';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import ActionButtons from '@/Components/ActionButtons';
import Modal from '@/Components/Modal';
import CreateForm from './Partials/CreateForm';
import EditForm from './Partials/EditForm';
import VerUnidadesModal from './Partials/VerUnidadesModal';

export default function Index({ auth, productos, categorias, unidadesBase, permisos }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUnidadesModal, setShowUnidadesModal] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);

    const handleEdit = (producto) => {
        setSelectedProducto(producto);
        setShowEditModal(true);
    };

    const handleDelete = (producto) => {
        setSelectedProducto(producto);
        setShowDeleteModal(true);
    };

    const handleVerUnidades = (producto) => {
        setSelectedProducto(producto);
        setShowUnidadesModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('almacen-central.productos.destroy', selectedProducto.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedProducto(null);
            },
        });
    };

    const columns = [
        {
            key: 'nombre',
            label: 'Producto',
            sortable: true,
        },
        {
            key: 'categoria',
            label: 'Categoría',
            render: (prod) => prod.categoria?.nombre || '-',
        },
        {
            key: 'unidad_base',
            label: 'Unidad Base',
            render: (prod) => (
                <Badge variant="info">
                    {prod.unidad_base?.nombre} ({prod.unidad_base?.abreviatura})
                </Badge>
            ),
        },
        {
            key: 'unidades_count',
            label: 'Presentaciones',
            render: (prod) => (
                <button
                    onClick={() => handleVerUnidades(prod)}
                    className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700 hover:bg-primary-200 transition-colors"
                >
                    {prod.unidades_medida?.length || 0}
                </button>
            ),
        },
        {
            key: 'activo',
            label: 'Estado',
            render: (prod) => (
                <Badge.fromBoolean value={prod.activo === 1} />
            ),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (prod) => (
                <ActionButtons>
                    <ActionButtons.Button
                        type="view"
                        onClick={() => handleVerUnidades(prod)}
                    />
                    {permisos.puede_editar && (
                        <ActionButtons.Button
                            type="edit"
                            onClick={() => handleEdit(prod)}
                        />
                    )}
                    {permisos.puede_eliminar && (
                        <ActionButtons.Button
                            type="delete"
                            onClick={() => handleDelete(prod)}
                        />
                    )}
                </ActionButtons>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Productos Almacén" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-3">
                                <Box className="h-7 w-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Productos de Almacén</h1>
                                <p className="text-base text-gray-600">Gestiona los productos y sus unidades de medida</p>
                            </div>
                        </div>

                        {permisos.puede_crear && (
                            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                                <Plus className="mr-2 h-5 w-5" />
                                Nuevo Producto
                            </Button>
                        )}
                    </div>

                    {/* Tabla */}
                    <Table
                        data={productos}
                        columns={columns}
                        searchPlaceholder="Buscar productos..."
                    />
                </div>
            </div>

            {/* Modal Crear */}
            <Modal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Nuevo Producto"
                maxWidth="3xl"
            >
                <CreateForm 
                    categorias={categorias}
                    unidadesBase={unidadesBase}
                    onClose={() => setShowCreateModal(false)} 
                />
            </Modal>

            {/* Modal Editar */}
            <Modal
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedProducto(null);
                }}
                title="Editar Producto"
                maxWidth="3xl"
            >
                {selectedProducto && (
                    <EditForm 
                        producto={selectedProducto}
                        categorias={categorias}
                        unidadesBase={unidadesBase}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedProducto(null);
                        }} 
                    />
                )}
            </Modal>

            {/* Modal Ver Unidades */}
            <Modal
                show={showUnidadesModal}
                onClose={() => {
                    setShowUnidadesModal(false);
                    setSelectedProducto(null);
                }}
                title={`Unidades de Medida - ${selectedProducto?.nombre}`}
                maxWidth="2xl"
            >
                {selectedProducto && (
                    <VerUnidadesModal producto={selectedProducto} />
                )}
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal
                show={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedProducto(null);
                }}
                title="Eliminar Producto"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-base text-gray-600">
                        ¿Estás seguro de que deseas eliminar el producto{' '}
                        <span className="font-semibold text-gray-900">
                            {selectedProducto?.nombre}
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
                            setSelectedProducto(null);
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