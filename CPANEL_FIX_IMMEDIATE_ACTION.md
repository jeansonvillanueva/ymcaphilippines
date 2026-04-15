# cPanel Deployment - Immediate Action Items

## 📋 Summary of Issues Found

1. **Updates appear successful but don't save to database**
   - Frontend shows "Local updated successfully"
   - Database shows no changes
   
2. **503 errors when loading uploaded images**
   - `/uploads/` path in API responses is incorrect
   - Image URLs resolve to non-existent paths
   
3. **Zero content for users**
   - Either database is empty OR not being queried/updated correctly

---

## 🔧 Fixes Applied

### ✅ Fix 1: Corrected Upload Path Calculation
**File**: `php-api/utils.php`
- **Change**: Updated `getUploadBasePath()` function
- **What it fixes**: Image upload URLs will now resolve correctly on cPanel subdirectory (`/testsite/`)

### ✅ Fix 2: Added Comprehensive Logging
**File**: `php-api/endpoints/admin_locals_update.php`
- **Change**: Added detailed diagnostic logging for every step
- **What it fixes**: Error logs will now clearly show why updates fail or don't affect rows

### ✅ Fix 3: Created Diagnostic Tools
**Files**: 
- `php-api/diagnose.php` - Full system health check
- `php-api/test-update.php` - Test if updates actually work

---

## 🚀 Next Steps (For You to Execute)

### Step 1: Upload Updated Files to cPanel

Upload these files to your cPanel `public_html/php-api/` directory:

1. ✅ `php-api/utils.php` (MODIFIED)
2. ✅ `php-api/endpoints/admin_locals_update.php` (MODIFIED)
3. ✅ `php-api/diagnose.php` (NEW)
4. ✅ `php-api/test-update.php` (NEW)

**Using cPanel File Manager:**
- Navigate to `public_html/php-api/`
- Upload or overwrite these 4 files

**Using FTP:**
```
ftp> cd /public_html/php-api/
ftp> put utils.php
ftp> put endpoints/admin_locals_update.php
ftp> put diagnose.php
ftp> put test-update.php
```

---

### Step 2: Run Diagnostic Check

1. Open your browser
2. Visit: **`https://ymca.ph/testsite/php-api/diagnose.php`**

3. Check the JSON response for:
   - ✅ `database.connected` should be `true`
   - ✅ `database.tables` should include `local`
   - ✅ `database.local_record_count` should be > 0
   - ✅ `directories.uploads.exists` should be `true`
   - ✅ `directories.uploads.writable` should be `true`

**If ANY check shows false/error**, note the details - this tells you what's broken.

---

### Step 3: Test Database Updates

1. Find a local ID from the diagnostic response (e.g., "MANILA", "CEBU1", etc.)
2. Visit: **`https://ymca.ph/testsite/php-api/test-update.php?id=MANILA`**

3. Look at the response:
   - ✅ `success` should be `true`
   - ✅ `details.affected_rows` should be `1`
   - ✅ `details.verification_passed` should be `true`

**If test fails**, the response will tell you exactly why.

---

### Step 4: Check Error Logs

The detailed logging should tell you exactly what's happening.

**Via cPanel File Manager:**
1. Navigate to `public_html/php-api/`
2. Open `error.log` file
3. Scroll to the bottom to see latest entries
4. Look for lines starting with `[ADMIN_LOCALS_UPDATE]` or `[TEST-UPDATE]`

**If using SSH terminal:**
```bash
tail -100 /home/ymcaph/public_html/php-api/error.log | grep -E "\[ADMIN_LOCALS_UPDATE\]|\[TEST-UPDATE\]"
```

---

## 🔍 Common Issues & Solutions

### Issue: `database.connected = false`

**Symptoms**: Cannot connect to database
- Check database credentials in `config.php`
- Verify MySQL user exists: `ymcaph_user`
- Verify MySQL password is correct
- Verify hostname is `localhost` (cPanel standard)

