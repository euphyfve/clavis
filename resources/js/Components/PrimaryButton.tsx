import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-accent-primary to-accent-purple px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-dark-900 active:opacity-80 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
            style={{
                boxShadow: disabled ? 'none' : '0 4px 20px rgba(99, 102, 241, 0.3)',
            }}
        >
            {children}
        </button>
    );
}
