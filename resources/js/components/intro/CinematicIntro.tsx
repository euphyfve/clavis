import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CinematicIntroProps {
    onComplete: () => void;
}

/**
 * Cinematic intro sequence with syllable-based animations
 * "Hello, Clavis" → "What Happened Today"
 */
export function CinematicIntro({ onComplete }: CinematicIntroProps) {
    const [phase, setPhase] = useState<'hello' | 'question' | 'complete'>('hello');

    useEffect(() => {
        // Phase 1: Show "Hello, Clavis" for 2.5s
        const helloTimer = setTimeout(() => {
            setPhase('question');
        }, 2500);

        // Phase 2: Show "What Happened Today" for 2.5s
        const questionTimer = setTimeout(() => {
            setPhase('complete');
            setTimeout(onComplete, 500); // Fade out duration
        }, 5000);

        return () => {
            clearTimeout(helloTimer);
            clearTimeout(questionTimer);
        };
    }, [onComplete]);

    // Syllable animation variants
    const syllableVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 1.1 },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <AnimatePresence mode="wait">
            {phase !== 'complete' && (
                <motion.div
                    key="intro-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#030014]"
                >
                    <AnimatePresence mode="wait">
                        {phase === 'hello' && (
                            <motion.div
                                key="hello"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="text-center"
                            >
                                <motion.div className="flex items-center justify-center gap-4 text-6xl font-bold md:text-8xl">
                                    <motion.span
                                        variants={syllableVariants}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.33, 1, 0.68, 1],
                                        }}
                                        className="text-glow-starlight text-[#3a8dff]"
                                    >
                                        Hel
                                    </motion.span>
                                    <motion.span
                                        variants={syllableVariants}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.33, 1, 0.68, 1],
                                            delay: 0.08,
                                        }}
                                        className="text-glow-starlight text-[#3a8dff]"
                                    >
                                        lo,
                                    </motion.span>
                                    <motion.span
                                        variants={syllableVariants}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.33, 1, 0.68, 1],
                                            delay: 0.16,
                                        }}
                                        className="text-glow-nebula text-[#8c52ff]"
                                    >
                                        Cla
                                    </motion.span>
                                    <motion.span
                                        variants={syllableVariants}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.33, 1, 0.68, 1],
                                            delay: 0.24,
                                        }}
                                        className="text-glow-nebula text-[#8c52ff]"
                                    >
                                        vis
                                    </motion.span>
                                </motion.div>
                            </motion.div>
                        )}

                        {phase === 'question' && (
                            <motion.div
                                key="question"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="text-center"
                            >
                                <motion.div className="flex flex-wrap items-center justify-center gap-3 px-8 text-5xl font-bold md:gap-4 md:text-7xl">
                                    <motion.span
                                        variants={syllableVariants}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.33, 1, 0.68, 1],
                                        }}
                                        className="text-glow-solar text-[#ffaa33]"
                                    >
                                        What
                                    </motion.span>
                                    <motion.span
                                        variants={syllableVariants}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.33, 1, 0.68, 1],
                                            delay: 0.1,
                                        }}
                                        className="text-glow-starlight text-[#3a8dff]"
                                    >
                                        Hap
                                    </motion.span>
                                    <motion.span
                                        variants={syllableVariants}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.33, 1, 0.68, 1],
                                            delay: 0.18,
                                        }}
                                        className="text-glow-starlight text-[#3a8dff]"
                                    >
                                        pened
                                    </motion.span>
                                    <motion.span
                                        variants={syllableVariants}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.33, 1, 0.68, 1],
                                            delay: 0.26,
                                        }}
                                        className="text-glow-nebula text-[#8c52ff]"
                                    >
                                        To
                                    </motion.span>
                                    <motion.span
                                        variants={syllableVariants}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.33, 1, 0.68, 1],
                                            delay: 0.34,
                                        }}
                                        className="text-glow-nebula text-[#8c52ff]"
                                    >
                                        day
                                    </motion.span>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
