# YMCA Philippines - cPanel Admin Update Issue - SOLUTION GUIDE

## 🎯 Problem You're Experiencing

**Symptom 1**: Admin panel shows "Local updated successfully" ✅ button message
- But when you refresh or check the database, the data hasn't changed ❌

**Symptom 2**: Error messages in browser console:
```
Failed to load resource: the server responded with a status of 503 (Service Unavailable)
/uploads/1775630807865-246166299.jpg:1
/uploads/1775782074904-74749130.jpg:1
```

**Symptom 3**: Users see 0 content (zero members, empty local pages)
- Because data isn't in database or can't be loaded

---

## 🔍 What's Wrong

### Problem #1: Database Updates Don't Actually Save
The admin_locals_update.php endpoint says success but doesn't update the database.

**Why**: Could be one of several things:
1. ❓ Database connection is broken on cPanel
2. ❓ Local ID you're trying to update doesn't exist in database
3. ❓ Column names in database don't match the PHP code (e.g., `instagram_url` vs `instagramUrl`)
4. ❓ Database credentials in config.php are wrong

### Problem #2: Image Uploads Return 503 Errors
Images fail to load from `/uploads/` with "Service Unavailable"

**Why**: Upload path calculation is wrong on cPanel subdirectory deployment.

On your setup:
- Frontend at: `https://ymca.ph/testsite/`
- API at: `https://ymca.ph/testsite/php-api/`
- Uploads should be at: `https://ymca.ph/testsite/backend/uploads/`

But the code was calculating: `https://ymca.ph/testsite/php-api/uploads/` ❌

---

## ✅ What I Fixed

### ✅ Fix #1: Corrected Upload Path Calculation
Modified: `php-api/utils.php`
- Function `getUploadBasePath()` now correctly points to `/testsite` instead of `/testsite/php-api`
- Image URLs will now resolve to correct path

### ✅ Fix #2: Added Detailed Logging
Modified: `php-api/endpoints/admin_locals_update.php`
- Every step is now logged to error.log
- Clear messages about what succeeded/failed
- Verification of whether update actually worked

### ✅ Fix #3: Created Diagnostic Tools
Created: `php-api/diagnose.php`
- Full system health check
- Tells you if database is connected
- Shows if local records exist
- Checks if uploads directory is writable

Created: `php-api/test-update.php`
- Tests if updates can actually save to database
- Shows affected rows count
- Verifies data was saved correctly

---

## 🚀 What You Need To Do Now

### Step 1: Upload 4 Files to Your cPanel Server

You need to upload these files to `public_html/php-api/` directory:

**Modified Files** (2):
1. `php-api/utils.php` ← Overwrite existing
2. `php-api/endpoints/admin_locals_update.php` ← Overwrite existing

**New Files** (2):
3. `php-api/diagnose.php` ← Create new
4. `php-api/test-update.php` ← Create new

**How to upload:**
- Use cPanel File Manager, FTP, or SSH
- Navigate to `public_html/php-api/`
- Upload/replace the files

---

### Step 2: Run Diagnostic Check

1. **Open your browser**
2. **Go to**: `https://ymca.ph/testsite/php-api/diagnose.php`

You'll see a JSON response with detailed info. Look for:

✅ Should show `true`:
```json
{
  "database": {
    "connected": true,
    "local_record_count": 5,      // Should be > 0
    ...
  },
  "directories": {
    "uploads": {
      "exists": true,
      "writable": true
    }
  },
  "summary": {
    "status": "OK"
  }
}
```

❌ If any show `false` or missing, we have a problem to fix.

**What each check means:**
- `database.connected: true` = PHP can reach MySQL database
- `local_record_count > 0` = Database has YMCA local records
- `uploads.exists: true` = Upload directory exists on server
- `uploads.writable: true` = Server can write files to uploads directory

---

### Step 3: Test Update Functionality

Find a local ID to test with (from the diagnostic output above).

1. **Go to**: `https://ymca.ph/testsite/php-api/test-update.php?id=MANILA`

Replace `MANILA` with an actual local ID from your database.

You'll see JSON response:

✅ Success looks like:
```json
{
  "success": true,
  "details": {
    "local_id": "MANILA",
    "original_name": "YMCA Manila",
    "test_name": "TEST_UPDATE_2026-04-15 10:30:00",
    "affected_rows": 1,
    "verification_passed": true
  }
}
```

