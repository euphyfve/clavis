# Clavis - Deployment Checklist

## 🚀 Pre-Deployment Checklist

### Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate `APP_KEY` with `php artisan key:generate`
- [ ] Configure database credentials (MySQL/PostgreSQL recommended for production)
- [ ] Set `APP_URL` to your production domain
- [ ] Configure mail settings (if using notifications)
- [ ] Set `SESSION_DRIVER` (database or redis recommended)
- [ ] Set `CACHE_DRIVER` (redis recommended for production)

### Database Setup
- [ ] Run `php artisan migrate --force`
- [ ] Run `php artisan db:seed` (optional, for demo data)
- [ ] Verify database connection
- [ ] Set up database backups

### Build & Optimization
- [ ] Run `npm run build` to compile assets
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Run `php artisan optimize`
- [ ] Verify all assets are in `public/build`

### Security
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS if needed
- [ ] Set secure session cookies (`SESSION_SECURE_COOKIE=true`)
- [ ] Review `.env` for exposed secrets
- [ ] Set up rate limiting
- [ ] Configure CSP headers (if needed)

### Performance
- [ ] Enable OPcache for PHP
- [ ] Configure Redis for caching (optional)
- [ ] Set up CDN for static assets (optional)
- [ ] Enable Gzip/Brotli compression
- [ ] Optimize images
- [ ] Configure queue workers (if using queues)

### Monitoring
- [ ] Set up error logging (Sentry, Bugsnag, etc.)
- [ ] Configure application monitoring
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring
- [ ] Set up database monitoring

---

## 🌐 Hosting Options

### Option 1: Laravel Forge (Recommended)
**Easiest deployment for Laravel apps**

1. Create server on Forge
2. Connect your repository
3. Configure environment variables
4. Deploy with one click
5. Set up SSL certificate
6. Configure deployment script

**Pros**: Automatic deployments, SSL, monitoring, backups
**Cost**: $12-19/month + server costs

### Option 2: Vercel (Frontend) + Railway (Backend)
**Modern serverless approach**

**Frontend (Vercel)**:
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `public/build`
4. Configure environment variables

**Backend (Railway)**:
1. Create new project from GitHub
2. Add PostgreSQL database
3. Configure environment variables
4. Deploy automatically on push

**Pros**: Auto-scaling, global CDN, free tier available
**Cost**: Free tier available, pay-as-you-go

### Option 3: DigitalOcean App Platform
**Balanced simplicity and control**

1. Create new app from GitHub
2. Configure build settings
3. Add database component
4. Set environment variables
5. Deploy

**Pros**: Simple, affordable, good performance
**Cost**: $5-12/month

### Option 4: AWS Elastic Beanstalk
**Enterprise-grade, scalable**

1. Create Elastic Beanstalk application
2. Configure RDS database
3. Set up environment variables
4. Deploy via EB CLI or console
5. Configure auto-scaling

**Pros**: Highly scalable, AWS ecosystem
**Cost**: Variable, can be expensive

---

## 📝 Deployment Scripts

### Deploy Script (deploy.sh)
```bash
#!/bin/bash

echo "🚀 Deploying Clavis..."

# Pull latest changes
git pull origin main

# Install dependencies
composer install --no-dev --optimize-autoloader
npm ci

# Build assets
npm run build

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Restart queue workers (if using)
# php artisan queue:restart

echo "✅ Deployment complete!"
```

### Rollback Script (rollback.sh)
```bash
#!/bin/bash

echo "⏮️ Rolling back..."

# Checkout previous commit
git checkout HEAD~1

# Install dependencies
composer install --no-dev --optimize-autoloader
npm ci

# Build assets
npm run build

# Rollback migrations
php artisan migrate:rollback --force

# Clear and cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Rollback complete!"
```

---

## 🔧 Server Requirements

### Minimum Requirements
- **PHP**: 8.2 or higher
- **Composer**: 2.x
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Database**: MySQL 8.0+ or PostgreSQL 13+
- **Web Server**: Nginx or Apache
- **SSL**: Required for production

