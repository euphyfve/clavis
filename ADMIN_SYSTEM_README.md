# Admin System Documentation

## Overview
This document describes the admin panel system with daily reset functionality and hashtag management for the Clavis Wordboard application.

## Features Implemented

### 1. Admin Role System
- **Admin flag**: Users can be marked as admin via `is_admin` field
- **Ban system**: Admins can ban/unban users with reasons
- **Middleware protection**: All admin routes protected by `AdminMiddleware`
- **Policy-based authorization**: Admin actions use Laravel policies

### 2. Daily Reset System
- **Scheduled resets**: Automatically reset topic statistics at configured time
- **Configurable timing**: Admin can set reset time (24-hour format)
- **Manual force reset**: Admin can trigger immediate reset
- **Dual statistics**: Topics track both total and daily stats
  - `post_count` / `daily_post_count`
  - `view_count` / `daily_view_count`

### 3. Hashtag Display Logic (10 Best + 5 New)
- **Top 10 hashtags**: Based on daily activity (daily_post_count, daily_view_count)
- **5 newest hashtags**: Created today
- **Smart merging**: Removes duplicates if new hashtag is also in top 10
- **Maximum 15 hashtags**: Displayed on leaderboard

### 4. Admin Panel Features

#### User Management (`/admin/users`)
- View all users with stats
- Search by name/email
- Filter: All, Banned, Admins
- Actions:
  - Ban/Unban users (with reason)
  - Delete users (kick)
  - Promote to admin
  - Remove admin privileges

#### Content Moderation (`/admin/posts`)
- View all posts
- Search by content
- Delete posts (including all replies)
- View post statistics

#### Topic Management (`/admin/topics`)
- View all topics/hashtags
- See total and daily statistics
- Identify new and hot topics
- Delete topics

#### System Settings (`/admin/settings`)
- Configure daily reset time
- View last reset timestamp
- Cron setup instructions

## Database Schema

### New Migrations
1. `add_admin_fields_to_users_table`
   - `is_admin` (boolean)
   - `is_banned` (boolean)
   - `banned_at` (timestamp)
   - `ban_reason` (string)

2. `create_system_settings_table`
   - `key` (unique)
   - `value` (text)
   - `type` (string)
   - `description` (text)

3. `add_daily_stats_to_topics_table`
   - `daily_post_count` (integer)
   - `daily_view_count` (integer)
   - `last_reset_at` (timestamp)

## Installation & Setup

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Create First Admin User
```bash
php artisan tinker
```
```php
$user = User::find(1); // or User::where('email', 'admin@example.com')->first();
$user->is_admin = true;
$user->save();
```

### 3. Setup Cron Job (Required for Auto Reset)
Add to your server's crontab:
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

### 4. Manual Reset (Optional)
```bash
php artisan wordboard:daily-reset --force
```

## Routes

### Admin Routes (Protected by `admin` middleware)
- `GET /admin` - Admin dashboard
- `GET /admin/users` - User management
- `POST /admin/users/{user}/ban` - Ban user
- `POST /admin/users/{user}/unban` - Unban user
- `DELETE /admin/users/{user}` - Delete user
- `POST /admin/users/{user}/make-admin` - Promote to admin
- `POST /admin/users/{user}/remove-admin` - Remove admin
- `GET /admin/posts` - Post management
- `DELETE /admin/posts/{post}` - Delete post
- `GET /admin/topics` - Topic management
- `DELETE /admin/topics/{topic}` - Delete topic
- `GET /admin/settings` - System settings
- `POST /admin/settings` - Update settings
- `POST /admin/reset/force` - Force daily reset

### Updated API Routes
- `GET /api/topics/leaderboard` - Returns 10 best + 5 new hashtags

## Models

### User Model
New methods:
- `isAdmin()` - Check if user is admin
- `isBanned()` - Check if user is banned
- `ban($reason)` - Ban user
- `unban()` - Unban user

