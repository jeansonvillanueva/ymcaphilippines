# Calendar Date Range Display - User-Facing Implementation

## Overview

Events with date ranges (set by admins) now display as **multi-day event bars** on the public Calendar of Activities page, similar to Google Calendar.

## What Changed

### Frontend - Calendar Display

**File:** [frontend/src/components/ActivityCalendar.tsx](frontend/src/components/ActivityCalendar.tsx)

✅ Updated to support both:
- **Old format:** Single `date` field (backward compatible)
- **New format:** `startDate` and `endDate` fields (date ranges)

**How it works:**
- Multi-day events use FullCalendar's `start` and `end` properties
- Single-day events use the `date` property
- Events automatically span across multiple calendar cells when they have a date range

### Frontend - Event Details

**File:** [frontend/src/pages/What_We_Do.tsx](frontend/src/pages/What_We_Do.tsx)

✅ Updated event details panel to show:
- **Single-day:** "May 15, 2026"
- **Multi-day:** "May 15, 2026 - May 20, 2026"
- **Today detection:** Checks if today falls within the date range

### Styling

**File:** [frontend/src/pages/What_We_Do.css](frontend/src/pages/What_We_Do.css)

✅ Added CSS for multi-day event appearance:
- Gradient background to distinguish multi-day events
- Red left border to highlight event duration
- Proper spacing and border radius for calendar cells

### Backend - Data Fetching

**Files Updated:**
- [backend/index.js](backend/index.js) - Added public `/api/calendar` endpoint
- [php-api/endpoints/calendar.php](php-api/endpoints/calendar.php) - Updated sorting

✅ Public calendar endpoint now returns both single and multi-day events ordered by `start_date DESC`

---

## Visual Result

### Before
```
May 2026
┌─────┬──────┬──────┬──────┐
│ 12  │ 13   │ 14   │ 15   │
│ [•] │  [•] │  [ ] │ NAO  │  ← Single dots, no visual connection
│     │      │      │      │
└─────┴──────┴──────┴──────┘
```

### After (Like Google Calendar)
```
May 2026
┌──────────────────────────────┐
│ Conference                   │  ← Event bar spans across days
├──────┬──────┬──────┬──────┐
│ 12   │ 13   │ 14   │ 15   │
│      │      │      │      │
│ [━━━━━━━━━━━━━━━━━━━━━━━━]  │  ← Visual indicator of multi-day event
└──────┴──────┴──────┴──────┘
```

---

## How Users See It

### 1. Calendar Display
When a user visits the Calendar of Activities page:
- **Single-day events** appear as normal event dots
- **Multi-day events** appear as colored bars spanning across multiple dates
- Events are color-coded (Navy with red accent border)

### 2. Event Click
When clicking on an event:
- **Title** displays
- **Date range** shows in user-friendly format
- **Image** and **description** appear in the sidebar
- "Today's event" badge shows if today is within the range

### 3. Visual Distinction
- Multi-day events have a gradient background
- Red left border indicates it's a special/ongoing event
- Rounded corners for modern appearance

---

## Database Query

The public calendar endpoint now uses:

```sql
SELECT * FROM calendar_events 
ORDER BY start_date DESC, date DESC
```

This ensures events appear in chronological order, with the newest/upcoming events first.

---

## API Response Format

### Public Calendar Endpoint: `/api/calendar`

**Old events (single date):**
```json
{
  "id": 1,
  "title": "NAO Meeting",
  "date": "2026-05-15",
  "start_date": null,
  "end_date": null,
  "description": "NAO Meeting on May 15, 2026...",
  "imageUrl": "/uploads/photo.webp"
}
```

**New events (date range):**
```json
{
  "id": 2,
  "title": "Annual Conference",
  "date": null,
  "start_date": "2026-06-01",
  "end_date": "2026-06-03",
  "description": "Our annual staff conference from June 1 to June 3...",
  "imageUrl": "/uploads/conference.webp"
}
```

---

## Testing

### For Users

1. **Go to:** https://ymca.ph/calendar (or Calendar of Activities page)
2. **Look for:**
   - ✅ Single-day events display normally
   - ✅ Multi-day events span across calendar cells
   - ✅ Events are clickable
   - ✅ Event details show correct date range
   - ✅ "Today's event" badge appears when applicable

3. **Test date range:**
   - Create event: May 15-20, 2026
   - Event should appear as a bar spanning 6 calendar cells
   - Click it to see "May 15, 2026 - May 20, 2026"

### For Developers

**Check browser console (F12):**
- No errors when loading calendar
- Calendar events fetched successfully
- Date range logic working correctly

**API test:**
```bash
curl https://ymca.ph/testsite/backend/api/calendar
# Should return events with start_date and end_date fields
```

---

## Browser Support

Works on all modern browsers:
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## Backward Compatibility

✅ **Fully compatible with existing single-date events:**
- Old events with only `date` field still display correctly
- New events with `start_date` and `end_date` display as ranges
- Mixed old and new events work together seamlessly

---

## Files Modified

### Frontend
- ✅ [frontend/src/components/ActivityCalendar.tsx](frontend/src/components/ActivityCalendar.tsx)
- ✅ [frontend/src/pages/What_We_Do.tsx](frontend/src/pages/What_We_Do.tsx)
- ✅ [frontend/src/pages/What_We_Do.css](frontend/src/pages/What_We_Do.css)

### Backend
- ✅ [backend/index.js](backend/index.js) - Added public `/api/calendar` endpoint
- ✅ [php-api/endpoints/calendar.php](php-api/endpoints/calendar.php) - Updated sorting

---

## Deployment

1. **Ensure database migration is complete:**
   ```bash
   # Verify these columns exist:
   # start_date, end_date
   ```

2. **Build and deploy frontend:**
   ```bash
   npm run build
   # Deploy build folder
   ```

3. **Restart backend:**
   ```bash
   # Node.js
   npm start
   
   # Or PM2
   pm2 restart backend
   ```

4. **Test in browser:**
   - Navigate to Calendar of Activities
   - Verify multi-day events display correctly

---

## Troubleshooting

### Issue: Events not spanning across days
**Solution:**
- Verify migration was applied (check `start_date` and `end_date` columns exist)
- Clear browser cache (Ctrl+F5)
- Check browser console for errors (F12)

### Issue: Date range not showing in event details
**Solution:**
- Ensure database has `start_date` and `end_date` values
- Verify API response includes these fields

### Issue: Single-date events don't work
**Solution:**
- This is backward compatible - old events work as-is
- Refresh page to reload calendar data

---

## Performance Notes

- Multi-day events are rendered more efficiently than having separate entries for each day
- Calendar loads faster with fewer total event records
- FullCalendar handles date range rendering automatically

---

## Future Enhancements

- [ ] Color-coded event categories
- [ ] Event time slots (not just all-day)
- [ ] Recurring events
- [ ] Event filtering by category
- [ ] Calendar export (iCal, PDF)
- [ ] Timezone support

---

**Last Updated:** May 4, 2026  
**Status:** ✅ Complete and Ready for Production
