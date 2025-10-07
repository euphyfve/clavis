/**
 * Type definitions for Clavis Wordcloud
 * Production-level TypeScript types
 */

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: number;
    user_id: number;
    content: string;
    normalized_content: string;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface WordFrequency {
    id: number;
    word: string;
    count: number;
    created_at: string;
    updated_at: string;
}

export interface WordcloudPageProps {
    wordFrequencies: WordFrequency[];
    posts: Post[];
}

export interface WordNodeProps {
    word: string;
    count: number;
    maxCount: number;
    index: number;
    onClick: (word: string) => void;
}

export interface WordCloudCanvasProps {
    wordFrequencies: WordFrequency[];
    onWordClick: (word: string) => void;
}

export interface PostComposerProps {
    className?: string;
}

export interface WordDetailModalProps {
    word: string | null;
    posts: Post[];
    isOpen: boolean;
    onClose: () => void;
}

export interface CinematicIntroProps {
    onComplete: () => void;
}

// Animation types
export interface MotionVariants {
    hidden: {
        opacity: number;
        y?: number;
        x?: number;
        scale?: number;
    };
    visible: {
        opacity: number;
        y?: number;
        x?: number;
        scale?: number;
    };
    exit?: {
        opacity: number;
        y?: number;
        x?: number;
        scale?: number;
    };
}

// API Response types
export interface WordByWordResponse {
    word: string;
    posts: Post[];
}

export interface WordFrequenciesResponse {
    wordFrequencies: WordFrequency[];
}

export interface PostStoreResponse {
    success: boolean;
    message: string;
    post?: Post;
}
