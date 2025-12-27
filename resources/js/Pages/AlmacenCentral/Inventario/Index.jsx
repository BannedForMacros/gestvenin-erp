import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Package, AlertTriangle, FileText } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import Modal from '@/Components/Modal';
import FiltrosInventario from './Partials/FiltrosInventario';
import TablaInventario from './Partials/TablaInventario';
import EditStockMinimoForm from './Partials/EditStockMinimoForm';
import { useInventario } from './hooks/useInventario';

export default function Index({ auth, inventarios, categorias, filtros, permisos }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedInventario, setSelectedInventario] = useState(null);
    
    const {
        filters,
        handleFilterCategoria,
        handleFilterBajoStock,
    } = useInventario(filtros);

    const handleEdit = (inventario) => {
        setSelectedInventario(inventario);
        setShowEditModal(true);
    };

    const closeModal = () => {
        setShowEditModal(false);
        setSelectedInventario(null);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Inventario Almacén Central" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-3">
                                <Package className="h-7 w-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Inventario Almacén Central</h1>
                                <p className="text-base text-gray-600">Gestión de stock y valorización</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => router.visit(route('almacen-central.inventario.bajo-stock'))}
                            >
                                <AlertTriangle className="mr-2 h-5 w-5" />
                                Bajo Stock
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.visit(route('almacen-central.inventario.valorizacion'))}
                            >
                                <FileText className="mr-2 h-5 w-5" />
                                Valorización
                            </Button>
                        </div>
                    </div>

                    {/* Filtros */}
                    <FiltrosInventario
                        filters={filters}
                        categorias={categorias}
                        onFilterCategoria={handleFilterCategoria}
                        onFilterBajoStock={handleFilterBajoStock}
                    />

                    {/* Tabla */}
                    <TablaInventario
                        inventarios={inventarios}
                        permisos={permisos}
                        onEdit={handleEdit}
                    />
                </div>
            </div>

            {/* Modal Editar Stock Mínimo */}
            <Modal
                show={showEditModal}
                onClose={closeModal}
                title="Editar Stock Mínimo"
                maxWidth="md"
            >
                {selectedInventario && (
                    <EditStockMinimoForm
                        inventario={selectedInventario}
                        onClose={closeModal}
                    />
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}