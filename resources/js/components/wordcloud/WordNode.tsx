import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface WordNodeProps {
    word: string;
    count: number;
    maxCount: number;
    index: number;
    onClick: (word: string) => void;
}

/**
 * Individual word node in the wordcloud
 * Size scales with frequency, includes hover effects and gravitational attraction
 */
export function WordNode({ word, count, maxCount, index, onClick }: WordNodeProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate font size based on frequency (min 1rem, max 6rem)
    const fontSize = Math.max(1, Math.min(6, 1 + (count / maxCount) * 5));

    // Random initial position within viewport
    const [position] = useState(() => ({
        x: Math.random() * 80 - 40, // -40% to 40%
        y: Math.random() * 80 - 40,
    }));

    // Random drift animation duration
    const [duration] = useState(() => 15 + Math.random() * 10);

    // Color based on frequency tier
    const getColor = () => {
        const ratio = count / maxCount;
        if (ratio > 0.7) return '#ffaa33'; // Solar (high frequency)
        if (ratio > 0.4) return '#8c52ff'; // Nebula (medium)
        return '#3a8dff'; // Starlight (low)
    };

    const getGlowClass = () => {
        const ratio = count / maxCount;
        if (ratio > 0.7) return 'text-glow-solar';
        if (ratio > 0.4) return 'text-glow-nebula';
        return 'text-glow-starlight';
    };

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: isHovered ? 1 : 0.85,
                scale: isHovered ? 1.15 : 1,
                x: position.x,
                y: position.y,
            }}
            transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
                x: {
                    duration: duration,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: [0.33, 1, 0.68, 1],
                },
                y: {
                    duration: duration * 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: [0.33, 1, 0.68, 1],
                },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick(word)}
            className={`
                absolute cursor-pointer font-display font-bold
                transition-all duration-300 gpu-accelerated
                ${isHovered ? getGlowClass() : ''}
                hover:z-10
            `}
            style={{
                fontSize: `${fontSize}rem`,
                color: getColor(),
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                textShadow: isHovered
                    ? `0 0 30px ${getColor()}80, 0 0 60px ${getColor()}40`
                    : 'none',
            }}
            aria-label={`${word} - ${count} posts`}
        >
            {word}
        </motion.button>
    );
}
