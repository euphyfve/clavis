# 🔥 Clavis Wordboard - Setup Guide

## Next-Generation Social Media Word Cloud Platform

**Clavis Wordboard** is a hybrid between a wordcloud billboard and social pulse tracker. Built with Laravel 12 (backend) and React 18 (frontend with Inertia.js), it visualizes trending discussions as animated word clouds with real-time updates.

---

## 🎨 Design System: NEONVERSE

**Philosophy:** "Chaos is beautiful. Trends pulse with light."

### Color Palette
- **Background:** `#0E0B16` (Deep Space Black)
- **Surface:** `#1A1625` (Dark Purple)
- **Accent 1:** `#FF2E63` (Neon Magenta)
- **Accent 2:** `#08D9D6` (Cyber Aqua)
- **Text:** `#EAEAEA` (Light Gray)
- **Highlight:** `#FFD700` (Gold)

### Typography
- **Heading:** Orbitron Bold (uppercase)
- **Body:** Inter Regular
- **Word Cloud:** Audiowide

---

## 📋 Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL/MariaDB or PostgreSQL
- XAMPP (already installed)

---

## 🚀 Installation Steps

### 1. Install PHP Dependencies

```bash
cd c:\xampp\htdocs\clavis-pasha
composer install
```

### 2. Install Node Dependencies

```bash
npm install
```

This will install:
- React & React DOM
- Inertia.js
- Framer Motion (animations)
- Lucide React (icons)
- TypeScript
- Vite
- TailwindCSS

### 3. Configure Environment

Copy `.env.example` to `.env` (if not already done):

```bash
copy .env.example .env
```

Update your `.env` file with database credentials:

```env
APP_NAME="Clavis Wordboard"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=clavis_wordboard
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Create Database

Create a MySQL database named `clavis_wordboard`:

```sql
CREATE DATABASE clavis_wordboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or use phpMyAdmin at `http://localhost/phpmyadmin`

### 6. Run Migrations

```bash
php artisan migrate
```

This creates tables for:
- `topics` - Word cloud topics
- `posts` - User posts
- `post_topic` - Post-topic relationships
- `reactions` - Post reactions (🔥💬💡❤️)
- `user_stats` - XP, badges, streaks
- `users` - Enhanced with avatar, bio, seen_intro

### 7. Create Storage Link

```bash
php artisan storage:link
```

This allows public access to uploaded images.

### 8. Seed Demo Data (Optional)

Create a seeder for demo content:

```bash
php artisan make:seeder WordboardSeeder
```

Or manually register a user and start posting!

---

## 🎬 Running the Application

### Option 1: Using Laravel's Built-in Server

Open **two terminal windows**:

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

Then visit: `http://localhost:8000`

### Option 2: Using Composer Dev Script

```bash
composer dev
```

This runs all services concurrently (server, queue, logs, vite).

---

## 🎯 Core Features

### ✅ Implemented

1. **Dynamic Word Cloud Board**
   - Real-time scaling based on post count
   - Smooth hover effects with neon glow
   - Spiral positioning algorithm
   - Click to view topic feed

