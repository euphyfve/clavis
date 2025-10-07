# Clavis - Quick Start Guide

Get Clavis running in **5 minutes** ⚡

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm

## Installation

```bash
# 1. Install dependencies
composer install
npm install

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Setup database
php artisan migrate:fresh --seed

# 4. Start servers (in separate terminals)
php artisan serve
npm run dev
```

## Access the Application

1. **Open**: http://localhost:8000
2. **Login**: test@example.com / password
3. **Navigate to**: http://localhost:8000/wordcloud

## First Experience

1. **Cinematic Intro**: Watch the "Hello, Clavis" → "What Happened Today" animation
2. **Explore Wordcloud**: Hover over words to see cosmic glow effects
3. **Click Words**: View all posts for that word
4. **Create Post**: Use the composer at the bottom to add your own word
5. **Watch Updates**: Word frequencies update every 5 seconds

## Test Accounts

| Email                  | Password | Name              |
|------------------------|----------|-------------------|
| test@example.com       | password | Test User         |
| alice@example.com      | password | Alice Cosmos      |
| bob@example.com        | password | Bob Nebula        |
| charlie@example.com    | password | Charlie Starlight |

## Key Features to Try

- ✨ **Cosmic Particles**: Three.js animated background
- 🎬 **Intro Sequence**: Syllable-based text animations
- 🌌 **Wordcloud**: Dynamic word sizing based on frequency
- 💬 **Post Composer**: Create words (max 100 chars)
- 🔍 **Word Details**: Click any word to see related posts
- ⚡ **Real-time**: Auto-updates every 5 seconds

## Troubleshooting

### Intro doesn't play
```javascript
// In browser console:
localStorage.removeItem('clavis_intro_seen');
location.reload();
```

### Database errors
```bash
php artisan migrate:fresh --seed
```

### Build errors
```bash
npm install
npm run dev
```

## Next Steps

- Read [README_CLAVIS.md](./README_CLAVIS.md) for full documentation
- Customize colors in `resources/css/app.css`
- Add more sample data with `php artisan db:seed`
- Deploy to production (see README)

---

**Enjoy the cosmic experience!** 🌌✨
