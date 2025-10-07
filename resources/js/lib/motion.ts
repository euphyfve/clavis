/**
 * Motion choreography utilities
 * Orbital Rhythm easing and animation presets
 */

// Orbital Rhythm easing - cubic-bezier(0.33, 1, 0.68, 1)
export const orbitalEasing = [0.33, 1, 0.68, 1] as const;

// Standard easings
export const easings = {
    orbital: [0.33, 1, 0.68, 1] as const,
    in: [0.4, 0, 1, 1] as const,
    out: [0, 0, 0.2, 1] as const,
    inOut: [0.4, 0, 0.2, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
} as const;

// Duration presets (in seconds)
export const durations = {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.7,
    slowest: 1,
} as const;

// Common animation variants
export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const fadeInDown = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

export const slideInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
};

export const slideInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

// Stagger children animation
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

// Cosmic glow pulse animation
export const glowPulse = {
    initial: { filter: 'drop-shadow(0 0 0px currentColor)' },
    animate: {
        filter: [
            'drop-shadow(0 0 0px currentColor)',
            'drop-shadow(0 0 20px currentColor)',
            'drop-shadow(0 0 0px currentColor)',
        ],
    },
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: easings.orbital,
    },
};

// Floating animation
export const floating = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: easings.orbital,
        },
    },
};

// Orbital rotation
export const orbitalRotation = {
    animate: {
        rotate: 360,
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
        },
    },
};
