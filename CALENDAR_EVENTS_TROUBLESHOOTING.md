# 🔧 Calendar Events Not Saving - Troubleshooting Guide

## Problem
- ✅ "Event added successfully" message appears
- ❌ Event does NOT appear in database
- ❌ Event does NOT appear in admin "Upcoming & Recent Events"
- ❌ Event does NOT appear in user "Calendar of Activities"

---

## Step 1: Check Browser Console Logs

1. Open your admin calendar form
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for messages starting with `=== FORM DATA DEBUG ===`
5. Check if `startDate` and `endDate` are being sent

**Screenshot example:**
```
=== FORM DATA DEBUG ===
FormData entries:
  title: National Collab
  startDate: 2026-05-22
  endDate: 2026-05-24
  description: National Collab from May 22, 2026 to May 24, 2026. Details to follow.

Submitting event data: {title: "National Collab", startDate: "2026-05-22", endDate: "2026-05-24", …}
```

**If you see this:** ✅ The form is sending data correctly. Continue to Step 2.
**If you DON'T see this:** ❌ The form isn't sending data. Contact support.

---

## Step 2: Check Server Response

In the same **Console** tab, look for `POST Response: 200` messages:

```
POST Response: 200 {id: 123, message: "Event added successfully"}
```

**If you see this:** ✅ The API received the data. Continue to Step 3.
**If you see an error response:** ❌ The API rejected the data. Look at the error message:
- `"startDate is required"` → Field name mismatch
- `"Database schema error"` → Migration not applied (see Step 3)

---

## Step 3: Check Database Migration

The most common issue: **The database columns `start_date` and `end_date` don't exist yet**

### Option A: Use the Diagnostic Script (Easy)

1. Upload this file to your server: `php-api/diagnostic_calendar.php`
2. Open it in browser: `https://ymca.ph/testsite/php-api/diagnostic_calendar.php`
3. This will show:
   - ✅ or ❌ for each required column
   - Current events in the database
   - Missing columns (if any)

### Option B: Check Manually in phpMyAdmin

1. Open phpMyAdmin (cPanel → phpMyAdmin)
2. Select your database `ymcaph_db`
3. Click **"calendar_events"** table
4. Click **"Structure"** tab
5. Look for these columns:
   - ✅ `start_date` (Type: DATE)
   - ✅ `end_date` (Type: DATE)
   - ✅ `title` (Type: VARCHAR)
   - ✅ `description` (Type: TEXT)
   - ✅ `imageUrl` (Type: VARCHAR)

**If MISSING `start_date` or `end_date`:**
```sql
ALTER TABLE calendar_events
  ADD COLUMN start_date DATE AFTER date,
  ADD COLUMN end_date DATE AFTER start_date,
  ADD INDEX idx_start_date (start_date);
```

---

## Step 4: Check PHP Error Logs

If events are being sent but not saved, the PHP API might be logging errors.

### Check Error Logs in cPanel

1. **cPanel** → **Logs** → **Error Log**
2. Look for entries with `[CALENDAR_CREATE]` or `[CALENDAR_UPDATE]`

**Example error:**
```
[CALENDAR_CREATE] Error: startDate is required. Data keys: title, description, imageUrl
```

This means the FormData fields aren't reaching the PHP backend properly.

---

## Step 5: Check API Response

Make a direct test of the public API endpoint:

1. Open this URL in your browser:
   ```
   https://ymca.ph/testsite/php-api/index.php?path=/api/calendar
   ```

2. You should see JSON array of events:
   ```json
   [
     {
       "id": 1,
       "title": "Annual Meeting",
       "start_date": "2026-05-15",
       "end_date": "2026-05-20",
       "description": "...",
       "imageUrl": "..."
     }
   ]
   ```

**If you see empty array `[]`:** 
- No events in database yet
- OR database columns don't exist
- Go back to Step 3

**If you see error response:** 
- API routing problem
- Contact hosting support

---

## Step 6: Verify Events in Database

Using **phpMyAdmin**:

1. Select `calendar_events` table
2. Click **Browse**
3. Look at the data:
   - Do you see `start_date` and `end_date` populated?
   - OR are they NULL?

**If NULL:**
- The migration added the columns but didn't populate data
- The form data isn't reaching the database
- Check PHP error logs (Step 4)

**If empty table:**
- No events have been saved at all
- The INSERT isn't working
- Check error logs and database schema

---

## Diagnostic Checklist

Run through this checklist:

- [ ] Browser console shows FormData being sent with startDate & endDate
- [ ] Browser console shows POST Response: 200
- [ ] phpMyAdmin shows `start_date` and `end_date` columns exist
- [ ] Diagnostic script shows ✅ for all required columns
- [ ] Public API endpoint returns events with start_date populated
- [ ] Event visible in `calendar_events` table in phpMyAdmin

**If all ✅:** System is working! Events should appear on user calendar.
**If any ❌:** Identify which step failed and focus on that.

---

## Common Issues & Solutions

### Issue: "Event added successfully" but event doesn't save

**Solution 1: Run Database Migration**
```sql
ALTER TABLE calendar_events
  ADD COLUMN IF NOT EXISTS start_date DATE,
  ADD COLUMN IF NOT EXISTS end_date DATE,
  ADD INDEX idx_start_date (start_date);
```

**Solution 2: Check column names**
Make sure PHP is using `start_date` (with underscore), not `startDate`

**Solution 3: Verify existing events**
```sql
SELECT * FROM calendar_events LIMIT 1;
```
Check if older events have NULL in `start_date`/`end_date` columns

---

## Debug: What The System Expects

### Admin Form Sends:
```javascript
{
  "title": "Event Name",
  "startDate": "2026-05-22",     // YYYY-MM-DD format
  "endDate": "2026-05-24",       // YYYY-MM-DD format
  "description": "Auto-generated",
  "image": <File object>          // Optional
}
```

### PHP Backend Saves To:
```sql
INSERT INTO calendar_events (title, start_date, end_date, description, imageUrl)
VALUES ('Event Name', '2026-05-22', '2026-05-24', 'Auto-generated', '/uploads/...')
```

### Public API Returns:
```json
{
  "id": 1,
  "title": "Event Name",
  "start_date": "2026-05-22",
  "end_date": "2026-05-24",
  "description": "Auto-generated",
  "imageUrl": "/uploads/...",
  "created_at": "2026-05-04 10:30:00"
}
```

---

## Need Help?

1. **Run diagnostic_calendar.php** - This will tell you exactly what's wrong
2. **Check PHP error logs** - Look for `[CALENDAR_CREATE]` messages
3. **Use browser DevTools** - Check if FormData is being sent correctly
4. **Verify database** - Make sure columns exist in phpMyAdmin

---

## After Fixing

Once you've resolved the issue:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Reload the admin page** (Ctrl+F5)
3. **Create a test event** with simple data
4. **Verify it appears** in both admin and user views within 30 seconds

---

**Status:** ✅ Debugging tools added and rebuilt
**Next:** Follow the troubleshooting steps above to identify the exact problem
