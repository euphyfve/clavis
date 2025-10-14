export interface Topic {
    id: number;
    name: string;
    slug: string;
    count: number;
    post_count: number;
    view_count: number;
    founder: {
        id: number;
        name: string;
        avatar: string | null;
    } | null;
    category: string | null;
    mood: string | null;
}

export interface Post {
    id: number;
    user_id: number;
    content: string;
    image_path: string | null;
    mentions: string[];
    hashtags: string[];
    reaction_count: number;
    comment_count: number;
    parent_id: number | null;
    created_at: string;
    user: User;
    topics: Topic[];
    reactions: Reaction[];
    replies?: Post[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    seen_intro: boolean;
    stats?: UserStats;
}

export interface UserStats {
    id: number;
    user_id: number;
    xp: number;
    post_count: number;
    streak_days: number;
    last_post_date: string | null;
    badges: string[];
    theme_preference: 'neonverse' | 'light' | 'dark' | 'cyber';
}

export interface Reaction {
    id: number;
    user_id: number;
    post_id: number;
    type: 'fire' | 'idea' | 'heart';
    user: User;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: string;
}