2. **Topic Posting System**
   - Text + optional image upload
   - Auto-extract hashtags (#topic)
   - Mentions support (@user)
   - Character limit (1000)

3. **Interactive Topic Feeds**
   - View all posts for a topic
   - Paginated results
   - Topic stats (post count, views, founder)

4. **Reactions System**
   - 🔥 Fire (trending)
   - 💬 Comment (discussion)
   - 💡 Idea (innovative)
   - ❤️ Heart (love)

5. **Gamification**
   - XP system (10 XP per post, 2 XP per reaction)
   - Badges:
     - 🔥 **Starter Flame** - First post
     - ⚔️ **Word Warrior** - 10 posts
     - 🌟 **Trendmaker** - 50 posts
     - 📅 **Week Streak** - 7-day posting streak
   - Daily streak tracking
   - Level system (Level = XP / 100)

6. **User Profiles**
   - Avatar upload
   - Bio
   - Activity stats (XP, posts, streak)
   - Badge showcase
   - "My Cloud" - Personal top topics

7. **Cinematic Intro Animation**
   - First-time user experience
   - "Hello, Clavis" fade-in reveal
   - "What Happened Today?" typewriter effect
   - Particle effects & sound pulse visualization
   - Auto-marks as seen

8. **NEONVERSE Design System**
   - Cyberpunk-inspired color palette
   - Neon glow effects
   - Smooth animations (Framer Motion)
   - Responsive layout
   - Mobile-friendly navigation

---

## 📁 Project Structure

```
clavis-pasha/
├── app/
│   ├── Http/Controllers/
│   │   ├── WordboardController.php    # Main wordboard page
│   │   ├── PostController.php         # Post CRUD
│   │   ├── TopicController.php        # Topic feeds
│   │   ├── ReactionController.php     # Reaction toggle
│   │   └── UserProfileController.php  # User profiles
│   ├── Models/
│   │   ├── Post.php
│   │   ├── Topic.php
│   │   ├── Reaction.php
│   │   ├── UserStats.php
│   │   └── User.php
│   └── Policies/
│       └── PostPolicy.php
├── database/migrations/
│   ├── 2025_01_01_000001_create_topics_table.php
│   ├── 2025_01_01_000002_create_posts_table.php
│   ├── 2025_01_01_000003_create_post_topic_table.php
│   ├── 2025_01_01_000004_create_reactions_table.php
│   ├── 2025_01_01_000005_create_user_stats_table.php
│   └── 2025_01_01_000006_add_wordboard_fields_to_users_table.php
├── resources/
│   ├── css/
│   │   └── app.css                    # Global styles + fonts
│   └── js/
│       ├── Components/
│       │   ├── CinematicIntro.tsx     # Intro animation
│       │   ├── WordCloud.tsx          # Word cloud visualization
│       │   ├── CreatePost.tsx         # Post creation form
│       │   └── PostCard.tsx           # Post display card
│       ├── Layouts/
│       │   └── WordboardLayout.tsx    # Main layout
│       ├── Pages/Wordboard/
│       │   ├── Index.tsx              # Main wordboard page
│       │   ├── TopicFeed.tsx          # Topic-specific feed
│       │   └── Profile.tsx            # User profile page
│       ├── config/
│       │   └── neonverse-theme.ts     # Design system config
│       ├── types/
│       │   └── wordboard.ts           # TypeScript interfaces
│       └── utils/
│           └── date.ts                # Date formatting
└── routes/
    └── web.php                        # All routes
```

---

## 🔧 API Endpoints

### Public Routes
- `GET /` - Main wordboard
- `GET /posts` - List posts (with filters)
- `GET /posts/{post}` - Single post
- `GET /topics` - List topics
- `GET /topics/trending` - Trending topics
- `GET /topics/{slug}` - Topic feed
- `GET /users/{user}` - User profile

### Authenticated Routes
- `POST /intro/seen` - Mark intro as seen
- `POST /posts` - Create post
- `DELETE /posts/{post}` - Delete post
- `POST /posts/{post}/reactions` - Toggle reaction
- `PATCH /user/profile` - Update profile
- `GET /user/stats` - Get user stats

---

## 🎨 Customization

### Adding New Badges

Edit `app/Models/UserStats.php` in the `checkAndAwardBadges()` method:

```php
if ($this->xp >= 500 && !in_array('legend', $badges)) {
    $badges[] = 'legend';
}
```

Then add to `resources/js/Pages/Wordboard/Profile.tsx`:

```typescript
const badgeInfo: Record<string, { name: string; icon: string; color: string }> = {
    // ... existing badges
    legend: { name: 'Legend', icon: '👑', color: '#FFD700' },
};
```

### Changing Theme Colors

Edit `resources/js/config/neonverse-theme.ts`:

```typescript
export const neonverseTheme = {
    colors: {
        background: '#YOUR_COLOR',
        accent1: '#YOUR_COLOR',
        // ...
    },
};
```

### Adjusting Word Cloud Algorithm

Edit `resources/js/Components/WordCloud.tsx`:

```typescript
const minSize = 16;  // Minimum font size
const maxSize = 80;  // Maximum font size
```

---

## 🚀 Future Enhancements

### Real-Time Updates (Laravel Echo + Pusher)

1. Install Laravel Echo and Pusher:
```bash
composer require pusher/pusher-php-server
npm install --save-dev laravel-echo pusher-js
```

2. Configure `.env`:
```env
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=mt1
```

3. Create events:
```bash
php artisan make:event PostCreated
php artisan make:event TopicUpdated
```

4. Broadcast in controllers:
```php
broadcast(new PostCreated($post))->toOthers();
```

5. Listen in React:
```typescript
Echo.channel('wordboard')
    .listen('PostCreated', (e) => {
        // Update UI
    });
```

### Additional Features
- Comment threads with nesting
- User following system
- Notifications
- Search functionality
- Category filters
- Mood-based themes
- Export word cloud as image
- Trending algorithm improvements
- Admin dashboard

---

## 🐛 Troubleshooting

### Issue: "Class 'Post' not found"
**Solution:** Run `composer dump-autoload`

### Issue: Vite not connecting
**Solution:** Ensure `npm run dev` is running and check `vite.config.js`

### Issue: Images not displaying
**Solution:** Run `php artisan storage:link`

### Issue: Database connection error
**Solution:** Check `.env` credentials and ensure MySQL is running in XAMPP

### Issue: TypeScript errors
**Solution:** Run `npm install` to install all dependencies

---

## 📝 License

MIT License - Feel free to use and modify!

---

## 🎉 Getting Started

1. Register a new account
2. Experience the cinematic intro
3. Create your first post with hashtags (#tech #gaming)
4. Watch the word cloud grow
5. Earn badges and XP
6. Explore trending topics

**Welcome to Clavis Wordboard - Where words pulse with life!** 🔥✨
