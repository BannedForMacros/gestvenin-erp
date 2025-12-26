import { Head, Link } from '@inertiajs/react';
import { Shield, ChevronRight } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Badge from '@/Components/Badge';

export default function Index({ auth, roles, permisos }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Permisos por Rol" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-lg bg-primary-100 p-3">
                            <Shield className="h-7 w-7 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Permisos por Rol</h1>
                            <p className="text-base text-gray-600">Configura los permisos de cada rol</p>
                        </div>
                    </div>

                    {/* Lista de Roles */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="divide-y divide-gray-200">
                            {roles.map((role) => (
                                <Link
                                    key={role.id}
                                    href={route('configuracion.permisos-rol.show', role.id)}
                                    className="flex items-center justify-between p-6 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                                            <Shield className="h-6 w-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {role.nombre}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-2">
                                                <Badge variant={role.es_global ? 'primary' : 'default'}>
                                                    {role.es_global ? 'Global' : 'Por Local'}
                                                </Badge>
                                                {role.descripcion && (
                                                    <span className="text-sm text-gray-500">
                                                        {role.descripcion}
                                                    </span>
                                                )}
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