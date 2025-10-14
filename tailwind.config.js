import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['Orbitron', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                dark: {
                    900: '#0A0E27',
                    800: '#0F1419',
                    700: '#1A1F2E',
                    600: '#252A3A',
                },
                accent: {
                    primary: '#6366F1',
                    secondary: '#10B981',
                    purple: '#8B5CF6',
                    teal: '#14B8A6',
                },
            },
        },
    },

    plugins: [forms],
};
