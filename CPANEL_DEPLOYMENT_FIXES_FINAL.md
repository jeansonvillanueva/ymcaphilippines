# cPanel Deployment - Critical Fixes (April 21, 2026)

## 🔧 Issues Fixed

1. **Database Connection Error**: `$conn` was `null` because endpoints didn't initialize it
   - **Solution**: Added global `$conn = getDatabaseConnection();` in `index.php`
   
2. **Hardcoded API URLs**: Admin/frontend used hardcoded paths instead of centralized URLs
   - **Solution**: Updated frontend to use query parameter routing: `?path=/api/...`
   
3. **.htaccess Routing Issues**: Path-based routing wasn't working on cPanel
   - **Solution**: Added query parameter support as fallback: `index.php?path=/...`

---

## 📤 Files to Upload to cPanel

### PHP API Files (upload to `/public_html/php-api/`)

**CRITICAL - Must upload:**
1. `index.php` ✅ (Global $conn initialization + query parameter routing)
2. `config.php` ✅ (If it doesn't exist)

**Recommended - endpoints with $conn fix:**
3. `endpoints/test_db.php`
4. `endpoints/news.php`
5. `endpoints/locals.php`
6. `endpoints/staff.php`
7. `endpoints/local_detail.php`
8. `endpoints/admin_news.php`
9. `endpoints/admin_locals.php`

### React Frontend (upload to `/public_html/`)

**Upload the entire dist folder:**
```
frontend/dist/ → /public_html/
```

This includes the new API URLs using query parameters.

---

## 🧪 Testing Steps

### Step 1: Test PHP API Directly
```
https://ymca.ph/testsite/php-api/index.php?path=/test-db
```
Should return: `{"message":"Database is working!"}`

### Step 2: Test Public APIs
```
https://ymca.ph/testsite/php-api/index.php?path=/api/news
https://ymca.ph/testsite/php-api/index.php?path=/api/locals
```

### Step 3: Test Admin Login
```
https://ymca.ph/testsite/admin
Username: ymcaph
Password: Ymc@19!1
```

### Step 4: Check cPanel Test Page
```
https://ymca.ph/testsite/cPanel-test.html
```
All tests should pass ✅

---

## 🔄 How It Works Now

### Path-Based Routing (original - if .htaccess works):
```
POST https://ymca.ph/testsite/php-api/admin/login
```

### Query Parameter Routing (fallback - always works):
```
POST https://ymca.ph/testsite/php-api/index.php?path=/admin/login
```

**The frontend now uses query parameter routing**, so it works even without .htaccess rewrites!

---

## 📋 Checklist

Before testing:

- [ ] Uploaded `index.php` to `/public_html/php-api/`
- [ ] Uploaded endpoint files to `/public_html/php-api/endpoints/`
- [ ] Uploaded entire `dist/` folder to `/public_html/`
- [ ] Set file permissions:
  - [ ] PHP files: 644
  - [ ] Folders: 755
- [ ] Verified database connection in diagnostic
- [ ] Cleared browser cache (Ctrl+Shift+Delete)

---

## 🚨 If Still Not Working

1. **Check error log:**
   - cPanel → Error Log → Share recent errors

2. **Test direct endpoint access:**
   ```
   https://ymca.ph/testsite/php-api/index.php?path=/test-db
   ```

3. **Verify database credentials** in `config.php`:
   ```php
   $user = 'ymcaph_user';
   $password = 'e8f133def539f610fe95fa789ac08d6ee8f133def539f610fe95fa789ac08d6e';
   $database = 'ymcaph_db';
   ```

4. **Check if MySQL is running**:
   - cPanel → MySQL Databases → Verify connection

---

**Last Updated**: April 21, 2026
