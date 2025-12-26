import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                // Fuente principal - INTER (excelente para interfaces)
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                
                // Alternativas disponibles
                // sans: ['IBM Plex Sans', 'sans-serif'], // Muy legible para ERP
                // sans: ['Open Sans', 'sans-serif'], // Clásica y clara
                // sans: ['Nunito Sans', 'sans-serif'], // Amigable y profesional
            },
            
            // Tamaños de fuente ajustados para mejor legibilidad
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1.5' }],    // 12px
                'sm': ['0.875rem', { lineHeight: '1.5' }],   // 14px - Textos pequeños
                'base': ['1rem', { lineHeight: '1.6' }],     // 16px - Texto base (MÁS LEGIBLE)
                'lg': ['1.125rem', { lineHeight: '1.6' }],   // 18px
                'xl': ['1.25rem', { lineHeight: '1.5' }],    // 20px
                '2xl': ['1.5rem', { lineHeight: '1.4' }],    // 24px - Títulos
                '3xl': ['1.875rem', { lineHeight: '1.3' }],  // 30px
            },
            
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
            },
        },
    },

    plugins: [
        forms({
            strategy: 'class', // <--- ESTO ES LA CLAVE
        }),
    ]
};