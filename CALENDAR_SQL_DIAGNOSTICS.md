# SQL Diagnostic Queries for Calendar Events

Run these queries in phpMyAdmin to diagnose the issue.

## 1. Check Table Structure

```sql
DESCRIBE calendar_events;
```

**Expected output:**
- `id` (INT, Primary Key)
- `title` (VARCHAR)
- **`start_date`** (DATE) ← Must exist!
- **`end_date`** (DATE) ← Must exist!
- `date` (DATE, for legacy single-date events)
- `description` (TEXT)
- `imageUrl` (VARCHAR)
- `created_at` (TIMESTAMP)

**If `start_date` or `end_date` are missing:** Go to "Quick Fix" section below.

---

## 2. Check All Events

```sql
SELECT * FROM calendar_events ORDER BY id DESC;
```

**What to look for:**
- Are there any events at all?
- Do the recent events have data in `start_date` and `end_date`?
- Or are these columns NULL?

---

## 3. Check Specific Event

Replace `123` with an actual event ID from your database:

```sql
SELECT id, title, start_date, end_date, description, imageUrl, created_at 
FROM calendar_events 
WHERE id = 123;
```

---

## 4. Count Events by Date Status

```sql
SELECT 
  COUNT(*) as total_events,
  SUM(CASE WHEN start_date IS NOT NULL THEN 1 ELSE 0 END) as with_start_date,
  SUM(CASE WHEN end_date IS NOT NULL THEN 1 ELSE 0 END) as with_end_date,
  SUM(CASE WHEN date IS NOT NULL THEN 1 ELSE 0 END) as with_legacy_date
FROM calendar_events;
```

**What to look for:**
- If `with_start_date` = 0: Database migration not applied
- If `with_legacy_date` > 0 and others = 0: Old events exist but new ones aren't saving

---

## 5. Find Events Missing Start/End Dates

```sql
SELECT id, title, date, start_date, end_date, created_at 
FROM calendar_events 
WHERE start_date IS NULL OR end_date IS NULL 
ORDER BY id DESC;
```

**What this tells you:**
- These events were saved but the date range columns are NULL
- The INSERT statement either silently failed or skipped these columns

---

## 6. Check Recent 5 Events

```sql
SELECT 
  id,
  title,
  DATE_FORMAT(start_date, '%Y-%m-%d') as start_date,
  DATE_FORMAT(end_date, '%Y-%m-%d') as end_date,
  DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
FROM calendar_events 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## Quick Fix: Add Missing Columns

If columns don't exist, run this:

```sql
ALTER TABLE calendar_events
ADD COLUMN start_date DATE AFTER date,
ADD COLUMN end_date DATE AFTER start_date,
ADD INDEX idx_start_date (start_date);
```

Then verify it worked:

```sql
DESCRIBE calendar_events;
```

Should now show `start_date` and `end_date` columns.

---

## Populate Existing Events (Optional)

If you have old events without date ranges, populate them:

```sql
UPDATE calendar_events 
SET start_date = date, end_date = date 
WHERE start_date IS NULL AND date IS NOT NULL;
```

This copies the single date to both start_date and end_date, converting single-day events to 1-day ranges.

---

## Verify API Can See Events

```sql
SELECT 
  id, title, start_date, end_date, description, imageUrl,
  DATEDIFF(end_date, start_date) + 1 as duration_days
FROM calendar_events 
WHERE start_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY start_date DESC;
```

This shows:
- Recent events
- How many days each event spans
- Verifies data is accessible to API

---

## Test with Sample Data

Insert a test event:

```sql
INSERT INTO calendar_events (title, start_date, end_date, description, created_at)
VALUES (
  'Test Event',
  '2026-05-22',
  '2026-05-24',
  'This is a test event',
  NOW()
);
```

Then verify it was inserted:

```sql
SELECT * FROM calendar_events WHERE title = 'Test Event';
```

Now check if it appears on your user calendar at `https://ymca.ph/What_We_Do`

If it does: ✅ System is working, form submission issue
If it doesn't: ❌ API retrieval issue

---

## If Events Exist But Don't Show on Calendar

Check the public API endpoint:

1. Open: `https://ymca.ph/testsite/php-api/index.php?path=/api/calendar`
2. Search the page for your event title
3. If found: ✅ API works, frontend issue
4. If not found: ❌ API query issue

---

## Column Type Reference

If you need to add columns manually:

```sql
ALTER TABLE calendar_events ADD COLUMN start_date DATE;
ALTER TABLE calendar_events ADD COLUMN end_date DATE;
ALTER TABLE calendar_events ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE calendar_events ADD INDEX idx_start_date (start_date);
ALTER TABLE calendar_events ADD INDEX idx_end_date (end_date);
```

---

## Check Index Exists

```sql
SHOW INDEX FROM calendar_events;
```

Should show an index on `start_date` for performance.

---

**After running these queries, you'll know exactly where the problem is:**
- ❌ Column doesn't exist → Run migration
- ❌ Column is NULL → Form data not being sent
- ✅ Column has data → Check frontend/API retrieval
