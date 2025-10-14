# Quick Setup Guide - Admin System

## Step 1: Run Migrations
```bash
php artisan migrate
```

This will create:
- Admin fields in users table (is_admin, is_banned, etc.)
- System settings table
- Daily stats fields in topics table

## Step 2: Create Your First Admin User

### Option A: Using Tinker (Recommended)
```bash
php artisan tinker
```

Then in tinker:
```php
// Find your user (replace with your actual user ID or email)
$user = User::find(1);
// OR
$user = User::where('email', 'your-email@example.com')->first();

// Make them admin
$user->is_admin = true;
$user->save();

exit
```

### Option B: Direct Database Update
```sql
UPDATE users SET is_admin = 1 WHERE id = 1;
-- OR
UPDATE users SET is_admin = 1 WHERE email = 'your-email@example.com';
```

## Step 3: Setup Cron Job (For Automatic Daily Reset)

Add this line to your server's crontab:
```bash
crontab -e
```

Add:
```
* * * * * cd /path/to/your/clavis/project && php artisan schedule:run >> /dev/null 2>&1
```

Replace `/path/to/your/clavis/project` with your actual project path.

### Windows Users (Local Development)
You can run the scheduler manually or use Task Scheduler:
```bash
php artisan schedule:work
```

## Step 4: Test Admin Access

1. Log in with your admin user
2. You should see "Admin Panel" link in the navigation
3. Visit: `http://your-app.test/admin`
4. You should see the admin dashboard

## Step 5: Configure Daily Reset Time

1. Go to Admin Panel → Settings
2. Set your preferred reset time (24-hour format, e.g., 00:00 for midnight)
3. Click "Save Settings"

## Step 6: Test Manual Reset (Optional)

```bash
php artisan wordboard:daily-reset --force
```

This will immediately reset all topic daily statistics.

## Verification Checklist

- [ ] Migrations ran successfully
- [ ] At least one admin user created
- [ ] Can access `/admin` route
- [ ] Admin dashboard loads correctly
- [ ] Can view users, posts, topics
- [ ] Cron job configured (for production)
- [ ] Daily reset time configured
- [ ] Manual reset works

## Common Issues

### "403 Unauthorized" when accessing /admin
- Make sure your user has `is_admin = true`
- Clear cache: `php artisan cache:clear`
- Check you're logged in

### Daily reset not running automatically
- Verify cron job is set up correctly
- Check cron is running: `sudo service cron status` (Linux)
- Test manually: `php artisan wordboard:daily-reset --force`
- Check logs: `storage/logs/laravel.log`

### Admin link not showing in navigation
- Clear browser cache
- Make sure user has `is_admin = true`
- Rebuild frontend: `npm run build`

## Next Steps

1. **Configure Reset Time**: Set when daily stats should reset
2. **Manage Users**: Ban/unban users, promote admins
3. **Moderate Content**: Delete inappropriate posts
4. **Manage Topics**: Remove unwanted hashtags
5. **Monitor Stats**: Check dashboard regularly

## Admin Features Overview

### User Management
- Ban/unban users with reasons
- Delete users (kick)
- Promote users to admin
- Remove admin privileges
- Search and filter users

### Content Moderation
- View all posts
- Delete posts (including replies)
- Search posts by content
- See post statistics

### Topic Management
- View all hashtags
- See daily and total statistics
- Delete topics
- Identify hot and new topics

### System Settings
- Configure daily reset time
- Force manual reset
- View last reset timestamp

## Security Notes

- Admins cannot ban or delete other admins
- Admins cannot remove their own admin status
- Banned users are automatically logged out
- All admin actions are protected by middleware and policies

## Need Help?

Refer to `ADMIN_SYSTEM_README.md` for detailed documentation.
