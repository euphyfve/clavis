# 🔥 Clavis Wordboard

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
</p>

<p align="center">
  <strong>A next-generation social media platform where words pulse with life</strong>
</p>

<p align="center">
  Hybrid between a wordcloud billboard and social pulse tracker.<br>
  Visualize trending discussions as animated word clouds with real-time updates.
</p>

---

## ✨ What is Clavis Wordboard?

**Clavis Wordboard** transforms social conversations into living, breathing word clouds. The more people post about a topic, the bigger the word becomes. Click any word to dive into its feed, create posts with hashtags, earn badges, and watch your influence grow.

### 🎯 Target Audience
Gen Z (16-28 years old) - tech-savvy, visually-driven, gamification-loving users.

### 🎨 Design Philosophy
**NEONVERSE** - "Chaos is beautiful. Trends pulse with light."
- Cinematic, playful, tech-futuristic aesthetic
- Cyberpunk-inspired color palette
- Emotionally expressive animations
- Smooth, satisfying interactions

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
composer install
npm install

# 2. Setup environment
php artisan key:generate
php artisan storage:link

# 3. Configure database in .env
DB_DATABASE=clavis_wordboard

# 4. Run migrations
php artisan migrate

# 5. (Optional) Seed demo data
php artisan db:seed

# 6. Start servers
php artisan serve    # Terminal 1
npm run dev          # Terminal 2

# 7. Visit http://localhost:8000
```

📖 **Full setup guide:** See [QUICK_START.md](QUICK_START.md)

---

## 🌟 Key Features

### 🎨 Dynamic Word Cloud
- Real-time visualization of trending topics
- Words scale based on popularity
- Smooth animations with neon glow effects
- Click to explore topic feeds

### 📝 Smart Posting
- Text + image uploads
- Auto-extract hashtags (#topic)
- Auto-extract mentions (@user)
- Hashtag suggestions while typing

### 🎮 Gamification
- **XP System:** Earn points for engagement
- **Badges:** Starter Flame, Word Warrior, Trendmaker, Week Streak
- **Streaks:** Daily posting challenges
- **Levels:** Progress through ranks

### 👤 User Profiles
- Avatar & bio customization
- Activity stats (XP, posts, streak)
- Badge showcase
- "My Cloud" - Personal top topics

### 🎬 Cinematic Intro
- First-time user experience
- "Hello, Clavis" → "What Happened Today?"
- Particle effects & sound pulse visualization

### 💬 Reactions
- 🔥 Fire - Trending
- 💬 Comment - Discussion-worthy
- 💡 Idea - Innovative
- ❤️ Heart - Love it

---

## 🛠️ Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **MySQL** - Database
- **Eloquent ORM** - Database relationships
- **Laravel Sanctum** - API authentication
- **Inertia.js** - SPA without API

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Inertia.js** - Server-driven SPA
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Design
- **NEONVERSE Theme** - Custom design system
- **Orbitron** - Heading font
- **Inter** - Body font
- **Audiowide** - Word cloud font

---

## 📁 Project Structure

```
clavis-pasha/
├── app/
│   ├── Http/Controllers/
│   │   ├── WordboardController.php
│   │   ├── PostController.php
│   │   ├── TopicController.php
│   │   ├── ReactionController.php
│   │   └── UserProfileController.php
│   ├── Models/
│   │   ├── Post.php
│   │   ├── Topic.php
│   │   ├── Reaction.php
│   │   ├── UserStats.php
│   │   └── User.php
│   └── Policies/
│       └── PostPolicy.php
├── database/migrations/
│   └── [6 migration files]
├── resources/
│   ├── css/app.css
│   └── js/
│       ├── Components/
│       │   ├── CinematicIntro.tsx
│       │   ├── WordCloud.tsx
│       │   ├── CreatePost.tsx
│       │   └── PostCard.tsx
│       ├── Layouts/
│       │   └── WordboardLayout.tsx
│       ├── Pages/Wordboard/
│       │   ├── Index.tsx
│       │   ├── TopicFeed.tsx
│       │   └── Profile.tsx
│       └── types/wordboard.ts
└── routes/web.php
```

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes
- **[WORDBOARD_SETUP.md](WORDBOARD_SETUP.md)** - Complete setup guide
- **[FEATURES.md](FEATURES.md)** - Detailed feature documentation

---

## 🎮 Usage Examples

### Create a Post
```
Just discovered an amazing new #ai tool! 🚀 #tech #productivity
```

### View Topic Feed
Click any word in the word cloud → See all posts about that topic

### Earn Badges
- Post once → 🔥 Starter Flame
- Post 10 times → ⚔️ Word Warrior
- Post 50 times → 🌟 Trendmaker
- 7-day streak → 📅 Week Streak

---

## 🔮 Future Enhancements

### Phase 1: Real-Time
- [ ] Laravel Echo + Pusher integration
- [ ] Live word cloud updates
- [ ] Real-time notifications

### Phase 2: Social
- [ ] Comment threads (nested replies)
- [ ] User following system
- [ ] Direct messages

### Phase 3: Discovery
- [ ] Search functionality
- [ ] Category filters
- [ ] Trending algorithm

### Phase 4: Content
- [ ] Video uploads
- [ ] GIF support
- [ ] Link previews
- [ ] Poll creation

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## 🙏 Acknowledgments

- **Laravel** - The PHP framework for web artisans
- **React** - A JavaScript library for building user interfaces
- **Inertia.js** - The modern monolith
- **TailwindCSS** - Rapidly build modern websites
- **Framer Motion** - Production-ready animation library

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<p align="center">
  <strong>Built with ❤️ for Gen Z</strong><br>
  Where words pulse with life 🔥✨
</p>
