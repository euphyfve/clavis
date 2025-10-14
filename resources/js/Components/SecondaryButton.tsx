import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded-lg border border-accent-secondary bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-accent-secondary transition duration-150 ease-in-out hover:bg-accent-secondary/10 focus:outline-none focus:ring-2 focus:ring-accent-secondary focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