### Topic Model
New methods:
- `resetDailyStats()` - Reset daily counters
- `isNew()` - Check if created today
- `incrementPostCount()` - Now also increments daily count
- `incrementViewCount()` - Now also increments daily count

### SystemSetting Model
Static methods:
- `SystemSetting::get($key, $default)` - Get setting value
- `SystemSetting::set($key, $value)` - Set setting value

## Middleware

### AdminMiddleware
- Checks if user is authenticated
- Checks if user has admin privileges
- Returns 403 if not admin

### CheckBanned
- Automatically logs out banned users
- Shows ban reason on login page
- Applied to all web routes

## Policies

### UserPolicy
- `manage()` - Can manage users
- `ban()` - Can ban users (not other admins)
- `delete()` - Can delete users (not self or other admins)

### PostPolicy
- `delete()` - Can delete own posts (existing)

## Console Commands

### `wordboard:daily-reset`
Resets all topic daily statistics.

Options:
- `--force` - Force reset regardless of schedule

Usage:
```bash
php artisan wordboard:daily-reset
php artisan wordboard:daily-reset --force
```

## Frontend Components

### Admin Pages
- `resources/js/Pages/Admin/Dashboard.tsx` - Admin dashboard
- `resources/js/Pages/Admin/Users.tsx` - User management
- `resources/js/Pages/Admin/Posts.tsx` - Post moderation
- `resources/js/Pages/Admin/Topics.tsx` - Topic management
- `resources/js/Pages/Admin/Settings.tsx` - System settings

### Navigation
- Admin link appears in main navigation for admin users
- Uses Lucide icons for modern UI

## Security Considerations

1. **Admin Protection**: All admin routes protected by middleware
2. **Policy Authorization**: Actions use Laravel policies
3. **Self-Protection**: Admins cannot remove their own admin status
4. **Admin Immunity**: Admins cannot ban or delete other admins
5. **Ban System**: Banned users automatically logged out

## Daily Reset Behavior

### What Gets Reset
- `daily_post_count` → 0
- `daily_view_count` → 0
- `last_reset_at` → current timestamp

### What Stays
- `post_count` (total, never reset)
- `view_count` (total, never reset)
- All posts and user data

### When It Runs
- Automatically at configured time (via cron)
- Manually via admin dashboard "Force Reset" button
- Manually via artisan command

## Hashtag Display Algorithm

```php
// Get top 10 by daily activity
$topHashtags = Topic::where('daily_post_count', '>', 0)
    ->orderBy('daily_post_count', 'desc')
    ->orderBy('daily_view_count', 'desc')
    ->limit(10)
    ->get();

// Get 5 newest created today
$newHashtags = Topic::whereDate('created_at', today())
    ->orderBy('created_at', 'desc')
    ->limit(5)
    ->get();

// Merge and remove duplicates (max 15)
$allHashtags = $topHashtags->merge($newHashtags)
    ->unique('id')
    ->take(15);
```

## Troubleshooting

### Daily Reset Not Running
1. Check cron job is configured
2. Verify `schedule:run` is executing
3. Check logs: `storage/logs/laravel.log`
4. Test manually: `php artisan wordboard:daily-reset --force`

### Admin Access Issues
1. Verify user has `is_admin = true`
2. Check middleware is registered in `bootstrap/app.php`
3. Clear cache: `php artisan cache:clear`

### Banned Users Still Accessing
1. Check `CheckBanned` middleware is in web group
2. Clear sessions: `php artisan session:clear`
3. Verify `is_banned` field is set correctly

## Future Enhancements (Optional)

- [ ] Activity logs for admin actions
- [ ] Bulk user actions
- [ ] Advanced analytics dashboard
- [ ] Email notifications for bans
- [ ] Scheduled content publishing
- [ ] IP-based bans
- [ ] Rate limiting per user
- [ ] Content flagging system

## Support

For issues or questions, refer to:
- Laravel Documentation: https://laravel.com/docs
- Inertia.js Documentation: https://inertiajs.com
- Project Repository: [Your repo URL]
