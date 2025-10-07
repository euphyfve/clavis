import { Canvas } from '@react-three/fiber';
import { CosmicBackground } from './CosmicBackground';

/**
 * WebGL scene wrapper for cosmic background
 * Provides the Three.js canvas context
 */
export function CosmicScene() {
    return (
        <div className="fixed inset-0 -z-10">
            <Canvas
                camera={{ position: [0, 0, 30], fov: 75 }}
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: 'high-performance',
                }}
                dpr={[1, 2]}
            >
                <CosmicBackground />
            </Canvas>
        </div>
    );
}
