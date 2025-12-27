import { useState, useEffect } from 'react';

export default function UserModulePermissionRow({ 
    module, 
    rolePermissions,
    userPermissions, 
    onChange, 
    isChild = false 
}) {
    const [localPermissions, setLocalPermissions] = useState({
        puede_ver: userPermissions?.puede_ver ?? null,
        puede_crear: userPermissions?.puede_crear ?? null,
        puede_editar: userPermissions?.puede_editar ?? null,
        puede_eliminar: userPermissions?.puede_eliminar ?? null,
        accion: userPermissions?.accion || 'heredar', // 'heredar', 'permitir', 'denegar'
    });

    useEffect(() => {
        setLocalPermissions({
            puede_ver: userPermissions?.puede_ver ?? null,
            puede_crear: userPermissions?.puede_crear ?? null,
            puede_editar: userPermissions?.puede_editar ?? null,
            puede_eliminar: userPermissions?.puede_eliminar ?? null,
            accion: userPermissions?.accion || 'heredar',
        });
    }, [userPermissions]);

    const handlePermissionChange = (permission, value) => {
        const newPermissions = {
            ...localPermissions,
            [permission]: value,
            accion: 'permitir', // Al marcar un checkbox, la acción es permitir
        };
        setLocalPermissions(newPermissions);
        onChange(module.id, newPermissions);
    };

    const handleActionChange = (accion) => {
        let newPermissions;
        
        if (accion === 'heredar') {
            // Heredar del rol
            newPermissions = {
                puede_ver: null,
                puede_crear: null,
                puede_editar: null,
                puede_eliminar: null,
                accion: 'heredar',
            };
        } else if (accion === 'denegar') {
            // Denegar todo
            newPermissions = {
                puede_ver: false,
                puede_crear: false,
                puede_editar: false,
                puede_eliminar: false,
                accion: 'denegar',
            };
        } else {
            // Permitir (mantener valores actuales)
            newPermissions = {
                ...localPermissions,
                accion: 'permitir',
            };
        }
        
        setLocalPermissions(newPermissions);
        onChange(module.id, newPermissions);
    };

    // Determinar qué permisos mostrar (usuario o rol)
    const displayPermissions = {
        puede_ver: localPermissions.puede_ver ?? rolePermissions?.puede_ver ?? false,
        puede_crear: localPermissions.puede_crear ?? rolePermissions?.puede_crear ?? false,
        puede_editar: localPermissions.puede_editar ?? rolePermissions?.puede_editar ?? false,
        puede_eliminar: localPermissions.puede_eliminar ?? rolePermissions?.puede_eliminar ?? false,
    };

    const hasOverride = localPermissions.accion !== 'heredar';

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
                    {hasOverride && (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                            Personalizado
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <select
                    value={localPermissions.accion}
                    onChange={(e) => handleActionChange(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="heredar">Heredar del rol</option>
                    <option value="permitir">Permitir</option>
                    <option value="denegar">Denegar todo</option>
                </select>
            </td>
            <td className="px-6 py-4 text-center">
                <label className="inline-flex cursor-pointer">
                    <input
                        type="checkbox"
                        checked={displayPermissions.puede_ver}
                        onChange={(e) => handlePermissionChange('puede_ver', e.target.checked)}
                        disabled={localPermissions.accion !== 'permitir'}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </label>
            </td>
            <td className="px-6 py-4 text-center">
                <label className="inline-flex cursor-pointer">
                    <input
                        type="checkbox"
                        checked={displayPermissions.puede_crear}
                        onChange={(e) => handlePermissionChange('puede_crear', e.target.checked)}
                        disabled={localPermissions.accion !== 'permitir'}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </label>
            </td>
            <td className="px-6 py-4 text-center">
                <label className="inline-flex cursor-pointer">
                    <input
                        type="checkbox"
                        checked={displayPermissions.puede_editar}
                        onChange={(e) => handlePermissionChange('puede_editar', e.target.checked)}
                        disabled={localPermissions.accion !== 'permitir'}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </label>
            </td>
            <td className="px-6 py-4 text-center">
                <label className="inline-flex cursor-pointer">
                    <input
                        type="checkbox"
                        checked={displayPermissions.puede_eliminar}
                        onChange={(e) => handlePermissionChange('puede_eliminar', e.target.checked)}
                        disabled={localPermissions.accion !== 'permitir'}
                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </label>
            </td>
        </tr>
    );
}