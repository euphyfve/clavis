import { motion } from 'framer-motion';
import { WordNode } from './WordNode';

interface WordFrequency {
    id: number;
    word: string;
    count: number;
}

interface WordCloudCanvasProps {
    wordFrequencies: WordFrequency[];
    onWordClick: (word: string) => void;
}

/**
 * Main wordcloud canvas
 * Displays all word nodes with dynamic positioning and animations
 */
export function WordCloudCanvas({
    wordFrequencies,
    onWordClick,
}: WordCloudCanvasProps) {
    const maxCount = Math.max(...wordFrequencies.map((w) => w.count), 1);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            className="relative h-screen w-full overflow-hidden"
            role="region"
            aria-label="Interactive word cloud"
        >
            {wordFrequencies.map((wordFreq, index) => (
                <WordNode
                    key={wordFreq.id}
                    word={wordFreq.word}
                    count={wordFreq.count}
                    maxCount={maxCount}
                    index={index}
                    onClick={onWordClick}
                />
            ))}

            {/* Empty state */}
            {wordFrequencies.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="text-center">
                        <h2 className="text-glow-starlight mb-4 text-4xl font-bold text-[#3a8dff]">
                            The void awaits...
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Be the first to share what happened today
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
