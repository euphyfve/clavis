import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { getOptimalParticleCount } from '@/lib/performance';

/**
 * Cosmic particle field background
 * Creates a dynamic starfield with parallax drift
 * Adaptive particle count based on device capabilities
 */
export function CosmicBackground() {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate random particle positions with adaptive count
    const particleCount = useMemo(() => getOptimalParticleCount(), []);
    const positions = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Distribute particles in a sphere
            const radius = 50 + Math.random() * 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
        }

        return positions;
    }, []);

    // Animate particles with orbital drift
    useFrame((state) => {
        if (!pointsRef.current) return;

        const time = state.clock.getElapsedTime();

        // Slow rotation for cosmic drift
        pointsRef.current.rotation.x = time * 0.02;
        pointsRef.current.rotation.y = time * 0.03;
    });

    return (
        <Points
            ref={pointsRef}
            positions={positions}
            stride={3}
            frustumCulled={false}
        >
            <PointMaterial
                transparent
                color="#3a8dff"
                size={0.3}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}
