# Complete cPanel Deployment Guide

## Overview
To see your website's UI on cPanel, you need to deploy both:
1. **PHP API Backend** (handles data and admin functions)
2. **React Frontend** (the user interface)

## Step 1: Prepare Your Files

### Build the React Frontend
```bash
cd frontend
npm run build
```
This creates a `dist/` folder with your built React app.

## Step 2: Upload Files to cPanel

### Using cPanel File Manager or FTP:

1. **Upload PHP API:**
   - Upload the entire `php-api/` folder to `public_html/`
   - Final structure: `public_html/php-api/`

2. **Upload React Frontend:**
   - Upload the contents of `frontend/dist/` to `public_html/`
   - Final structure: `public_html/index.html`, `public_html/assets/`, etc.

3. **Upload Uploads Directory:**
   - Ensure `backend/uploads/` exists in `public_html/backend/uploads/`
   - Set permissions to 755 (writable)

## Step 3: Configure cPanel Settings

### Enable Required PHP Extensions:
1. Go to **cPanel → Software → Select PHP Version**
2. Choose PHP version 8.0 or higher
3. Enable these extensions:
   - mysqli
   - mbstring
   - fileinfo

### Set PHP Configuration:
1. Go to **cPanel → Software → MultiPHP INI Editor**
2. Set these values:
   ```
   upload_max_filesize = 10M
   post_max_size = 10M
   max_execution_time = 300
   ```

## Step 4: Update API URLs

### Update Frontend API Calls:
Edit `public_html/assets/index-*.js` (the built React files) or update the source before building:

**Find and replace in your built files:**
```javascript
// Change from:
https://ymcaph-backend.onrender.com

// To:
https://yourdomain.com/php-api
```

### Quick Update Script:
```bash
# After uploading, SSH into cPanel and run:
cd public_html
find assets/ -name "*.js" -exec sed -i 's|https://ymcaph-backend.onrender.com|https://yourdomain.com/php-api|g' {} \;
```

## Step 5: Configure .htaccess for SPA Routing

Create or update `public_html/.htaccess`:

```apache
RewriteEngine On

# Handle React Router (SPA routing)
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Handle PHP API routes
RewriteCond %{REQUEST_URI} ^/php-api/
RewriteRule ^php-api/(.*)$ php-api/index.php [QSA,L]

# Serve uploaded files
RewriteCond %{REQUEST_URI} ^/uploads/
RewriteRule ^uploads/(.*)$ backend/uploads/$1 [L]
```

## Step 6: Test Your Deployment

### Access Your Website:
- **Frontend:** `https://yourdomain.com`
- **API Test:** `https://yourdomain.com/php-api/test-db`
- **API Tester:** `https://yourdomain.com/api-test.html`

### Verify Everything Works:
1. ✅ Website loads at your domain
2. ✅ Navigation works (React Router)
3. ✅ API calls work (`/php-api/*` endpoints)
4. ✅ Database connects (test-db returns success)
5. ✅ Dynamic content loads (news, locals, etc.)
6. ✅ Admin panels accessible
7. ✅ Forms submit data
8. ✅ File uploads work

## Step 7: Common cPanel Issues & Fixes

### Issue: 500 Internal Server Error
**Fix:**
- Check PHP error logs in cPanel
- Verify file permissions (755 for folders, 644 for files)
- Check `.htaccess` syntax

### Issue: API Returns 404
**Fix:**
- Ensure `php-api/index.php` exists
- Check `.htaccess` rewrite rules
- Verify mod_rewrite is enabled

### Issue: Images Don't Load
**Fix:**
- Check `backend/uploads/` permissions
- Verify image paths in database
- Update `.htaccess` for uploads routing

### Issue: React App Shows Blank Page
**Fix:**
- Check browser console for errors
- Verify API URLs are updated
- Ensure all assets are uploaded

## Step 8: Domain & SSL Setup

### Point Domain to cPanel:
1. Go to **cPanel → Domains → Addon Domains**
2. Add your domain if not already added

### Enable SSL:
1. Go to **cPanel → Security → Let's Encrypt**
2. Issue SSL certificate for your domain

## Step 9: Monitor & Maintain

### Check Logs:
- **PHP Errors:** `cPanel → Metrics → Errors`
- **Access Logs:** `cPanel → Metrics → Raw Access`

### Backup Regularly:
- Use cPanel's backup tools
- Backup database and files weekly

## Quick Deployment Checklist

- [ ] PHP API uploaded to `public_html/php-api/`
- [ ] React build uploaded to `public_html/`
- [ ] Uploads directory created: `public_html/backend/uploads/`
- [ ] File permissions set correctly
- [ ] PHP extensions enabled
- [ ] API URLs updated in frontend
- [ ] `.htaccess` configured
- [ ] Domain pointed to hosting
- [ ] SSL certificate installed
- [ ] Test all functionality

## Access Your Website

Once deployed, visit:
- **Main Website:** `https://yourdomain.com`
- **Admin Panel:** `https://yourdomain.com/admin` (if you have admin routes)
- **API Documentation:** Check the endpoints in your React app

Your website should now be fully functional with dynamic content, admin capabilities, and all the features from your original Node.js backend!