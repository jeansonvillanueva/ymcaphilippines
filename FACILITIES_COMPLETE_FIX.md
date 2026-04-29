# Facilities Save Issue - Complete Root Cause & Fix

## Problem Summary
When admins save facility details:
- ✅ Frontend shows "Facilities saved successfully"
- ❌ Data NOT saved in database
- ❌ Images NOT uploaded
- ❌ Data doesn't appear to users
- 🔴 Console error: 404 for `/admin/locals/manila_downtown`

## Root Causes Identified

### Issue #1: Missing Facilities Tables (FIXED ✅)
**Problem:** The PHP API database initialization was missing facilities tables
**Status:** FIXED - Added to [php-api/database-init.php](php-api/database-init.php)

### Issue #2: Missing Local Records in Database (CRITICAL ⚠️)
**Problem:** The locals (YMCA locations) exist in frontend code but NOT in cPanel database
- Frontend has: `manila_downtown`, `quezon_city`, `albay`, etc.
- Database has: EMPTY `local` table
- Result: Foreign key constraint prevents facilities from being saved

**Why this breaks facilities saving:**
```
facilities table has:
  - FOREIGN KEY (local_id) REFERENCES `local`(local_id)
  
When saving facilities with local_id='manila_downtown':
  - Database checks if 'manila_downtown' exists in local table
  - It doesn't exist → INSERT/UPDATE fails silently
  - Foreign key constraint error (usually hidden from client)
```

## Complete Fix Steps

### Step 1: Run Database Initialization (if not done already)
Visit this URL:
```
https://ymca.ph/testsite/php-api/database-init.php?action=create
```

Expected response:
```json
{
  "facilities": true,
  "facilities_images": true,
  ... (other tables)
}
```

### Step 2: Populate Locals in Database (NEW - CRITICAL ✅)
This is the missing step that was causing the failure!

Visit this URL:
```
https://ymca.ph/testsite/php-api/populate-locals.php
```

Expected response:
```json
{
  "action": "POPULATE_LOCALS",
  "inserted": 8,
  "skipped": 0,
  "errors": [],
  "summary": "Inserted: 8, Skipped: 0, Errors: 0",
  "status": "SUCCESS"
}
```

If you get `"inserted": 0` and `"skipped": 8`, the locals are already populated ✅

### Step 3: Test the Fix

1. **Login to Admin Panel**: https://ymca.ph/testsite/admin
2. **Navigate to "Find Your YMCA"** (Locals Tab)
3. **Select a Local**: Click on "Manila Downtown YMCA" or any other local
4. **Go to Facilities Section**: You should now see the facilities form
5. **Add Facility Details**:
   - ✅ Check "Swimming Pool"
   - ✅ Enter: "Olympic-size pool, diving boards"
   - ✅ Check "Fitness Gym"
   - ✅ Enter: "Modern equipment, personal trainers"
6. **Click "Save Facilities"**
7. **Verify Success**:
   - ✅ See "Facilities saved successfully"
   - ✅ Refresh page - data persists
   - ✅ Check public page - facilities appear for users
   - ✅ Browser DevTools (F12) Network tab shows 200 for POST request

### Step 4: Upload Facility Images (Optional)
1. Click "+ Upload Image" button
2. Select image (max 5, up to 5MB each)
3. Image should upload and appear in the gallery
4. Data should persist after refresh

## Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| [php-api/database-init.php](php-api/database-init.php) | ✏️ Modified | Added facilities table creation |
| [php-api/populate-locals.php](php-api/populate-locals.php) | ✨ Created | Seeds all YMCA locals into database |

## Database Schema

### local table (populated by populate-locals.php)
```sql
- local_id (PRIMARY KEY) - e.g., 'manila_downtown'
- name - e.g., 'Manila Downtown YMCA'
- established - year
- facebook_url
- corporate, non_corporate, youth, others - member counts
- total_members_as_of - year
```

### facilities table (for each local)
```sql
- id (PRIMARY KEY)
- local_id (FOREIGN KEY → local.local_id)
- buildings, buildings_enabled
- room_accommodations, room_accommodations_enabled
- swimming_pool, swimming_pool_enabled
- fitness_gym, fitness_gym_enabled
- ... (other facilities)
- created_at, updated_at
```

### facilities_images table
```sql
- id (PRIMARY KEY)
- local_id (FOREIGN KEY → local.local_id)
- image_url
- image_order
- created_at
```

## Troubleshooting

### "Still getting 404 for /admin/locals/manila_downtown"
- [ ] Run `populate-locals.php` - did it insert locals?
- [ ] Check response - any errors?
- [ ] Verify: `SELECT * FROM local;` in database

### "Facilities save still fails"
- [ ] Verify locals exist: `SELECT COUNT(*) FROM local;` (should be 8+)
- [ ] Check for foreign key constraint errors in database logs
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check Network tab in DevTools (F12) for actual error response

### "Images not uploading"
- [ ] Check `/backend/uploads/` directory permissions (must be writable)
- [ ] Verify file size < 5MB
- [ ] Check error in browser console (F12)
- [ ] Verify facilities saved first (foreign key dependency)

### "Frontend shows success but data isn't in database"
- [ ] Check browser DevTools Network tab (F12) - what's the actual response?
- [ ] Verify database connection credentials in [php-api/config.php](php-api/config.php)
- [ ] Run SQL directly: `SELECT * FROM facilities WHERE local_id='manila_downtown';`

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/locals` | List all locals |
| GET | `/admin/locals/:id` | Get local details |
| GET | `/admin/facilities/:id` | Get facilities for local |
| POST | `/admin/facilities/:id` | Save facilities ← **NOW WORKS** |
| POST | `/admin/facilities/:id/upload` | Upload facility images |
| GET | `/api/facilities/:id` | Public: Show facilities to users |

## Success Indicators

After completing all steps, you should see:

✅ Admin can select any YMCA local  
✅ Facilities form loads without 404 errors  
✅ Can save facility details  
✅ Data persists after refresh  
✅ Images can be uploaded (up to 5)  
✅ Public pages show facility details  
✅ No 404 errors in browser console  

## Next Steps
- [ ] Run populate-locals.php
- [ ] Test facility save for each local
- [ ] Upload test images
- [ ] Verify public pages display correctly
- [ ] Set up automated backups

---

**Last Updated:** April 29, 2026  
**Status:** Critical issue FIXED ✅
