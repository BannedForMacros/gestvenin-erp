import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Shield, Save, X } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import ModulePermissionRow from '@/Components/ModulePermissionRow';

export default function Show({ auth, role, modules, roleModules, permisos }) {
    const [permissions, setPermissions] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Inicializar permisos desde roleModules
        const initialPermissions = {};
        
        // roleModules viene como objeto, convertir a array
        const roleModulesArray = Object.values(roleModules || {});
        
        roleModulesArray.forEach(rm => {
            initialPermissions[rm.module_id] = {
                puede_ver: rm.puede_ver,
                puede_crear: rm.puede_crear,
                puede_editar: rm.puede_editar,
                puede_eliminar: rm.puede_eliminar,
            };
        });

        setPermissions(initialPermissions);
    }, [roleModules]);

    const handlePermissionChange = (moduleId, newPermissions) => {
        setPermissions(prev => ({
            ...prev,
            [moduleId]: newPermissions,
        }));
    };

    const handleSelectAllModules = () => {
        const allModuleIds = [];
        modules.forEach(parent => {
            allModuleIds.push(parent.id);
            parent.children?.forEach(child => {
                allModuleIds.push(child.id);
            });
        });

        const allSelected = allModuleIds.every(id => 
            permissions[id]?.puede_ver && 
            permissions[id]?.puede_crear && 
            permissions[id]?.puede_editar && 
            permissions[id]?.puede_eliminar
        );

        const newValue = !allSelected;
        const newPermissions = {};

        allModuleIds.forEach(id => {
            newPermissions[id] = {
                puede_ver: newValue,
                puede_crear: newValue,
                puede_editar: newValue,
                puede_eliminar: newValue,
            };
        });

        setPermissions(newPermissions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Convertir permisos a array
        const modulesArray = Object.entries(permissions).map(([moduleId, perms]) => ({
            module_id: parseInt(moduleId),
            ...perms,
        }));

        router.put(route('configuracion.permisos-rol.update', role.id), {
            modules: modulesArray,
        }, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const allModulesSelected = () => {
        const allModuleIds = [];
        modules.forEach(parent => {
            allModuleIds.push(parent.id);
            parent.children?.forEach(child => {
                allModuleIds.push(child.id);
            });
        });

        return allModuleIds.every(id => 
            permissions[id]?.puede_ver && 
            permissions[id]?.puede_crear && 
            permissions[id]?.puede_editar && 
            permissions[id]?.puede_eliminar
        );
    };

    const someModulesSelected = () => {
        const allModuleIds = [];
        modules.forEach(parent => {
            allModuleIds.push(parent.id);
            parent.children?.forEach(child => {
                allModuleIds.push(child.id);
            });
        });

        return allModuleIds.some(id => 
            permissions[id]?.puede_ver || 
            permissions[id]?.puede_crear || 
            permissions[id]?.puede_editar || 
            permissions[id]?.puede_eliminar
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Permisos - ${role.nombre}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-3">
                                <Shield className="h-7 w-7 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Permisos del Rol: {role.nombre}
                                </h1>
                                <p className="text-base text-gray-600">
                                    Configura qué módulos puede ver y gestionar este rol
                                </p>
                            </div>
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
                                            <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-white">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span>Todo</span>
                                                    <label className="inline-flex cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={allModulesSelected()}
                                                            ref={input => {
                                                                if (input) {
                                                                    input.indeterminate = someModulesSelected() && !allModulesSelected();
                                                                }
                                                            }}
                                                            onChange={handleSelectAllModules}
                                                            className="h-5 w-5 rounded border-gray-300 text-primary-400 focus:ring-primary-500"
                                                        />
                                                    </label>
                                                </div>
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
                                                <ModulePermissionRow
                                                    module={parent}
                                                    permissions={permissions[parent.id]}
                                                    onChange={handlePermissionChange}
                                                />

                                                {/* Módulos Hijos */}
                                                {parent.children?.map((child) => (
                                                    <ModulePermissionRow
                                                        key={child.id}
                                                        module={child}
                                                        permissions={permissions[child.id]}
                                                        onChange={handlePermissionChange}
                                                        isChild={true}
                                                    />
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer con botones */}
                            <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.visit(route('configuracion.permisos-rol.index'))}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="success"
                                    loading={processing}
                                    disabled={!permisos.puede_editar}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar Permisos
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}