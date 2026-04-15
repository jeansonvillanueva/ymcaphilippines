# Quick Reference - Testing URLs & Key Points

## 🔧 Files to Upload (4 Total)

Copy these files from your local workspace to cPanel `public_html/php-api/`:

```
php-api/
├── utils.php ← OVERWRITE (modified)
├── diagnose.php ← CREATE (new diagnostic tool)
├── test-update.php ← CREATE (new test tool)
└── endpoints/
    └── admin_locals_update.php ← OVERWRITE (modified)
```

---

## 🔗 Testing URLs

### 1. System Diagnostic Check
```
https://ymca.ph/testsite/php-api/diagnose.php
```

**What to look for in response:**
- ✅ `"connected": true`
- ✅ `"local_record_count"` should be > 0
- ✅ `"exists": true` and `"writable": true` under uploads
- ✅ `"status": "OK"` at the summary

---

### 2. Test Database Update
```
https://ymca.ph/testsite/php-api/test-update.php?id=MANILA
```

Replace `MANILA` with an actual local ID from your database.

**What to look for in response:**
- ✅ `"success": true`
- ✅ `"affected_rows": 1`
- ✅ `"verification_passed": true`

---

### 3. Test Admin Panel Manually
```
https://ymca.ph/testsite/admin
```

1. Go to "Find Your YMCA" section
2. Select a local
3. Change one value (e.g., corporate members: 100 → 101)
4. Click Save
5. Should see ✅ "Local updated successfully"
6. **IMPORTANT**: Refresh page - is the change still there?

---

## 📋 What Each Tool Tells You

### `diagnose.php` Response Breakdown

```json
{
  "database": {
    "connected": true/false,        ← Is MySQL connection OK?
    "local_record_count": 5,        ← How many locals in DB?
    "tables": ["local", "..."],     ← What tables exist?
    "sample_locals": [...]          ← Show example records
  },
  "directories": {
    "uploads": {
      "exists": true/false,         ← Is uploads folder there?
      "writable": true/false,       ← Can server write files?
      "files_count": 10             ← How many files uploaded?
    }
  },
  "summary": {
    "status": "OK",                 ← Overall health
    "checks": {
      "Database Connected": true,   ← Each specific check
      "Local Table Exists": true,
      "Local Records > 0": true,
      "Uploads Directory Exists": true,
      "Uploads Directory Writable": true
    }
  }
}
```

**If any check is false = problem to fix**

---

### `test-update.php` Response Breakdown

```json
{
  "success": true/false,            ← Did update work?
  "details": {
    "local_id": "MANILA",           ← Which local tested
    "original_name": "YMCA Manila",
    "test_name": "TEST_UPDATE_...",
    "affected_rows": 1,             ← How many rows changed?
    "verification_passed": true     ← Did we verify the change?
  },
  "diagnostics": {
    "update_found_records": true,   ← Found the local to update?
    "data_actually_changed": true   ← Data actually saved?
  }
}
```

**`success: false` + `affected_rows: 0`** = Local not found OR no change  
**`success: false` + `affected_rows: 1` + `verification_passed: false`** = Update ran but data didn't save properly

---

## 🎯 Decision Tree - Troubleshooting

### Question 1: Is database connected?
```
Visit: diagnose.php
Look for: database.connected = true/false
```

❌ **NO** → Your MySQL isn't working
- Check cPanel Database status
- Verify credentials in config.php
- Make sure ymcaph_user account exists

✅ **YES** → Continue...

---

### Question 2: Does database have local records?
```
Visit: diagnose.php
Look for: local_record_count > 0?
```

❌ **NO** → Database is empty
- You need to populate it
- Check if data is in different database
- Create/import the local records

✅ **YES** → Continue...

---

### Question 3: Are uploads writable?
```
Visit: diagnose.php
Look for: directories.uploads.writable = true/false
```

❌ **NO** → File permissions issue
- Fix via cPanel File Manager
- Change permissions to 755

✅ **YES** → Continue...

---

