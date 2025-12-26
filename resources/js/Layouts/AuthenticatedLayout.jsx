import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar/Sidebar';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    const { modules } = usePage().props;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar con hover auto-expand */}
            <Sidebar user={user} modules={modules} />

            {/* Main Content - TODO EL ESPACIO DISPONIBLE */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}