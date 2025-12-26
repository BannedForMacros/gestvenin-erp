import { cn } from '@/lib/utils';
import { Pencil, Trash2, Eye, Download, Send, Copy, Archive, RefreshCw, Check, X } from 'lucide-react';

export default function ActionButton({
    type = 'edit',
    onClick,
    title,
    variant,
    icon: CustomIcon,
    className = '',
    ...props
}) {
    // Iconos predefinidos
    const icons = {
        edit: Pencil,
        delete: Trash2,
        view: Eye,
        download: Download,
        send: Send,
        copy: Copy,
        archive: Archive,
        refresh: RefreshCw,
        approve: Check,
        reject: X,
    };

    // Variantes de color predefinidas
    const variants = {
        edit: 'text-blue-600 hover:bg-blue-50',
        delete: 'text-red-600 hover:bg-red-50',
        view: 'text-gray-600 hover:bg-gray-100',
        download: 'text-green-600 hover:bg-green-50',
        send: 'text-purple-600 hover:bg-purple-50',
        copy: 'text-orange-600 hover:bg-orange-50',
        archive: 'text-yellow-600 hover:bg-yellow-50',
        refresh: 'text-blue-600 hover:bg-blue-50',
        approve: 'text-green-600 hover:bg-green-50',
        reject: 'text-red-600 hover:bg-red-50',
    };

    // Títulos por defecto
    const titles = {
        edit: 'Editar',
        delete: 'Eliminar',
        view: 'Ver',
        download: 'Descargar',
        send: 'Enviar',
        copy: 'Copiar',
        archive: 'Archivar',
        refresh: 'Actualizar',
        approve: 'Aprobar',
        reject: 'Rechazar',
    };

    const Icon = CustomIcon || icons[type];
    const colorClass = variant || variants[type] || variants.view;
    const buttonTitle = title || titles[type];

    return (
        <button
            onClick={onClick}
            title={buttonTitle}
            className={cn(
                'rounded-lg p-2 transition-colors',
                colorClass,
                className
            )}
            {...props}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}