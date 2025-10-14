import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Topic } from '@/types/wordboard';
import { router } from '@inertiajs/react';

interface Props {
    topics: Topic[];
}

interface WordPosition {
    topic: Topic;
    x: number;
    y: number;
    size: number;
    rotation: number;
    color: string;
}

export default function WordCloud({ topics }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [words, setWords] = useState<WordPosition[]>([]);
    const [hoveredWord, setHoveredWord] = useState<number | null>(null);
    const [showDebug] = useState(false); // Set to true to see collision boxes

    useEffect(() => {
        if (!containerRef.current || topics.length === 0) {
            return;
        }

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        // Calculate word sizes
        const maxCount = Math.max(...topics.map(t => t.count), 1);
        const minSize = 20;
        const maxSize = 72;

        // Color palette - Modern subtle gradients
        const colors = ['#6366F1', '#8B5CF6', '#10B981', '#14B8A6', '#F59E0B', '#EC4899', '#3B82F6'];

        // Sort topics by count (largest first for better placement)
        // Limit to top 25 most popular topics only
        const sortedTopics = [...topics]
            .sort((a, b) => b.count - a.count)
            .slice(0, 25);

        // Position words using improved algorithm with proper collision detection
        const positioned: WordPosition[] = [];
        const maxAttempts = 100;

        // Helper function to estimate text width
        const estimateTextWidth = (text: string, fontSize: number): number => {
            // Approximate width: each character is ~0.6 of font size for Audiowide font
            return text.length * fontSize * 0.65;
        };

        // Helper function to check if two rectangles overlap
        const checkCollision = (x1: number, y1: number, w1: number, h1: number, 
                                x2: number, y2: number, w2: number, h2: number, 
                                padding: number = 40): boolean => {
            return !(
                x1 + w1/2 + padding < x2 - w2/2 ||
                x1 - w1/2 - padding > x2 + w2/2 ||
                y1 + h1/2 + padding < y2 - h2/2 ||
                y1 - h1/2 - padding > y2 + h2/2
            );
        };

        sortedTopics.forEach((topic, index) => {
            const size = minSize + ((topic.count / maxCount) * (maxSize - minSize));
            const textWidth = estimateTextWidth(topic.name, size);
            const textHeight = size * 1.2; // Add some vertical padding
            
            let placed = false;
            let attempts = 0;
            
            // Try different positioning strategies
            while (!placed && attempts < maxAttempts) {
                let x, y;
                
                if (index === 0) {
                    // First word in center
                    x = centerX;
                    y = centerY;
                } else if (attempts < 30) {
                    // Try spiral pattern first with better spacing
                    const angle = (index * 2.8) + (attempts * 0.4);
                    const radius = 80 + (index * 35) + (attempts * 8);
                    x = centerX + radius * Math.cos(angle);
                    y = centerY + radius * Math.sin(angle);
                } else if (attempts < 60) {
                    // Try grid-like pattern
                    const gridSize = 150;
                    const gridX = Math.floor(attempts / 6) - 3;
                    const gridY = (attempts % 6) - 3;
                    x = centerX + (gridX * gridSize) + (Math.random() - 0.5) * 50;
                    y = centerY + (gridY * gridSize) + (Math.random() - 0.5) * 50;
                } else {
                    // Random placement as fallback
                    const margin = 150;
                    x = margin + Math.random() * (width - 2 * margin);
                    y = margin + Math.random() * (height - 2 * margin);
                }
                
                // Ensure word stays within bounds with generous padding
                // Account for text width, rotation, and padding
                const safeMarginX = Math.max(textWidth / 2 + 60, 120);
                const safeMarginY = Math.max(textHeight / 2 + 40, 80);
                
                x = Math.max(safeMarginX, Math.min(width - safeMarginX, x));
                y = Math.max(safeMarginY, Math.min(height - safeMarginY, y));
                
                // Check collision with existing words
                const hasCollision = positioned.some(word => {
                    const wordWidth = estimateTextWidth(word.topic.name, word.size);
                    const wordHeight = word.size * 1.2;
                    return checkCollision(x, y, textWidth, textHeight, 
                                         word.x, word.y, wordWidth, wordHeight, 50);
                });
                
                if (!hasCollision) {
                    positioned.push({
                        topic,
                        x,
                        y,
                        size,
                        rotation: (Math.random() - 0.5) * 10, // Reduced rotation for better readability
                        color: colors[index % colors.length],
                    });
                    placed = true;
                }
                
                attempts++;
            }
            
            // Force placement if max attempts reached (with extra spacing)
            if (!placed) {
                const angle = index * 3.5;
                const radius = 150 + (index * 45);
                let x = centerX + radius * Math.cos(angle);
                let y = centerY + radius * Math.sin(angle);
                
                // Apply same safe margins
                const safeMarginX = Math.max(textWidth / 2 + 60, 120);
                const safeMarginY = Math.max(textHeight / 2 + 40, 80);
                x = Math.max(safeMarginX, Math.min(width - safeMarginX, x));
                y = Math.max(safeMarginY, Math.min(height - safeMarginY, y));
                
                positioned.push({
                    topic,
                    x,
                    y,
                    size,
                    rotation: (Math.random() - 0.5) * 10,
                    color: colors[index % colors.length],
                });
            }
        });

        setWords(positioned);
    }, [topics]);

    const handleWordClick = (slug: string) => {
        router.visit(`/topics/${slug}`);
    };

    // Helper to estimate text width (same as in useEffect)
    const estimateTextWidth = (text: string, fontSize: number): number => {
        return text.length * fontSize * 0.65;
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-[600px] overflow-hidden rounded-2xl bg-gradient-to-br from-dark-700 to-dark-900 border border-accent-primary/20"
            style={{
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
            }}
        >
            {/* Background grid effect */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(#6366F1 1px, transparent 1px), linear-gradient(90deg, #6366F1 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }} />
            </div>

            {/* Floating particles */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-accent-primary rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Topic counter badge */}
            {topics.length > 0 && (
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-dark-700/80 backdrop-blur-sm border border-accent-secondary/30 rounded-lg">
                    <span className="text-xs text-accent-secondary font-semibold">
                        {Math.min(topics.length, 25)} trending topics
                    </span>
                </div>
            )}

            {/* Words */}
            <div className="relative w-full h-full">
                {topics.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-slate-400 text-xl mb-2">No topics yet</p>
                            <p className="text-slate-500 text-sm">Create a post with #hashtags to see them here!</p>
                        </div>
                    </div>
                )}
                
                {words.map((word, index) => {
                    const textWidth = estimateTextWidth(word.topic.name, word.size);
                    const textHeight = word.size * 1.2;
                    
                    return (
                        <React.Fragment key={word.topic.id}>
                            {/* Debug collision box (only visible when showDebug is true) */}
                            {showDebug && (
                                <div
                                    className="absolute pointer-events-none border border-red-500/50"
                                    style={{
                                        left: `${word.x - textWidth/2 - 25}px`,
                                        top: `${word.y - textHeight/2 - 10}px`,
                                        width: `${textWidth + 50}px`,
                                        height: `${textHeight + 20}px`,
                                    }}
                                />
                            )}
                            
                            <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: hoveredWord === word.topic.id ? 1.15 : 1,
                                }}
                                transition={{
                                    delay: index * 0.05,
                                    duration: 0.5,
                                    scale: { duration: 0.3 },
                                }}
                                onClick={() => handleWordClick(word.topic.slug)}
                                onMouseEnter={() => setHoveredWord(word.topic.id)}
                                onMouseLeave={() => setHoveredWord(null)}
                                className="absolute cursor-pointer font-bold uppercase tracking-wider select-none"
                                style={{
                                    fontSize: `${word.size}px`,
                                    color: word.color,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    left: `${word.x}px`,
                                    top: `${word.y}px`,
                                    transform: `translate(-50%, -50%) rotate(${word.rotation}deg)`,
                                    textShadow: hoveredWord === word.topic.id 
                                        ? `0 0 20px ${word.color}80, 0 0 40px ${word.color}40`
                                        : `0 0 8px ${word.color}60`,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    filter: hoveredWord === word.topic.id 
                                        ? 'brightness(1.3)'
                                        : 'brightness(1)',
                                    whiteSpace: 'nowrap',
                                    padding: '5px 10px',
                                }}
                            >
                                {word.topic.name}
                        
                                {/* Hover tooltip */}
                                {hoveredWord === word.topic.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-dark-700 border border-accent-primary/30 rounded-lg text-sm whitespace-nowrap"
                                        style={{
                                            fontSize: '14px',
                                            textShadow: 'none',
                                            fontFamily: "'Inter', sans-serif",
                                            textTransform: 'none',
                                            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)',
                                        }}
                                    >
                                        <div className="text-slate-100">{word.topic.count} posts</div>
                                        {word.topic.founder && (
                                            <div className="text-slate-400 text-xs">
                                                by {word.topic.founder.name}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.button>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Center glow effect */}
            <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
                }}
            />
        </div>
    );
}
