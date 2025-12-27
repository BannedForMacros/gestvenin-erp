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

        // Estados de requerimientos
        borrador: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
        enviado: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        validado: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
        rechazado: 'bg-rose-100 text-rose-800 hover:bg-rose-200',
        comprado: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200',
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
        
        // Estados de requerimientos
        borrador: { variant: 'borrador', label: 'Borrador' },
        enviado: { variant: 'enviado', label: 'Enviado' },
        validado: { variant: 'validado', label: 'Validado' },
        rechazado: { variant: 'rechazado', label: 'Rechazado' },
        comprado: { variant: 'comprado', label: 'Comprado' },
        
        ...labels, // Override personalizado
    };

    const config = statusMap[status] || { variant: 'default', label: status };

    return (
        <Badge variant={config.variant}>
            {config.label}
        </Badge>
    );
};