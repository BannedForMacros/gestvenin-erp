import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(function Input(
    { type = 'text', className = '', error = '', ...props },
    ref
) {
    return (
        <div className="w-full">
            <input
                type={type}
                className={cn(
                    'w-full rounded-lg border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
                    error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

export default Input;