# Calendar of Activities - Date Range Feature

## Overview

The Calendar of Activities admin panel has been enhanced to support **date range selection**. Admins can now specify a start date and end date for events, enabling better management of multi-day activities, conferences, and ongoing programs.

**Date Format:** YYYY-MM-DD (e.g., 2026-05-15)

---

## Features

### What's New

✅ **Date Range Input** - Select both start and end dates for events  
✅ **Validation** - Prevents invalid date ranges (start must be before end)  
✅ **Single-Day Events** - Start and end date can be the same  
✅ **Auto-Description** - System generates descriptions with date ranges automatically  
✅ **Backward Compatible** - Existing single-date events work with the new system  
✅ **Sorted Display** - Events displayed in reverse chronological order by start date  

---

## User Interface

### Admin Calendar Form

```
Event Title *              [Text Input]

Start Date *              [Date Picker: YYYY-MM-DD]

End Date *                [Date Picker: YYYY-MM-DD]

Description (optional)    [Textarea - leave blank for auto-generation]

Upload Image (optional)   [File Input]
```

### Event Display

Each event shows:
- **Title** - Event name
- **Date Range** - "Month Day, Year - Month Day, Year" format
- **Description** - Event details
- **Image** - If attached
- **Edit/Delete buttons** - Manage the event

**Examples:**
- Single day: "May 15, 2026"
- Multi-day: "May 15, 2026 - May 20, 2026"

---

## Implementation Details

### Frontend Changes

**File:** [frontend/src/pages/admin/AdminCalendar.tsx](frontend/src/pages/admin/AdminCalendar.tsx)

**Updates Made:**
- Updated `CalendarEvent` interface to include `startDate` and `endDate` fields
- Changed form state from single `date` field to `startDate` and `endDate`
- Added date range validation (start ≤ end)
- Modified form submission to handle date range
- Updated event display to show date ranges
- Changed sorting logic to order by `startDate` (descending)

**Key Changes:**
```typescript
interface CalendarEvent {
  startDate?: string;  // New
  endDate?: string;    // New
  // ... other fields
}

// Validation
if (startDate > endDate) {
  setMessage({ type: 'error', text: 'Start date cannot be after end date' });
}

// Auto-description generation
if (startDate === endDate) {
  description = `${title} on ${formattedStart}...`;
} else {
  description = `${title} from ${formattedStart} to ${formattedEnd}...`;
}
```

### Backend Node.js Changes

**File:** [backend/index.js](backend/index.js)

**GET /admin/calendar**
- Updated to order by `start_date DESC` instead of `date DESC`

**POST /admin/calendar**
- Now accepts `startDate` and `endDate` fields (required)
- Validates date range server-side
- Stores both dates in the database

**PUT /admin/calendar/:id**
- Updated to accept and validate `startDate` and `endDate`
- Maintains same validation as POST

### Database Changes

**File:** [backend/database-init.js](backend/database-init.js)

**Schema Update:**
```sql
CREATE TABLE IF NOT EXISTS calendar_events (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE,                    -- Legacy field (kept for compatibility)
  start_date DATE NOT NULL,     -- New field
  end_date DATE NOT NULL,       -- New field
  description TEXT,
  imageUrl VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### PHP API Changes

**Files Updated:**
- [php-api/endpoints/admin_calendar.php](php-api/endpoints/admin_calendar.php)
- [php-api/endpoints/admin_calendar_create.php](php-api/endpoints/admin_calendar_create.php)
- [php-api/endpoints/admin_calendar_update.php](php-api/endpoints/admin_calendar_update.php)
- [php-api/index.php](php-api/index.php) - Added routing support

**Changes:**
- Updated to handle `startDate` and `endDate` instead of single `date`
- Added server-side date range validation
- Updated query ORDER BY clause to use `start_date DESC`
- Added support for new secure admin URL path

---

## Database Migration

### How to Apply

**Option 1: Using MySQL Client**

```sql
-- Run the migration file
mysql -u username -p database_name < CALENDAR_DATE_RANGE_MIGRATION.sql
```

**Option 2: Manually via cPanel or MySQL Console**

Copy and paste the SQL from [CALENDAR_DATE_RANGE_MIGRATION.sql](CALENDAR_DATE_RANGE_MIGRATION.sql) into your MySQL console.

**Option 3: Application Startup**

The Node.js backend (`database-init.js`) will automatically create the table with the new schema on first run.

### Migration SQL

```sql
-- Add new columns if they don't exist
ALTER TABLE calendar_events 
ADD COLUMN IF NOT EXISTS start_date DATE NOT NULL DEFAULT CURDATE() AFTER date,
ADD COLUMN IF NOT EXISTS end_date DATE NOT NULL DEFAULT CURDATE() AFTER start_date;

-- Populate existing events with date range based on old 'date' column
UPDATE calendar_events 
SET start_date = date, end_date = date 
WHERE start_date = CURDATE() AND end_date = CURDATE() AND date IS NOT NULL;

-- Add index for faster queries
ALTER TABLE calendar_events ADD INDEX idx_start_date (start_date);
```

---

## Deployment Steps

### 1. **Database Setup**

```bash
# Apply the migration
mysql -u your_username -p your_database < CALENDAR_DATE_RANGE_MIGRATION.sql
```

### 2. **Backend Deployment**

```bash
# Stop the current backend
# Deploy the updated backend/index.js file
# Restart the Node.js server

