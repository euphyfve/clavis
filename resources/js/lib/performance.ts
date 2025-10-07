/**
 * Performance optimization utilities
 * GPU acceleration, debouncing, and lazy loading helpers
 */

/**
 * Check if device supports GPU acceleration
 */
export function supportsGPUAcceleration(): boolean {
    const canvas = document.createElement('canvas');
    const gl =
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
    return !!gl;
}

/**
 * Check if device is low-end (for adaptive quality)
 */
export function isLowEndDevice(): boolean {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // Check for low memory (if available)
    const memory = (navigator as any).deviceMemory;
    const hasLowMemory = memory && memory < 4;

    // Check for slow connection
    const connection = (navigator as any).connection;
    const hasSlowConnection =
        connection &&
        (connection.effectiveType === 'slow-2g' ||
            connection.effectiveType === '2g');

    return prefersReducedMotion || hasLowMemory || hasSlowConnection;
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll/resize events
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback =
    window.requestIdleCallback ||
    function (cb: IdleRequestCallback) {
        const start = Date.now();
        return setTimeout(() => {
            cb({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
            });
        }, 1);
    };

/**
 * Cancel idle callback polyfill
 */
export const cancelIdleCallback =
    window.cancelIdleCallback ||
    function (id: number) {
        clearTimeout(id);
    };

/**
 * Preload image
 */
export function preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Get optimal particle count based on device
 */
export function getOptimalParticleCount(): number {
    if (isLowEndDevice()) return 500;
    if (!supportsGPUAcceleration()) return 1000;
    return 2000;
}

/**
 * Enable GPU acceleration for element
 */
export function enableGPUAcceleration(element: HTMLElement): void {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
}

/**
 * Disable GPU acceleration (cleanup)
 */
export function disableGPUAcceleration(element: HTMLElement): void {
    element.style.transform = '';
    element.style.willChange = 'auto';
}
