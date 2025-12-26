import { useState, useEffect } from 'react';

export default function ModulePermissionRow({ 
    module, 
    permissions, 
    onChange, 
    isChild = false 
}) {
    const [localPermissions, setLocalPermissions] = useState({
        puede_ver: permissions?.puede_ver || false,
        puede_crear: permissions?.puede_crear || false,
        puede_editar: permissions?.puede_editar || false,
        puede_eliminar: permissions?.puede_eliminar || false,
    });

    useEffect(() => {
        setLocalPermissions({
            puede_ver: permissions?.puede_ver || false,
            puede_crear: permissions?.puede_crear || false,
            puede_editar: permissions?.puede_editar || false,
            puede_eliminar: permissions?.puede_eliminar || false,
        });
    }, [permissions]);

    const handlePermissionChange = (permission, value) => {
        const newPermissions = {
            ...localPermissions,
            [permission]: value,
        };
        setLocalPermissions(newPermissions);
        onChange(module.id, newPermissions);
    };

    const handleSelectAll = () => {
        const allSelected = Object.values(localPermissions).every(v => v);
        const newValue = !allSelected;
        
        const newPermissions = {
            puede_ver: newValue,
            puede_crear: newValue,
            puede_editar: newValue,
            puede_eliminar: newValue,
        };
        
        setLocalPermissions(newPermissions);
        onChange(module.id, newPermissions);
    };

    const allSelected = Object.values(localPermissions).every(v => v);
    const someSelected = Object.values(localPermissions).some(v => v);

    return (
        <tr className={isChild ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}>
            <td className={`px-6 py-4 text-base ${isChild ? 'pl-12' : ''}`}>
                <div className="flex items-center gap-2">
                    {isChild && (
                        <span className="text-gray-400">└─</span>
                    )}
                    <span className={`${isChild ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
                        {module.nombre}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <label className="inline-flex cursor-pointer">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        ref={input => {
                            if (input) input.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={handleSelectAll}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                </label>
            </td>
            <td className="px-6 py-4 text-center">
                <label className="inline-flex cursor-pointer">
                    <input
                        type="checkbox"
                        checked={localPermissions.puede_ver}
                        onChange={(e) => handlePermissionChange('puede_ver', e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                </label>
            </td>
            <td className="px-6 py-4 text-center">
                <label className="inline-flex cursor-pointer">
                    <input
                        type="checkbox"
                        checked={localPermissions.puede_crear}
                        onChange={(e) => handlePermissionChange('puede_crear', e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                </label>
            </td>
            <td className="px-6 py-4 text-center">
                <label className="inline-flex cursor-pointer">
                    <input
                        type="checkbox"
                        checked={localPermissions.puede_editar}
                        onChange={(e) => handlePermissionChange('puede_editar', e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                </label>
            </td>
            <td className="px-6 py-4 text-center">
                <label className="inline-flex cursor-pointer">
                    <input
                        type="checkbox"
                        checked={localPermissions.puede_eliminar}
                        onChange={(e) => handlePermissionChange('puede_eliminar', e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                </label>
            </td>
        </tr>
    );
}