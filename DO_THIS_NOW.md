# DO THIS NOW - Step-by-Step Fix

## Problem
Admin updates show success but don't save. Images fail with 503 errors.

## Solution: 4 Files to Upload

---

## 📋 STEP 1: Gather the 4 Files

From your workspace, locate these files:

1. ✅ `php-api/utils.php`
2. ✅ `php-api/endpoints/admin_locals_update.php`
3. ✅ `php-api/diagnose.php` (see below)
4. ✅ `php-api/test-update.php` (see below)

---

## 📋 STEP 2: Create Missing Files

If files 3 & 4 don't exist yet, they contain the diagnostic tools.

**They are already created in your workspace at:**
- `c:\Users\Jeanson\yphilippines\php-api\diagnose.php`
- `c:\Users\Jeanson\yphilippines\php-api\test-update.php`

Just copy them along with the others.

---

## 📤 STEP 3: Upload to cPanel

### Option A: Using cPanel File Manager
1. Log in to cPanel
2. Click "File Manager"
3. Navigate to: `public_html/php-api/`
4. For each of the 4 files:
   - If overwriting existing: Right-click → Edit/Upload
   - If new file: Upload button → add file

### Option B: Using FTP
```
ftp> cd /public_html/php-api/
ftp> put utils.php
ftp> put admin_locals_update.php
ftp> put diagnose.php
ftp> put test-update.php
ftp> quit
```

### Option C: Using SSH/Terminal
```bash
cd /home/ymcaph/public_html/php-api/
# Copy/paste the files here
ls -la  # Verify all 4 are there
```

---

## ✅ STEP 4: Verify Upload Was Successful

### Check 1: Files Exist
In cPanel File Manager, confirm all 4 files are in `public_html/php-api/`:
- ✅ utils.php
- ✅ admin_locals_update.php
- ✅ diagnose.php
- ✅ test-update.php

### Check 2: Files Have Content
Click each file → should show code content, not empty

---

## 🔍 STEP 5: Run Diagnostic

**Open your browser and visit:**
```
https://ymca.ph/testsite/php-api/diagnose.php
```

**You'll see JSON output. Look for:**
```
"status": "OK"
```

If you see OK, everything is ready. If not, the output tells you what's wrong:
- `connected: false` → Database issue
- `local_record_count: 0` → No data in DB
- `writable: false` → File permissions issue

---

## 🧪 STEP 6: Test Update Function

**Visit:**
```
https://ymca.ph/testsite/php-api/test-update.php?id=MANILA
```

(Replace MANILA with actual local ID from your database)

**Look for:**
```json
"success": true
```

If true, updates work! If false, the error message tells you why.

---

## 🎯 STEP 7: Test in Admin Panel

1. Go to: `https://ymca.ph/testsite/admin`
2. Click "Find Your YMCA"
3. Select a local YMCA
4. **Change one value** (e.g., corporate members: 10 → 11)
5. Click **Save**
6. Should show ✅ "Local updated successfully"
7. **CRITICAL TEST**: Refresh the page (F5)
   - Does the changed value STILL show the new number?
   - ✅ YES → FIXED! 🎉
   - ❌ NO → Still broken, diagnostic will show why

---

## 🔴 TROUBLESHOOTING

### Problem: diagnose.php shows errors

**Connected: false**
- Go to cPanel → Database Management
- Copy exact username and password
- Check in `config.php` that they match exactly

**local_record_count: 0**
- Go to cPanel → phpMyAdmin
- Select `ymcaph_db`
- Click `local` table
- Should show your YMCA locals
- If empty, you need to import/populate data

**Uploads writable: false**
- Go to cPanel → File Manager
- Navigate to `backend/uploads/`
- Right-click → Change Permissions → Set to 755

### Problem: test-update.php shows success: false

Check the `affected_rows` value:
- **0**: Local ID doesn't exist - use correct ID from diagnose output
- **1 but verification failed**: Weird database issue - check error log

### Problem: Admin panel still doesn't save

1. Open browser DevTools (F12)
2. Go to Network tab
3. Make a change and Save
4. Look for a request to `/admin/locals/` 
5. Click it → check Response
6. If error, it will show what went wrong

---

## 📊 Success Indicators

✅ **All of these should be TRUE:**
1. diagnose.php shows status = "OK"
2. test-update.php shows success = true
3. Admin panel update shows "Local updated successfully"
4. After refresh, the change STILL appears
5. No 503 errors in console
6. No errors in error.log

---

## 📞 If Still Broken

Go to: `https://ymca.ph/testsite/php-api/error.log`

Look for recent entries with:
- `[ADMIN_LOCALS_UPDATE]` 
- `[TEST-UPDATE]`
- `ERROR`

These will show exactly what's failing.

Or share:
1. Output of diagnose.php
2. Output of test-update.php?id=MANILA
3. Last 20 lines of error.log

This tells us exactly what's wrong.

---

## ⏱️ Time Required

- Upload files: **2-3 minutes**
- Run diagnostics: **2 minutes**
- Verify in admin panel: **1-2 minutes**
- **Total: 5-7 minutes**

---

## 🎉 You're Done!

Once tests pass, your system is fixed:
- ✅ Admin updates save to database
- ✅ Images upload and load correctly
- ✅ Users see current local data
- ✅ No 503 errors

Go live! 🚀
