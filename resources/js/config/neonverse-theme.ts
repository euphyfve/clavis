export const neonverseTheme = {
    colors: {
        background: '#0E0B16',
        surface: '#1A1625',
        accent1: '#FF2E63',
        accent2: '#08D9D6',
        text: '#EAEAEA',
        textMuted: '#9CA3AF',
        highlight: '#FFD700',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
    },
    
    typography: {
        heading: {
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            textTransform: 'uppercase' as const,
        },
        body: {
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
        },
        wordcloud: {
            fontFamily: "'Audiowide', cursive",
            fontWeight: 400,
        },
    },
    
    sizes: {
        h1: '64px',
        h2: '32px',
        h3: '24px',
        body: '18px',
        small: '14px',
    },
    
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
    },
    
    effects: {
        glow: {
            neon: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            soft: '0 0 15px rgba(255, 46, 99, 0.5)',
            pulse: '0 0 20px rgba(8, 217, 214, 0.6)',
        },
        blur: {
            sm: '4px',
            md: '8px',
            lg: '16px',
        },
    },
    
    animation: {
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms',
        },
    },
};

export type NeonverseTheme = typeof neonverseTheme;
