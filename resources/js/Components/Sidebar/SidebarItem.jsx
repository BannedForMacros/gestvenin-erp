import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/Components/Icon';

export default function SidebarItem({ module, isExpanded }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = module.children && module.children.length > 0;

    const iconMap = {
        'LayoutDashboard': 'dashboard',
        'ShoppingCart': 'shopping',
        'Truck': 'truck',
        'Warehouse': 'warehouse',
        'Receipt': 'receipt',
        'CreditCard': 'creditCard',
        'Package': 'package',
        'Calculator': 'calculator',
        'AlertTriangle': 'alert',
        'FileText': 'chart',
        'Settings': 'settings',
    };

    const iconName = iconMap[module.icono] || 'dashboard';

    if (hasChildren) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Icon name={iconName} className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        {isExpanded && <span>{module.nombre}</span>}
                    </div>
                    {isExpanded && (
                        <Icon 
                            name="chevronDown" 
                            className={cn(
                                'h-4 w-4 transition-transform text-gray-400',
                                isOpen && 'rotate-180'
                            )} 
                        />
                    )}
                </button>

                {isExpanded && isOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                        {module.children.map((child) => (
                            <Link
                                key={child.id}
                                href={child.ruta || '#'}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                            >
                                {/* Punto indicador para hijos */}
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                {child.nombre}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={module.ruta || '#'}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
            )}
        >
            <Icon name={iconName} className="h-5 w-5 flex-shrink-0 text-gray-500" />
            {isExpanded && <span>{module.nombre}</span>}
        </Link>
    );
}