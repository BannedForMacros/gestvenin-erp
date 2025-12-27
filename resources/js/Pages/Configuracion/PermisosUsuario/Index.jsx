import { Head, Link } from '@inertiajs/react';
import { UserCog, ChevronRight } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';

export default function Index({ auth, users, permisos }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Permisos por Usuario" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-primary-100 p-3">
                            <UserCog className="h-7 w-7 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Permisos por Usuario</h1>
                            <p className="text-base text-gray-600">
                                Configura permisos específicos para cada usuario (sobrescribe permisos del rol)
                            </p>
                        </div>
                    </div>

                    {/* Lista de Usuarios */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <Link
                                    key={user.id}
                                    href={route('configuracion.permisos-usuario.show', user.id)}
                                    className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                                            <UserCog className="h-6 w-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {user.name}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="text-sm text-gray-500">
                                                    {user.email}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <Badge variant={user.role?.es_global ? 'primary' : 'default'}>
                                                    {user.role?.nombre || '-'}
                                                </Badge>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-sm text-gray-500">
                                                    {user.empresa?.nombre_comercial || user.empresa?.razon_social || '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}