**Solution**:
```bash
# SSH into cPanel and verify:
mysql -h localhost -u ymcaph_user -p ymcaph_db -e "SELECT COUNT(*) FROM local;"
```

---

### Issue: `database.tables` doesn't include `local`

**Symptoms**: Local table doesn't exist in database

**Solution**:
1. Check if database was created: run `diagnose.php` again
2. If still missing, you need to import your database schema
3. Go to cPanel → Databases → phpMyAdmin
4. Import your SQL file with the schema

---

### Issue: `database.local_record_count = 0`

**Symptoms**: Database is connected but has no local records

**Causes**:
- Your backend hasn't created records yet
- Records were in a different database
- Data migration didn't complete

**Solution**:
- Use cPanel phpMyAdmin to manually check the `local` table
- If empty, you need to populate it with your YMCA locals data
- Or verify data was migrated from old system

---

### Issue: `test-update.php` returns affected_rows = 0

**Symptoms**: Update query runs but doesn't change anything

**Causes**:
1. Local ID doesn't exist in database
2. All updated values are already identical to existing values
3. Column names in SQL don't match actual database columns

**Solution**:
1. Check `status.checks` in `diagnose.php` shows `Local Records > 0 = true`
2. Check the sample locals shown in diagnostics
3. Try updating with DIFFERENT data than what's currently there
4. If still fails, check column names in `local` table match the SQL query

---

### Issue: Image uploads still return 503

**Symptoms**: After fixes, images still fail to load

**Causes**:
1. Uploads directory not writable
2. Directory doesn't exist
3. File permissions issue

**Solution**:
1. Check `diagnose.php` shows:
   - `directories.uploads.exists = true`
   - `directories.uploads.writable = true`
2. If writable = false, fix permissions on cPanel:
   - Go to File Manager → `backend/uploads/`
   - Right-click → Change Permissions
   - Set to `755` (Read, Write, Execute for owner; Read & Execute for others)

---

## 📊 Expected Success Indicators

After applying fixes, you should see:

1. ✅ **Diagnostic Script** (`diagnose.php`):
   - All green checkmarks
   - Database connected
   - Local table with records
   - Uploads directory writable

2. ✅ **Test Update Script** (`test-update.php`):
   - `success = true`
   - `affected_rows = 1`
   - `verification_passed = true`

3. ✅ **Admin Panel**:
   - Updates actually save to database
   - Images upload and load correctly
   - Users see local data on frontend

4. ✅ **Error Logs**:
   - No database connection errors
   - No file permission errors
   - Detailed logs showing successful updates

---

## 📞 Support Information

If issues persist after applying fixes:

1. **Share the output of `diagnose.php`** - This tells us if database is connected, has data, etc.
2. **Share the output of `test-update.php?id=MANILA`** - This shows if updates work
3. **Check the error.log** in `php-api/` folder - Look for `[ADMIN_LOCALS_UPDATE]` entries
4. **Verify MySQL credentials** in `config.php` match cPanel database setup

---

## 🎯 Quick Checklist Before Going Live

- [ ] Uploaded modified files to cPanel
- [ ] Ran `diagnose.php` - all checks passing
- [ ] Ran `test-update.php?id=[valid-local-id]` - success = true
- [ ] Tested manual update in admin panel - data saved to database
- [ ] Tested image upload - no 503 errors
- [ ] Checked error.log - no critical errors
- [ ] Verified users see updated local data on frontend
- [ ] Tested on mobile/different browsers

---

## 📝 Troubleshooting Log Template

Keep a record of your diagnostics:

```
Date/Time: ____________________
Database Connected: YES / NO
Local Table Exists: YES / NO
Local Record Count: __________
Uploads Writable: YES / NO

Test Update Result: PASS / FAIL
Affected Rows: __________
Error Message: ____________________

Admin Panel Update Test:
  - Updated field: ____________________
  - New value: ____________________
  - Shows success message: YES / NO
  - Actually saved to DB: YES / NO
```
