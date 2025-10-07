import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { CosmicScene } from '@/components/cosmic/CosmicScene';
import { CinematicIntro } from '@/components/intro/CinematicIntro';
import { WordCloudCanvas } from '@/components/wordcloud/WordCloudCanvas';
import { PostComposer } from '@/components/wordcloud/PostComposer';
import { WordDetailModal } from '@/components/wordcloud/WordDetailModal';
import axios from 'axios';

interface WordFrequency {
    id: number;
    word: string;
    count: number;
}

interface Post {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface WordcloudIndexProps {
    wordFrequencies: WordFrequency[];
    posts: Post[];
}

/**
 * Main Wordcloud page
 * Cosmic social media feed with dynamic word visualization
 */
export default function WordcloudIndex({
    wordFrequencies: initialWordFrequencies,
}: WordcloudIndexProps) {
    const [showIntro, setShowIntro] = useState(false);
    const [introComplete, setIntroComplete] = useState(false);
    const [wordFrequencies, setWordFrequencies] = useState(
        initialWordFrequencies
    );
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [selectedWordPosts, setSelectedWordPosts] = useState<Post[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Check if intro has been seen
    useEffect(() => {
        const introSeen = localStorage.getItem('clavis_intro_seen');
        if (!introSeen) {
            setShowIntro(true);
        } else {
            setIntroComplete(true);
        }
    }, []);

    // Handle intro completion
    const handleIntroComplete = () => {
        localStorage.setItem('clavis_intro_seen', 'true');
        setShowIntro(false);
        setIntroComplete(true);
    };

    // Poll for word frequency updates every 5 seconds
    useEffect(() => {
        if (!introComplete) return;

        const interval = setInterval(async () => {
            try {
                const response = await axios.get('/api/word-frequencies');
                setWordFrequencies(response.data.wordFrequencies);
            } catch (error) {
                console.error('Failed to fetch word frequencies:', error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [introComplete]);

    // Handle word click
    const handleWordClick = async (word: string) => {
        try {
            const response = await axios.get(`/posts/word/${word}`);
            setSelectedWord(word);
            setSelectedWordPosts(response.data.posts);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch posts for word:', error);
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedWord(null);
            setSelectedWordPosts([]);
        }, 300);
    };

    return (
        <>
            <Head title="Clavis - What Happened Today" />

            {/* Cinematic intro */}
            {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

            {/* Main content */}
            {introComplete && (
                <div className="relative min-h-screen">
                    {/* Cosmic particle background */}
                    <CosmicScene />

                    {/* Main container */}
                    <div className="relative z-10">
                        {/* Header */}
                        <header className="backdrop-cosmic fixed left-0 right-0 top-0 z-30 border-b border-[#28006d]">
                            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                                <h1 className="text-glow-nebula text-3xl font-bold text-[#8c52ff]">
                                    Clavis
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    What happened today?
                                </p>
                            </div>
                        </header>

                        {/* Wordcloud canvas */}
                        <main className="pt-20">
                            <WordCloudCanvas
                                wordFrequencies={wordFrequencies}
                                onWordClick={handleWordClick}
                            />
                        </main>

                        {/* Post composer - fixed bottom */}
                        <div className="fixed bottom-0 left-0 right-0 z-20 p-6">
                            <div className="container mx-auto max-w-2xl">
                                <PostComposer />
                            </div>
                        </div>
                    </div>

                    {/* Word detail modal */}
                    <WordDetailModal
                        word={selectedWord}
                        posts={selectedWordPosts}
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                    />
                </div>
            )}
        </>
    );
}
