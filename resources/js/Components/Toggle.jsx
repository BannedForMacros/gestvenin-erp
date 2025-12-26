import { cn } from '@/lib/utils';

export default function Toggle({ 
    enabled = false, 
    onChange,
    label,
    description,
    disabled = false,
    className = '',
}) {
    return (
        <div className={cn("flex items-start justify-between gap-4", className)}>
            {(label || description) && (
                <div className="flex-1">
                    {label && (
                        <span className="block text-base font-medium text-gray-900">
                            {label}
                        </span>
                    )}
                    {description && (
                        <p className="mt-1 text-sm text-gray-500">{description}</p>
                    )}
                </div>
            )}
            
            <button
                type="button"
                onClick={() => !disabled && onChange(!enabled)}
                disabled={disabled}
                // Añadimos 'appearance-none' y 'bg-none' para limpiar estilos del plugin forms
                className={cn(
                    'appearance-none relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
                    enabled ? 'bg-blue-600' : 'bg-gray-200',
                    disabled && 'cursor-not-allowed opacity-50'
                )}
            >
                <span
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                />
            </button>
        </div>
    );
}