# Or if using PM2:
pm2 restart backend
```

### 3. **Frontend Deployment**

```bash
# Build the updated frontend
cd frontend
npm run build

# Deploy the build folder
# Clear browser cache
```

### 4. **PHP API Deployment** (if applicable)

- Upload updated PHP endpoints to your server
- Upload updated `php-api/index.php` with new routing

### 5. **Testing**

```bash
# Test in admin panel
1. Go to: /secure-management/v3/k7n4m9p2q8c1x5j3/portal/dashboard
2. Click "Manage Calendar of Activities"
3. Create a test event with:
   - Title: "Test Event"
   - Start Date: 2026-05-15
   - End Date: 2026-05-20
4. Verify event appears with date range display
5. Test edit and delete operations
```

---

## Error Handling

### Frontend Validation

```
✗ "Start date and end date are required"
  → User must enter both dates

✗ "Start date cannot be after end date"
  → User must correct the date range

✗ "Image must be 5 MB or smaller"
  → User must choose a smaller image
```

### Backend Validation

Same error messages are validated on the server for security.

---

## API Examples

### Create Event with Date Range

```bash
curl -X POST https://ymca.ph/testsite/php-api/index.php?path=/admin/calendar \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Conference",
    "startDate": "2026-06-01",
    "endDate": "2026-06-03",
    "description": "Our annual staff conference"
  }'
```

**Response:**
```json
{
  "id": 15,
  "message": "Event added successfully"
}
```

### Update Event Date Range

```bash
curl -X PUT https://ymca.ph/testsite/php-api/index.php?path=/admin/calendar/15 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Conference",
    "startDate": "2026-06-05",
    "endDate": "2026-06-07",
    "description": "Rescheduled conference"
  }'
```

### Get All Events

```bash
curl https://ymca.ph/testsite/php-api/index.php?path=/admin/calendar
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "NAO Meeting",
    "date": null,
    "start_date": "2026-05-15",
    "end_date": "2026-05-15",
    "description": "NAO Meeting on May 15, 2026...",
    "imageUrl": "/uploads/photo.webp",
    "created_at": "2026-05-04T08:30:00Z",
    "updated_at": "2026-05-04T08:30:00Z"
  }
]
```

---

## Backward Compatibility

### Existing Events

Old events with only a `date` field will:
- Still display correctly in the calendar
- Be treated as single-day events
- Display with the same date for both start and end

### Legacy Single-Date Requests

If an old application still sends only `date` field:
- Frontend has been updated to require both fields
- Backend will reject requests without `startDate` and `endDate`
- Error: `"Start date and end date are required"`

---

## Future Enhancements

### Potential Features

- [ ] **Recurring Events** - Repeat events on specified intervals
- [ ] **Time Zones** - Support for different time zones
- [ ] **All-Day Events Flag** - Toggle for all-day vs. timed events
- [ ] **Event Categories** - Tag events (Workshops, Meetings, etc.)
- [ ] **Calendar Export** - Export events as .ics or PDF
- [ ] **Event Notifications** - Send alerts before events
- [ ] **Public Calendar View** - Display events on public website

---

## Troubleshooting

### Issue: "Invalid date range" error

**Solution:** Ensure start date is before or equal to end date.

### Issue: Events not updating

**Solution:** 
1. Clear browser cache
2. Check that both start and end dates are provided
3. Verify database migration was applied

### Issue: New events not showing in list

**Solution:**
1. Refresh the page
2. Check browser console for errors (F12)
3. Verify dates are in YYYY-MM-DD format

### Issue: Old events showing with blank dates

**Solution:** 
1. Run the migration script
2. Manually update `start_date` and `end_date` for legacy events:
   ```sql
   UPDATE calendar_events 
   SET start_date = date, end_date = date 
   WHERE start_date IS NULL OR end_date IS NULL;
   ```

---

## Files Modified

### Frontend
- ✅ [frontend/src/pages/admin/AdminCalendar.tsx](frontend/src/pages/admin/AdminCalendar.tsx)

### Backend
- ✅ [backend/database-init.js](backend/database-init.js)
- ✅ [backend/index.js](backend/index.js)

### PHP API
- ✅ [php-api/endpoints/admin_calendar.php](php-api/endpoints/admin_calendar.php)
- ✅ [php-api/endpoints/admin_calendar_create.php](php-api/endpoints/admin_calendar_create.php)
- ✅ [php-api/endpoints/admin_calendar_update.php](php-api/endpoints/admin_calendar_update.php)
- ✅ [php-api/index.php](php-api/index.php)

### Database
- 📄 [CALENDAR_DATE_RANGE_MIGRATION.sql](CALENDAR_DATE_RANGE_MIGRATION.sql)

---

## Support

**For technical issues:**
1. Check this documentation
2. Review the troubleshooting section
3. Check browser console for errors (F12)
4. Verify database schema with: `DESCRIBE calendar_events;`

**API Endpoint:** `/admin/calendar` (requires authentication)  
**Admin URL:** `https://ymca.ph/secure-management/v3/k7n4m9p2q8c1x5j3/portal/dashboard`

---

**Last Updated:** May 4, 2026  
**Status:** ✅ Complete and Ready for Deployment