### Recommended Server Specs
- **CPU**: 2+ cores
- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 20GB SSD
- **Bandwidth**: Unmetered

### PHP Extensions Required
- OpenSSL
- PDO
- Mbstring
- Tokenizer
- XML
- Ctype
- JSON
- BCMath
- Fileinfo

---

## 🌍 Environment Variables

### Required Variables
```env
APP_NAME=Clavis
APP_ENV=production
APP_KEY=base64:... # Generate with php artisan key:generate
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=clavis
DB_USERNAME=your_username
DB_PASSWORD=your_password

SESSION_DRIVER=database
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Optional Variables
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=hello@clavis.app
MAIL_FROM_NAME="${APP_NAME}"

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1
```

---

## 🔍 Post-Deployment Testing

### Functional Tests
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Wordcloud page displays
- [ ] Cinematic intro plays (first visit)
- [ ] Intro skips on subsequent visits
- [ ] Words display in wordcloud
- [ ] Hover effects work
- [ ] Click word opens modal
- [ ] Modal displays posts correctly
- [ ] Post composer accepts input
- [ ] Posts submit successfully
- [ ] Word frequencies update
- [ ] Real-time polling works

### Performance Tests
- [ ] Page load time < 3s
- [ ] First Contentful Paint < 1.5s
- [ ] Animations run at 60fps
- [ ] No console errors
- [ ] WebGL particles render
- [ ] Mobile responsive
- [ ] Touch interactions work

### Security Tests
- [ ] HTTPS enabled
- [ ] SSL certificate valid
- [ ] CSRF protection working
- [ ] XSS protection enabled
- [ ] SQL injection protected
- [ ] Rate limiting active
- [ ] Authentication required for protected routes

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Reduced motion respected

---

## 📊 Monitoring Setup

### Error Tracking
**Sentry (Recommended)**
```bash
composer require sentry/sentry-laravel
php artisan sentry:publish --dsn=your-dsn
```

### Performance Monitoring
**New Relic**
```bash
# Install New Relic PHP agent
# Configure in php.ini
```

### Uptime Monitoring
- **UptimeRobot**: Free tier available
- **Pingdom**: Comprehensive monitoring
- **StatusCake**: Multiple check locations

### Analytics
- **Google Analytics**: User behavior
- **Plausible**: Privacy-friendly alternative
- **Fathom**: Simple, privacy-focused

---

## 🔄 Continuous Deployment

### GitHub Actions Workflow
```yaml
name: Deploy Clavis

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      
      - name: Install Dependencies
        run: |
          composer install --no-dev --optimize-autoloader
          npm ci
      
      - name: Build Assets
        run: npm run build
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/clavis
            ./deploy.sh
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: 500 Internal Server Error
**Solution**: 
- Check `.env` configuration
- Run `php artisan config:clear`
- Check file permissions (755 for directories, 644 for files)
- Check error logs

**Issue**: Assets not loading
**Solution**:
- Run `npm run build`
- Check `public/build` directory exists
- Verify `APP_URL` in `.env`
- Clear browser cache

**Issue**: Database connection failed
**Solution**:
- Verify database credentials in `.env`
- Check database server is running
- Test connection: `php artisan tinker` then `DB::connection()->getPdo()`

**Issue**: Particles not rendering
**Solution**:
- Check browser WebGL support
- Verify Three.js loaded correctly
- Check console for errors

---

## 📞 Support Resources

- **Laravel Docs**: https://laravel.com/docs
- **Inertia.js Docs**: https://inertiajs.com
- **React Docs**: https://react.dev
- **Three.js Docs**: https://threejs.org/docs

---

## ✅ Final Checklist

Before going live:
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Monitoring configured
- [ ] Backups automated
- [ ] Documentation updated
- [ ] Team trained
- [ ] Rollback plan ready

---

**Ready to launch!** 🚀🌌
