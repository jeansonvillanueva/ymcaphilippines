# Calendar Date Range - URGENT FIX

## Problem
After adding an event, you see:
- ✅ "Event added successfully" message
- ❌ "Date Range: Invalid Date" displayed
- ❌ Event not saving in database

## Root Cause
The database migration was not applied. Your `calendar_events` table is still missing the `start_date` and `end_date` columns.

## Solution: Apply the Migration Immediately

### Step 1: Open MySQL/phpMyAdmin

**Via cPanel:**
1. Go to your cPanel
2. Click **"phpMyAdmin"**
3. Select database: **ymcaph_db**
4. Select table: **calendar_events**

**Via Command Line:**
```bash
mysql -u your_username -p your_database_name
```

### Step 2: Run the Migration SQL

Copy and paste this SQL into the query window:

```sql
-- Add the new columns
ALTER TABLE calendar_events 
ADD COLUMN start_date DATE AFTER date,
ADD COLUMN end_date DATE AFTER start_date;

-- Populate existing events
UPDATE calendar_events 
SET start_date = date, end_date = date 
WHERE date IS NOT NULL AND (start_date IS NULL OR end_date IS NULL);

-- Add index for faster queries
ALTER TABLE calendar_events ADD INDEX idx_start_date (start_date);
```

### Step 3: Execute

1. Click **"Go"** or **"Execute"** button
2. You should see: **"MySQL returned an empty result set"** or similar success message

### Step 4: Verify

Run this query to check:
```sql
DESCRIBE calendar_events;
```

You should see these columns in order:
```
id          | int
title       | varchar(255)
date        | date
start_date  | date         ← NEW
end_date    | date         ← NEW
description | text
imageUrl    | varchar(500)
created_at  | timestamp
updated_at  | timestamp
```

---

## After Migration Complete

### Test the Feature

1. Go to admin dashboard
2. Navigate to "Manage Calendar of Activities"
3. **Delete the broken event** (if it exists):
   - Click "Delete" on the "Invalid Date" entry

4. **Create a new test event:**
   - Title: `Test Event`
   - Start Date: `2026-05-15`
   - End Date: `2026-05-20`
   - Click **"Add Event"**

5. **Verify:**
   - ✅ You see "Event added successfully"
   - ✅ Event appears with "May 15, 2026 - May 20, 2026"
   - ✅ Event data in database shows dates

### Check Database (Optional)

Run this query to see the new event:
```sql
SELECT id, title, date, start_date, end_date, description, created_at 
FROM calendar_events 
ORDER BY start_date DESC;
```

---

## Still Having Issues?

### Check Browser Console
1. Press **F12** in your browser
2. Go to **"Console"** tab
3. Create an event and look for any red errors
4. Share any error messages

### Check Server Logs

**If using Node.js backend:**
```bash
# Look for console output:
# Should show: [POST /admin/calendar] Submitted event data
```

**If using PHP API:**
```bash
# Check PHP error log for any warnings
```

---

## Quick Reference: File Locations

**Migration File:**
- [FIX_CALENDAR_MIGRATION_IMMEDIATE.sql](FIX_CALENDAR_MIGRATION_IMMEDIATE.sql)

**Documentation:**
- [CALENDAR_DATE_RANGE_FEATURE.md](CALENDAR_DATE_RANGE_FEATURE.md)
- [CALENDAR_DEPLOYMENT_CHECKLIST.md](CALENDAR_DEPLOYMENT_CHECKLIST.md)

---

## Summary of What Changed in Your Database

```diff
  CREATE TABLE calendar_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    date DATE,
+   start_date DATE,          ← ADDED
+   end_date DATE,            ← ADDED
    description TEXT,
    imageUrl VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  )
```

The new date range feature uses `start_date` and `end_date` instead of just `date`.

---

**Status:** ⚠️ CRITICAL - Apply migration NOW to enable the feature

**After Migration:** ✅ Calendar date range will work correctly
