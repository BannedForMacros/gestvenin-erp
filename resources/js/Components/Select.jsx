import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Select = forwardRef(function Select(
    { options = [], className = '', error = '', placeholder = 'Seleccionar...', ...props },
    ref
) {
    return (
        <div className="w-full">
            <select
                className={cn(
                    'w-full rounded-lg border px-4 py-2.5 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
                    error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
                    className
                )}
                ref={ref}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

export default Select;