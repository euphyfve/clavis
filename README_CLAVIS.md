# Clavis - Cosmic Social Media Platform

**Portfolio-worthy, award-winning quality social media application** inspired by the Aether Void design system. A cosmic-themed platform where users post words or short phrases that appear as part of a dynamic, animated wordcloud.

![Aether Void Design System](https://img.shields.io/badge/Design-Aether%20Void-8c52ff)
![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20)
![React](https://img.shields.io/badge/React-19.x-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)

---

## 🌌 Design System: Aether Void

### Color Palette

- **Deep Cosmos**: `#030014` - Background
- **Starlight Blue**: `#3A8DFF` - Primary
- **Nebula Purple**: `#8C52FF` - Secondary  
- **Solar Flare Orange**: `#FFAA33` - Accent

### Typography

- **Display**: Neue Montreal, Sora
- **Body**: Inter
- **Mono**: Space Mono

### Motion Principle

**Orbital Rhythm**: `cubic-bezier(0.33, 1, 0.68, 1)`

Smooth, cosmic animations that feel weightless and poetic.

---

## ✨ Features

### 1. **Cinematic Intro** (First Visit Only)
- Fullscreen intro sequence
- Syllable-based text animations
- "Hello, Clavis" → "What Happened Today"
- Smooth transitions with parallax cosmic particles
- localStorage flag to skip on subsequent visits

### 2. **Dynamic Wordcloud Feed**
- Each post becomes a word node
- Word size scales with frequency
- Gentle orbital drift animations
- GPU-accelerated performance
- Hover effects with cosmic glow
- Click to view related posts

### 3. **Post Composer**
- Simple, elegant text input (max 100 chars)
- Real-time character counter
- Cosmic-themed UI with backdrop blur
- Instant feedback on submission

### 4. **User Profiles**
- Constellation-style avatars with glow effects
- User contribution tracking
- Profile pages with mini wordclouds

### 5. **Real-time Updates**
- Polling-based word frequency updates (5s interval)
- Smooth animations for new words
- Star ignition effect for new posts

### 6. **Accessibility**
- ARIA labels and roles
- Keyboard navigation support
- Focus trap in modals
- Reduced motion support
- Semantic HTML structure

---

## 🚀 Installation & Setup

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn
- SQLite (or MySQL/PostgreSQL)

### Step 1: Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### Step 2: Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 3: Database Setup

```bash
# Run migrations
php artisan migrate

# Seed database with example data
php artisan db:seed
```

This creates 4 test users and ~50 sample words with varying frequencies.

**Test Accounts:**
- test@example.com (password: password)
- alice@example.com (password: password)
- bob@example.com (password: password)
- charlie@example.com (password: password)

### Step 4: Run Development Servers

```bash
# Terminal 1: Laravel backend
php artisan serve

# Terminal 2: Vite frontend
npm run dev
```

Visit: `http://localhost:8000`

---

## 🏗️ Architecture

### Backend (Laravel)

```
app/
├── Http/Controllers/
│   └── PostController.php      # Wordcloud API & views
├── Models/
│   ├── Post.php                # Post model with user relation
│   └── WordFrequency.php       # Word frequency tracking
database/
├── migrations/
│   ├── *_create_posts_table.php
│   └── *_create_word_frequencies_table.php
└── seeders/
    └── DatabaseSeeder.php      # Sample data generator
```

### Frontend (React + TypeScript)

```
resources/js/
├── components/
│   ├── cosmic/
│   │   ├── CosmicBackground.tsx    # Three.js particle field
│   │   └── CosmicScene.tsx         # WebGL canvas wrapper
│   ├── intro/
│   │   └── CinematicIntro.tsx      # Syllable-based intro
│   └── wordcloud/
│       ├── WordCloudCanvas.tsx     # Main wordcloud container
│       ├── WordNode.tsx            # Individual word with physics
│       ├── PostComposer.tsx        # Post creation form
│       └── WordDetailModal.tsx     # Word detail view
├── pages/
│   └── Wordcloud/
│       └── Index.tsx               # Main page orchestrator
├── hooks/
│   ├── useReducedMotion.ts         # Accessibility hook
│   └── useFocusTrap.ts             # Modal focus management
└── lib/
    └── motion.ts                   # Animation presets
```

### Design System (Tailwind CSS)

```
resources/css/app.css
- Complete token system
- Primitive color palette
- Semantic color tokens
- Typography scale
- Spacing system
- Border radius
- Shadows & glow effects
- Z-index scale
- Animation durations & easings
- Custom utilities
```

---

## 🎨 Component Patterns

### Word Node States

1. **Default**: Gentle drift, 85% opacity
2. **Hover**: Scale 1.15x, full opacity, cosmic glow
3. **Active**: Modal opens with post details

### Animation Choreography

- **Intro**: Staggered syllables (80-120ms delay)
- **Wordcloud**: Orbital drift (15-25s duration)
- **Modal**: Scale + fade (400ms, orbital easing)
- **Post submission**: Optimistic UI updates

### Performance Optimizations

- GPU acceleration (`transform: translateZ(0)`)
- `will-change` hints for animations
- Debounced polling (5s interval)
- Lazy loading for Three.js scene
- Efficient re-renders with React.memo

---

## 🔌 API Endpoints

### Public Routes

```
GET  /                          # Welcome page
```

### Authenticated Routes

```
GET  /wordcloud                 # Main wordcloud feed
POST /posts                     # Create new post
GET  /posts/word/{word}         # Get posts by word
GET  /api/word-frequencies      # Real-time frequency data
```

---

## 🎯 Usage Guide

### Creating a Post

1. Type a word or phrase (max 100 chars)
2. Click "Post to Void"
3. Word appears in wordcloud
4. Frequency automatically updates

### Exploring the Wordcloud

1. Hover over words to see glow effect
2. Click any word to view all related posts
3. Modal shows user profiles and timestamps
4. Press ESC or click backdrop to close

### Skipping the Intro

The intro only plays once. To reset:

```javascript
localStorage.removeItem('clavis_intro_seen');
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Intro plays on first visit
- [ ] Intro skips on subsequent visits
- [ ] Words drift smoothly
- [ ] Hover effects work
- [ ] Modal opens/closes correctly
- [ ] Posts submit successfully
- [ ] Word frequencies update
- [ ] Reduced motion is respected
- [ ] Keyboard navigation works
- [ ] Mobile responsive

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Frame Rate**: 60fps (animations)
- **Lighthouse Score**: > 90

---

## 🎨 Customization

### Changing Colors

Edit `resources/css/app.css`:

```css
:root {
    --background: #030014;      /* Deep Cosmos */
    --primary: #3a8dff;         /* Starlight Blue */
    --secondary: #8c52ff;       /* Nebula Purple */
    --accent: #ffaa33;          /* Solar Flare */
}
```

### Adjusting Animation Speed

Edit `resources/js/lib/motion.ts`:

```typescript
export const durations = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
};
```

### Changing Particle Count

Edit `resources/js/components/cosmic/CosmicBackground.tsx`:

```typescript
const particleCount = 2000; // Adjust for performance
```

---

## 🚢 Deployment

### Production Build

```bash
# Build assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
```

### Environment Variables

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=clavis
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

### Recommended Hosting

- **Laravel Forge** (easiest)
- **Vercel** (frontend) + **Railway** (backend)
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**

---

## 📊 Database Schema

### Posts Table

| Column              | Type         | Description                    |
|---------------------|--------------|--------------------------------|
| id                  | bigint       | Primary key                    |
| user_id             | bigint       | Foreign key to users           |
| content             | varchar(100) | Original post content          |
| normalized_content  | varchar(100) | Lowercase for frequency match  |
| created_at          | timestamp    | Creation time                  |
| updated_at          | timestamp    | Last update time               |

### Word Frequencies Table

| Column      | Type         | Description                    |
|-------------|--------------|--------------------------------|
| id          | bigint       | Primary key                    |
| word        | varchar(255) | Unique normalized word         |
| count       | integer      | Frequency count                |
| created_at  | timestamp    | First occurrence               |
| updated_at  | timestamp    | Last update                    |

---

## 🎓 Learning Resources

### Technologies Used

- **Laravel 11**: [laravel.com/docs](https://laravel.com/docs)
- **React 19**: [react.dev](https://react.dev)
- **Inertia.js**: [inertiajs.com](https://inertiajs.com)
- **Framer Motion**: [framer.com/motion](https://www.framer.com/motion)
- **Three.js**: [threejs.org](https://threejs.org)
- **Tailwind CSS 4**: [tailwindcss.com](https://tailwindcss.com)

---

## 🤝 Contributing

This is a portfolio project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the MIT License.

---

## 🌟 Credits

**Design System**: Aether Void  
**Motion Principle**: Orbital Rhythm  
**Built with**: Laravel, React, Three.js, Framer Motion

---

## 🐛 Troubleshooting

### Issue: Intro doesn't play

**Solution**: Clear localStorage and refresh

```javascript
localStorage.clear();
location.reload();
```

### Issue: Particles not rendering

**Solution**: Check WebGL support

```javascript
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
console.log('WebGL supported:', !!gl);
```

### Issue: Slow performance

**Solutions**:
- Reduce particle count (CosmicBackground.tsx)
- Enable GPU acceleration in browser
- Check for reduced motion preference
- Disable animations on low-end devices

---

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Check existing documentation
- Review component source code

---

**Built with cosmic precision and orbital rhythm** 🌌✨
