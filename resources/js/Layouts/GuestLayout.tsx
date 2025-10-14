import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Flame } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-dark-900 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/" className="flex items-center space-x-3">
                    <Flame className="w-12 h-12 text-accent-primary" style={{
                        filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))',
                    }} />
                    <span className="text-3xl font-bold uppercase tracking-wider text-slate-100" style={{
                        fontFamily: "'Orbitron', sans-serif",
                        textShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
                    }}>
                        CLAVIS
                    </span>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-dark-700/50 backdrop-blur-sm border border-accent-primary/20 px-6 py-8 shadow-lg sm:max-w-md sm:rounded-xl" style={{
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
            }}>
                {children}
            </div>
        </div>
    );
}
