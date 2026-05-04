# Calendar Date Range - Implementation Checklist

## Pre-Deployment Verification

- [ ] Read [CALENDAR_DATE_RANGE_FEATURE.md](CALENDAR_DATE_RANGE_FEATURE.md) documentation
- [ ] Backup database before applying migration
- [ ] Test in development environment first

## Database Setup

- [ ] Apply migration from [CALENDAR_DATE_RANGE_MIGRATION.sql](CALENDAR_DATE_RANGE_MIGRATION.sql)
  ```sql
  ALTER TABLE calendar_events 
  ADD COLUMN IF NOT EXISTS start_date DATE NOT NULL DEFAULT CURDATE(),
  ADD COLUMN IF NOT EXISTS end_date DATE NOT NULL DEFAULT CURDATE();
  ```
- [ ] Verify table structure: `DESCRIBE calendar_events;`
- [ ] Should show columns: `id`, `title`, `date`, `start_date`, `end_date`, `description`, `imageUrl`, `created_at`, `updated_at`

## Backend Deployment

### Node.js Backend
- [ ] Update `backend/database-init.js` - Added `start_date` and `end_date` to schema
- [ ] Update `backend/index.js` - Updated calendar endpoints (GET, POST, PUT)
  - GET orders by `start_date DESC`
  - POST/PUT validate date ranges
  - Both accept `startDate` and `endDate` fields
- [ ] Restart Node.js server: `npm start` or `pm2 restart backend`

### PHP API (if used)
- [ ] Update `php-api/endpoints/admin_calendar.php` - Order by `start_date`
- [ ] Update `php-api/endpoints/admin_calendar_create.php` - Accept `startDate`/`endDate`
- [ ] Update `php-api/endpoints/admin_calendar_update.php` - Accept `startDate`/`endDate`
- [ ] Update `php-api/index.php` - Support new secure admin URL path

## Frontend Deployment

- [ ] Update `frontend/src/pages/admin/AdminCalendar.tsx`
  - `CalendarEvent` interface updated
  - Form state uses `startDate` and `endDate`
  - Date range validation implemented
  - Display shows date ranges
  - Sorting by start date
- [ ] Rebuild frontend: `npm run build`
- [ ] Deploy build folder
- [ ] Clear browser cache (Ctrl+F5 or Cmd+Shift+R)

## Testing Checklist

### Functional Testing
- [ ] Access admin dashboard at: `https://ymca.ph/secure-management/v3/k7n4m9p2q8c1x5j3/portal/dashboard`
- [ ] Click "Manage Calendar of Activities"
- [ ] Test: Create event with date range
  - Title: "Test Event"
  - Start: 2026-05-15
  - End: 2026-05-20
- [ ] Test: Single-day event (same start and end date)
- [ ] Test: Edit existing event
- [ ] Test: Delete event
- [ ] Verify event displays with correct date range format
- [ ] Verify auto-generated descriptions

### Error Testing
- [ ] Try start date after end date → Should show error
- [ ] Try missing start date → Should show error
- [ ] Try missing end date → Should show error
- [ ] Try event without title → Should show error

### Browser Testing
- [ ] Firefox (latest)
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Mobile browser (if applicable)

### Performance Testing
- [ ] Load 100+ events → Should load quickly
- [ ] Edit event with large image → Should handle
- [ ] Scroll through long event list → Should be smooth

## Backward Compatibility Check

- [ ] Old events still accessible
- [ ] Old events display with correct dates
- [ ] Old event editing still works

## Rollback Plan

If issues occur:

1. **Revert Database**
   ```sql
   -- Keep the columns but restore old behavior
   UPDATE calendar_events SET start_date = date, end_date = date;
   ```

2. **Revert Backend**
   - Restore previous `backend/index.js`
   - Restart Node.js

3. **Revert Frontend**
   - Restore previous build folder
   - Clear browser cache

## Deployment Confirmation

- [ ] Admin can create calendar events with date ranges
- [ ] Events display date ranges correctly
- [ ] Date validation works (start ≤ end)
- [ ] Auto-descriptions generate properly
- [ ] Old events work without issues
- [ ] No JavaScript console errors
- [ ] All CRUD operations (Create, Read, Update, Delete) work

## Post-Deployment

- [ ] Monitor for errors in logs
- [ ] Get feedback from admin users
- [ ] Update staff documentation
- [ ] Schedule training if needed

---

## Quick Reference

### API Endpoints
- **GET** - List all events: `/admin/calendar`
- **POST** - Create event: `/admin/calendar`
- **PUT** - Update event: `/admin/calendar/:id`
- **DELETE** - Delete event: `/admin/calendar/:id`

### Date Format
**YYYY-MM-DD** (e.g., 2026-05-15)

### Admin URL
`https://ymca.ph/secure-management/v3/k7n4m9p2q8c1x5j3/portal/dashboard`

### Required Fields
- `title` - Event name
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `description` - Optional (auto-generated if blank)

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Status:** ☐ In Progress | ☐ Complete | ☐ Rolled Back

**Notes:**
_________________________________
_________________________________
_________________________________
