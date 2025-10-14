import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';

interface Props {
    onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: Props) {
    const [stage, setStage] = useState<'hello' | 'question' | 'complete'>('hello');

    useEffect(() => {
        // Hello stage
        const helloTimer = setTimeout(() => {
            setStage('question');
        }, 2500);

        // Question stage
        const questionTimer = setTimeout(() => {
            setStage('complete');
            
            // Mark intro as seen
            router.post('/intro/seen', {}, {
                preserveScroll: true,
                preserveState: true,
            });
            
            // Complete animation
            setTimeout(() => {
                onComplete();
            }, 1000);
        }, 5500);

        return () => {
            clearTimeout(helloTimer);
            clearTimeout(questionTimer);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-900"
            >
                {/* Background particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-accent-primary rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                opacity: [0, 0.6, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                    <AnimatePresence mode="wait">
                        {stage === 'hello' && (
                            <motion.div
                                key="hello"
                                initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.8 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                                exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.2 }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            >
                                <h1 
                                    className="text-8xl font-bold uppercase tracking-widest"
                                    style={{
                                        fontFamily: "'Orbitron', sans-serif",
                                        background: 'linear-gradient(135deg, #6366F1 0%, #10B981 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        filter: 'drop-shadow(0 0 40px rgba(99, 102, 241, 0.5)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))',
                                    }}
                                >
                                    HELLO, CLAVIS
                                </h1>
                            </motion.div>
                        )}

                        {stage === 'question' && (
                            <motion.div
                                key="question"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="space-y-4">
                                    <motion.h2 
                                        className="text-6xl font-bold uppercase"
                                        style={{
                                            fontFamily: "'Orbitron', sans-serif",
                                            color: '#F1F5F9',
                                        }}
                                    >
                                        {Array.from("What Happened Today?").map((char, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                style={{
                                                    display: 'inline-block',
                                                    textShadow: char !== ' ' ? '0 0 15px rgba(99, 102, 241, 0.4)' : 'none',
                                                }}
                                            >
                                                {char === ' ' ? '\u00A0' : char}
                                            </motion.span>
                                        ))}
                                    </motion.h2>

                                    {/* Pulse effect */}
                                    <motion.div
                                        className="w-32 h-1 mx-auto bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
                                        animate={{
                                            scaleX: [1, 1.5, 1],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sound pulse visualization */}
                <motion.div
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                >
                    <div className="flex items-end space-x-2">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 bg-accent-secondary rounded-full"
                                style={{
                                    height: `${20 + Math.random() * 40}px`,
                                }}
                                animate={{
                                    height: [
                                        `${20 + Math.random() * 40}px`,
                                        `${40 + Math.random() * 60}px`,
                                        `${20 + Math.random() * 40}px`,
                                    ],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
