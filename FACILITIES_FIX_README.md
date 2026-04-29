# Facilities Save Issue - Root Cause & Fix

## Problem
When admins save facility details, the frontend shows "Facilities saved successfully" but:
- Data is NOT saved in the cPanel database
- Data doesn't appear for users

## Root Cause
The PHP API's `database-init.php` file was missing the `facilities` and `facilities_images` table creation statements. When the admin tried to save facility data via the `/admin/facilities/:localId` POST endpoint, the database INSERT/UPDATE queries failed silently because these tables didn't exist.

## Solution Applied
Updated [php-api/database-init.php](php-api/database-init.php) to include:
1. `CREATE TABLE facilities` - stores facility details (buildings, pools, courts, etc.)
2. `CREATE TABLE facilities_images` - stores facility images

## Steps to Fix

### Step 1: Run Database Initialization
Visit this URL in your browser to create the missing tables:
```
https://ymca.ph/testsite/php-api/database-init.php?action=create
```

You should see a JSON response indicating:
- ✅ `facilities`: true
- ✅ `facilities_images`: true

If any show `false`, note the error and retry.

### Step 2: Test the Fix

1. **Login to Admin Panel**: https://ymca.ph/testsite/admin
2. **Select a Local YMCA**
3. **Go to "Facilities" Section**
4. **Add/Edit Facility Details**:
   - Check "Buildings" and add description
   - Check "Swimming Pool" and add description
   - etc.
5. **Click "Save Facilities"**

### Step 3: Verify Data Saved

- Check browser console (F12 > Network) - POST request should return 200
- Response should show: `"message": "Facilities saved successfully"`
- Refresh the page - data should persist
- Check public view - facilities should appear on the local YMCA public page

## Files Modified
- [php-api/database-init.php](php-api/database-init.php) - Added facilities table creation

## API Endpoints
- **GET** `/admin/facilities/{localId}` - Fetch facilities
- **POST** `/admin/facilities/{localId}` - Save facilities ← **This was failing**
- **GET** `/api/facilities/{localId}` - Public facilities view

## Database Tables Created
```sql
facilities
├── id (PRIMARY KEY)
├── local_id (FOREIGN KEY to local)
├── buildings, buildings_enabled
├── room_accommodations, room_accommodations_enabled
├── basketball_court, basketball_court_enabled
├── swimming_pool, swimming_pool_enabled
├── fitness_gym, fitness_gym_enabled
├── function_hall, function_hall_enabled
├── badminton_court, badminton_court_enabled
├── tennis_court, tennis_court_enabled
├── martial_arts, martial_arts_enabled
├── spaces, spaces_enabled
├── other_facilities, other_facilities_enabled
├── created_at
└── updated_at

facilities_images
├── id (PRIMARY KEY)
├── local_id (FOREIGN KEY to local)
├── image_url
├── image_order
└── created_at
```

## Troubleshooting

**Issue: Still seeing "Facilities saved successfully" but no data persists**
- Clear browser cache (Ctrl+Shift+Delete)
- Check Network tab in browser DevTools to see actual response
- Verify database tables exist: Run `database-init.php?action=create` again

**Issue: Database connection error**
- Verify credentials in [php-api/config.php](php-api/config.php)
- Check MySQL/MariaDB is running on cPanel
- Verify user `ymcaph_user` has proper permissions

**Issue: Foreign key errors**
- Ensure `local` table exists first (run database-init.php)
- Verify local_id in facilities matches an existing local YMCA

## Next Steps
- [ ] Run database-init.php to create tables
- [ ] Test saving facilities from admin panel
- [ ] Verify data appears on public YMCA page
- [ ] Upload facility images (if needed)
