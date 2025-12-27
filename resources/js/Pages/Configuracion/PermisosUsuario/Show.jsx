import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { UserCog, Save, X, RotateCcw } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import Badge from '@/Components/Badge';
import UserModulePermissionRow from '@/Components/UserModulePermissionRow';

export default function Show({ auth, user, modules, roleModules, userModules, permisos }) {
    const [permissions, setPermissions] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Inicializar permisos desde userModules
        const initialPermissions = {};
        
        const userModulesArray = Object.values(userModules || {});
        
        userModulesArray.forEach(um => {
            initialPermissions[um.module_id] = {
                puede_ver: um.puede_ver,
                puede_crear: um.puede_crear,
                puede_editar: um.puede_editar,
                puede_eliminar: um.puede_eliminar,
                accion: um.accion,
            };
        });

        setPermissions(initialPermissions);
    }, [userModules]);

    const handlePermissionChange = (moduleId, newPermissions) => {
        if (newPermissions.accion === 'heredar') {
            // Si cambia a heredar, eliminar del estado
            setPermissions(prev => {
                const newState = { ...prev };
                delete newState[moduleId];
                return newState;
            });
        } else {
            // Actualizar normalmente
            setPermissions(prev => ({
                ...prev,
                [moduleId]: newPermissions,
            }));
        }
    };

    const handleResetAll = () => {
        if (confirm('¿Estás seguro de que deseas resetear todos los permisos personalizados? El usuario volverá a heredar los permisos de su rol.')) {
            setPermissions({});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Convertir permisos a array, solo los que NO sean "heredar"
        const modulesArray = Object.entries(permissions)
            .filter(([moduleId, perms]) => perms.accion !== 'heredar')
            .map(([moduleId, perms]) => ({
                module_id: parseInt(moduleId),
                accion: perms.accion,
                puede_ver: perms.puede_ver ?? false,
                puede_crear: perms.puede_crear ?? false,
                puede_editar: perms.puede_editar ?? false,
                puede_eliminar: perms.puede_eliminar ?? false,
            }));

        router.put(route('configuracion.permisos-usuario.update', user.id), {
            modules: modulesArray.length > 0 ? modulesArray : [],  // ← CAMBIO AQUÍ
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    // Crear mapa de permisos del rol para fácil acceso
    const rolePermissionsMap = {};
    Object.values(roleModules || {}).forEach(rm => {
        rolePermissionsMap[rm.module_id] = rm;
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Permisos - ${user.name}`} />

            {/* Contenedor principal con padding bottom para el footer fijo */}
            <div className="py-6 pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-3">
                                <UserCog className="h-7 w-7 text-primary-600" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Permisos de: {user.name}
                                </h1>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-base text-gray-600">{user.email}</span>
                                    <span className="text-gray-300">•</span>
                                    <Badge variant={user.role?.es_global ? 'primary' : 'default'}>
                                        {user.role?.nombre}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="mt-4 rounded-lg bg-blue-50 p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Heredar del rol:</strong> El usuario tendrá los permisos de su rol ({user.role?.nombre}).
                                <br />
                                <strong>Permitir:</strong> Sobrescribe los permisos del rol con permisos personalizados para este usuario.
                                <br />
                                <strong>Denegar todo:</strong> Bloquea todos los permisos de este módulo, incluso si el rol los tiene.
                            </p>
                        </div>
                    </div>

                    {/* Tabla de Permisos */}
                    <form onSubmit={handleSubmit}>
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-900">
                                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-white">
                                                Módulo
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-white">
                                                Acción
                                            </th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                                Ver
                                            </th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                                Crear
                                            </th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                                Editar
                                            </th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                                Eliminar
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {modules.map((parent) => (
                                            <React.Fragment key={parent.id}>
                                                {/* Módulo Padre */}
                                                <UserModulePermissionRow
                                                    module={parent}
                                                    rolePermissions={rolePermissionsMap[parent.id]}
                                                    userPermissions={permissions[parent.id]}
                                                    onChange={handlePermissionChange}
                                                />

                                                {/* Módulos Hijos */}
                                                {parent.children?.map((child) => (
                                                    <UserModulePermissionRow
                                                        key={child.id}
                                                        module={child}
                                                        rolePermissions={rolePermissionsMap[child.id]}
                                                        userPermissions={permissions[child.id]}
                                                        onChange={handlePermissionChange}
                                                        isChild={true}
                                                    />
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer Flotante Fijo */}
            <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white shadow-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleResetAll}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Resetear Todo
                        </Button>
                        
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.visit(route('configuracion.permisos-usuario.index'))}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="success"
                                loading={processing}
                                disabled={!permisos.puede_editar}
                                onClick={handleSubmit}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Permisos
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}