❌ Failure would show:
```json
{
  "success": false,
  "error": "Update executed but affected 0 rows - local may not exist...",
  "details": {
    "affected_rows": 0,
    "verification_passed": false
  }
}
```

**What each value means:**
- `success: true` = Everything worked, update saved to database
- `affected_rows: 1` = Found and updated 1 record
- `verification_passed: true` = Confirmed data was saved by re-reading from DB

---

### Step 4: Test Admin Panel Update

1. Go to your admin panel: `https://ymca.ph/testsite/admin`
2. Go to "Find Your YMCA" section
3. Select a local YMCA
4. **Change ONE detail** (e.g., change member count by +1)
5. Click Save
6. Should show: "Local updated successfully" ✅
7. **Refresh the page** - does the change still appear? ✅
8. **Check cPanel → phpMyAdmin → local table** - is the database actually updated? ✅

If all 3 are yes, the issue is FIXED! 🎉

---

## 🔍 What If Something Still Doesn't Work?

### If `diagnose.php` shows `database.connected: false`

**Possible causes:**
1. MySQL server is down
2. Database credentials are wrong in `config.php`
3. User account `ymcaph_user` doesn't have permissions

**To fix:**
1. Check cPanel → Databases → MySQL Databases
2. Verify user exists: `ymcaph_user`
3. Verify password in `config.php` matches
4. Try connecting via cPanel phpMyAdmin - if it works there, then config.php has wrong credentials

---

### If `local_record_count: 0`

**Possible causes:**
1. Database was never populated with local data
2. Data is in wrong database
3. Wrong table name

**To fix:**
1. Go to cPanel → phpMyAdmin
2. Select `ymcaph_db` database
3. Look for `local` table
4. Click on it → should show your YMCA locals
5. If table is empty, you need to import/populate it
6. If table doesn't exist, you need to create the schema

---

### If `uploads.writable: false`

**Possible causes:**
1. File permissions on `backend/uploads/` directory

**To fix:**
1. Go to cPanel → File Manager
2. Navigate to `backend/uploads/`
3. Right-click → Change Permissions
4. Set to: `755` or `777`
5. Check box: "Apply to subdirectories"
6. Rerun `diagnose.php`

---

### If `test-update.php` shows `affected_rows: 0`

**Possible causes:**
1. Local ID doesn't exist (you used wrong ID)
2. All the data is identical to what's already there (no change needed)
3. Database column names don't match the SQL code

**To fix:**
1. Get correct local_id from `diagnose.php` output
2. Use that exact ID in test-update.php
3. If still fails, data might be identical - try update with DIFFERENT value
4. If still fails, there might be column name mismatch - check cPanel phpMyAdmin for actual column names

---

### If Admin Panel Still Doesn't Save

**Even after test-update.php succeeds:**
1. Check browser console for JavaScript errors
2. Check Network tab in browser developer tools - is the PUT request being sent?
3. Check the response status - is it 200 OK?
4. Check the error.log file for `[ADMIN_LOCALS_UPDATE]` entries

---

## 📊 Files Changed Summary

### Modified Files (Overwrite These)

**1. `php-api/utils.php` - Line 58-61**
```php
// OLD:
function getUploadBasePath() {
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $phpApiPath = dirname($scriptName);
    ...
}

// NEW: (corrects upload path on subdirectory)
function getUploadBasePath() {
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $basePath = preg_replace('#/php-api(/|$).*#', '', $scriptName);
    ...
}
```

**2. `php-api/endpoints/admin_locals_update.php` - Entire file**
- Added extensive logging
- Easier to diagnose what goes wrong
- Still does the same update, just with better visibility

### New Files (Create These)

**3. `php-api/diagnose.php`** - Diagnostic health check
**4. `php-api/test-update.php`** - Test update functionality

---

## 📞 Support Info

If you still have issues after following all steps:

1. **Share output of**: `https://ymca.ph/testsite/php-api/diagnose.php`
2. **Share output of**: `https://ymca.ph/testsite/php-api/test-update.php?id=MANILA`
3. **Share relevant parts of error.log** from `public_html/php-api/error.log`

This will tell us exactly what's happening on your server.

---

## ✨ Expected Results After Fix

✅ Admin updates immediately save to database  
✅ Images upload and load without 503 errors  
✅ Users see up-to-date local data on frontend  
✅ All member counts display correctly  
✅ No "0 content" issue  
✅ Error logs show successful operations  

Good luck! Let me know if you run into any issues during deployment. 🚀
