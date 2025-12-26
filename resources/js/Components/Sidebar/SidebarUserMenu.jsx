import { Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function SidebarUserMenu({ user, isExpanded }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Cerrar al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className="relative border-t border-gray-200 p-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-100',
                    !isExpanded && 'justify-center'
                )}
                title={!isExpanded ? user.name : undefined}
            >
                {/* Avatar */}
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white">
                    {user.name.charAt(0).toUpperCase()}
                </div>

                {isExpanded && (
                    <>
                        <div className="flex-1 truncate text-left">
                            <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="truncate text-xs text-gray-500">{user.email}</p>
                        </div>
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={cn(
                    'absolute bottom-full mb-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg',
                    !isExpanded ? 'left-full ml-2' : 'left-2 right-2'
                )}>
                    <div className="p-2">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Mi Perfil
                        </Link>

                        <div className="my-1 border-t border-gray-200" />

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}