### Question 4: Can we actually update?
```
Visit: test-update.php?id=MANILA
Look for: success = true/false
```

❌ **NO** → Check the error in response
- If affected_rows = 0: Local ID doesn't exist
- If affected_rows = 1 but verification_passed = false: Something weird happened

✅ **YES** → Continue...

---

### Question 5: Does admin panel save?
```
Visit: Admin panel > Find Your YMCA
Update a field > Save
Refresh page
```

❌ **NO** → Check browser console for errors
- Open DevTools (F12)
- Check Console and Network tabs
- See what error the PUT request returns

✅ **YES** → ISSUE FIXED! 🎉

---

## 🔴 Critical Error Messages & Fixes

### Error: "Database connection failed"
**Cause**: MySQL not accessible  
**Fix**: Check cPanel → Databases, verify credentials

### Error: "Local with ID 'X' not found"
**Cause**: That local_id doesn't exist in database  
**Fix**: Use correct ID from diagnose.php sample_locals

### Error: "Uploads directory does not exist"
**Cause**: `/backend/uploads/` folder not on server  
**Fix**: Create via cPanel File Manager, set perms to 755

### Error: "Uploads directory writable = false"
**Cause**: File permissions not set correctly  
**Fix**: Change permissions to 755 via File Manager

### Test shows "Update executed but no rows were changed"
**Cause**: Either new values identical to old, or column name mismatch  
**Check**: 
1. Did you change the values?
2. Are MySQL column names exactly matching PHP code?

---

## 📊 Success Checklist

- [ ] Uploaded 4 files to cPanel
- [ ] diagnose.php shows status = "OK"
- [ ] test-update.php shows success = true
- [ ] Admin panel update saves to database
- [ ] Refresh page - change persists
- [ ] Images load without 503 errors
- [ ] No errors in error.log file

---

## 🆘 When to Check Error Logs

The detailed logging in the modified files writes to:
```
public_html/php-api/error.log
```

Check this file if:
1. Tests show failures
2. Admin panel updates aren't working
3. You see weird behavior

**In cPanel File Manager:**
1. Navigate to `public_html/php-api/`
2. Open `error.log`
3. Scroll to bottom for latest entries
4. Look for lines with:
   - `[ADMIN_LOCALS_UPDATE]` - from the update endpoint
   - `[TEST-UPDATE]` - from test script
   - Error messages will explain what went wrong

**Via Terminal:**
```bash
tail -50 /home/ymcaph/public_html/php-api/error.log
```

---

## 🎓 Common Scenarios

### Scenario: "Updated successfully" but data doesn't change

1. ✅ Admin panel shows success message
2. ❌ Refresh shows old value
3. ❌ Database still has old value

**Diagnosis:**
```
Run: test-update.php?id=MANILA
```

If `success: false` and `affected_rows: 0`:
- Local ID doesn't exist OR
- Column names don't match in SQL

If `success: true` and `affected_rows: 1`:
- Update worked!
- Check if admin panel is sending correct data

---

### Scenario: Images show 503 errors

1. ❌ Image upload succeeds
2. ❌ Image disappears with 503 error in console

**Diagnosis:**
```
Check: diagnose.php
Look for: upload_base_path value
```

Should be: `/testsite` (not `/testsite/php-api`)

If it's wrong, the path calculation needs fixing.

---

### Scenario: Admin panel doesn't send updates

1. Enter data
2. Click Save
3. Nothing happens or loading spins forever

**Diagnosis:**
```
Open DevTools (F12) → Network tab
Click Save again
Look for failed requests
```

Check if PUT request to `/admin/locals/MANILA` fails with error

---

## 📞 When Asking for Help

If you can't resolve it yourself, provide:

1. **Output of diagnose.php** - Copy entire JSON response
2. **Output of test-update.php?id=MANILA** - Full response
3. **Last 20 lines of error.log** - Show what's happening
4. **What you did** - Step by step what you tried
5. **What error you see** - Exact error message

This info tells us exactly what's wrong! 🎯
