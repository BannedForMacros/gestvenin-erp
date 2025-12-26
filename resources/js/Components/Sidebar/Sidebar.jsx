import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/Components/Icon';
import SidebarItem from './SidebarItem';
import SidebarUserMenu from './SidebarUserMenu';

export default function Sidebar({ user, modules }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <aside
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={cn(
                'group relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out',
                isExpanded ? 'w-64' : 'w-16'
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-gray-200 px-4">
                {isExpanded ? (
                    <Link href={route('dashboard')} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
                            <span className="text-lg font-bold text-white">G</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">GestVenin</span>
                    </Link>
                ) : (
                    <Link href={route('dashboard')} className="mx-auto">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
                            <span className="text-lg font-bold text-white">G</span>
                        </div>
                    </Link>
                )}
            </div>

            {/* Navigation - Módulos desde BD */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-2">
                {modules.map((module) => (
                    <SidebarItem
                        key={module.id}
                        module={module}
                        isExpanded={isExpanded}
                    />
                ))}
            </nav>

            {/* User Menu */}
            <SidebarUserMenu user={user} isExpanded={isExpanded} />
        </aside>
    );
}