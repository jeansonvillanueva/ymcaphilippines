# EMERGENCY FIX - 503 Error Recovery Guide

## What We Found
Your 503 errors are likely caused by:
1. **`.htaccess` file has problematic directives** that cPanel's Apache is rejecting
2. **File permissions not set correctly** on the uploaded files
3. Need to verify PHP execution and database connection

---

## IMMEDIATE ACTION (Do These Steps in Order)

### Step 1: Upload New Debug Scripts
Upload these 2 NEW files to `public_html/php-api/`:
1. `php-api/debug-full.php`
2. `php-api/direct-login-test.php`

**How to upload:**
- Use cPanel File Manager → Upload button
- Or use FTP to put files in `public_html/php-api/`

### Step 2: Replace .htaccess File
**CRITICAL**: The current .htaccess has problematic directives!

- **Backup current**: `public_html/php-api/.htaccess` (optional, for safety)
- **Upload new**: `php-api/.htaccess-fixed` as `.htaccess` (rename it)
  - In cPanel: Upload `.htaccess-fixed`, then rename to `.htaccess`
  - Overwrite the old `.htaccess`

This removes problematic PHP directives that cPanel doesn't allow.

### Step 3: Fix File Permissions (VERY IMPORTANT)
In **cPanel File Manager**, for `public_html/php-api/`:

**For ALL FILES** (not folders):
1. Right-click file → **Change Permissions**
2. Set to: **644** (or `-rw-r--r--`)

**For ALL FOLDERS** (including endpoints/):
1. Right-click folder → **Change Permissions**
2. Set to: **755** (or `-rwxr-xr-x`)

**Special case**: `backend/uploads/`
- Set to: **755** (must be writable!)

**How to do bulk permissions:**
1. Select all files in php-api/
2. Right-click → Change Permissions
3. Recursive: YES
4. Set files to 644, folders to 755

### Step 4: Test Debug Scripts
Once uploaded, test in browser:

**Test 1**: `https://ymca.ph/testsite/php-api/debug-full.php`
- Should show JSON with checks
- Look for:
  - `"config_readable": true` ✅
  - `"utils_readable": true` ✅
  - `"database_test": "CONNECTED"` ✅
  - If any are false → that's your problem!

**Test 2**: `https://ymca.ph/testsite/php-api/direct-login-test.php`
- Should show login test results
- Look for:
  - All steps: `"status": "success"` ✅
  - `"final_result": "LOGIN_WORKS"` ✅
  - If any fail → shows exactly where the problem is

### Step 5: Interpret Results

**If all tests PASS ✅:**
- The 503 error was from `.htaccess`
- Try admin login again at: `https://ymca.ph/testsite/admin`
- Username: `ymcaph`
- Password: `Ymc@19!1`

**If Test 1 FAILS (debug-full.php shows errors):**

| Error | Cause | Solution |
|-------|-------|----------|
| `config_readable: false` | File permissions wrong | Set `config.php` to 644 |
| `utils_readable: false` | File permissions wrong | Set `utils.php` to 644 |
| `database_test: "FAILED"` | Database unreachable | Check database credentials in `config.php` |

**If Test 2 FAILS (direct-login-test.php shows errors):**

| Error | Cause | Solution |
|-------|-------|----------|
| `config.php` step failed | Same as Test 1 | Fix permissions |
| `database_connection` failed | DB unreachable | Check credentials, MySQL running |
| `login_result: "INVALID_CREDENTIALS"` | Password wrong | Check `admin` table password hash |
| `user_exists: false` | Admin user missing | Add admin user to database |

---

## BACKUP PLAN: Disable .htaccess Entirely (If Still Failing)

If replacing `.htaccess` still doesn't work, try this:

1. Create a new file: `public_html/php-api/.htaccess-disabled` (empty file or with `#` comment)
2. Rename current `.htaccess` to `.htaccess-backup`
3. Test: `https://ymca.ph/testsite/php-api/debug-full.php`

**Without .htaccess:**
- Direct file access will work: `debug-full.php`, `simple-test.php` ✅
- API routing will break (no `/admin/login` routing)
- But we'll know if 503 is from `.htaccess` or something else

If it works without `.htaccess`, the issue is definitely the rewrite rules!

---

## Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `simple-test.php` | Ultra-basic PHP test | ✅ Ready to upload |
| `debug-full.php` | Full system diagnostic | ✅ Ready to upload |
| `direct-login-test.php` | Direct login bypass test | ✅ Ready to upload |
| `.htaccess-fixed` | Safe rewrite rules | ✅ Ready (rename to `.htaccess`) |

---

## Quick Checklist

Before you proceed, ensure:

- [ ] You can access cPanel File Manager
- [ ] You have FTP access (or will use File Manager)
- [ ] You know how to set file permissions in cPanel
- [ ] You have the new files ready to upload:
  - [ ] `debug-full.php`
  - [ ] `direct-login-test.php`
  - [ ] `.htaccess-fixed` (to replace `.htaccess`)

---

## Still Need Help?

When you run the debug tests, share the JSON output here:
1. Output from `debug-full.php`
2. Output from `direct-login-test.php`

This will show exactly what's broken and what to fix!
