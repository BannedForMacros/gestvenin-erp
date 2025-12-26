import { cn } from '@/lib/utils';

export default function Badge({ 
    variant = 'default',
    children,
    className = '',
}) {
    const variants = {
        // Estados generales
        default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        
        // Estados activo/inactivo
        success: 'bg-green-100 text-green-800 hover:bg-green-200',
        danger: 'bg-red-100 text-red-800 hover:bg-red-200',
        
        // Estados de proceso
        warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        
        // Estados especiales
        pending: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
        processing: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        completed: 'bg-green-100 text-green-800 hover:bg-green-200',
        cancelled: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        
        // Primary (tu color del sistema)
        primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold transition-colors cursor-default',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}

// Helper para determinar variante según estado booleano
Badge.fromBoolean = function({ value, trueLabel = 'Activo', falseLabel = 'Inactivo' }) {
    return (
        <Badge variant={value ? 'success' : 'danger'}>
            {value ? trueLabel : falseLabel}
        </Badge>
    );
};

// Helper para estados personalizados
Badge.fromStatus = function({ status, labels }) {
    const statusMap = {
        activo: { variant: 'success', label: 'Activo' },
        inactivo: { variant: 'danger', label: 'Inactivo' },
        pendiente: { variant: 'warning', label: 'Pendiente' },
        proceso: { variant: 'processing', label: 'En Proceso' },
        completado: { variant: 'completed', label: 'Completado' },
        cancelado: { variant: 'cancelled', label: 'Cancelado' },
        ...labels, // Override personalizado
    };

    const config = statusMap[status] || { variant: 'default', label: status };

    return (
        <Badge variant={config.variant}>
            {config.label}
        </Badge>
    );
};