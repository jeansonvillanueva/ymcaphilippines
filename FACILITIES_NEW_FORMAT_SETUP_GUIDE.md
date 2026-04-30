# New Facilities Database & API Setup Guide

## Overview
The facilities system has been restructured to support the new dynamic text-input interface in the admin panel. Instead of predefined facility types, admins can now add unlimited facilities with custom names and optional details.

## What Changed

### Old System (Deprecated)
- Fixed facility types: Buildings, Room Accommodations, Basketball Court, etc.
- Boolean checkboxes for each type
- Single record per local with many columns

### New System
- Flexible facility list
- Any facility name/details
- Multiple records per local
- Array-based data structure

## Installation Steps

### 1. Update Database Schema

Run this SQL in PHPMyAdmin or terminal:

```sql
-- Step 1: Backup old data (optional)
CREATE TABLE `facilities_backup` AS SELECT * FROM `facilities`;

-- Step 2: Drop old table
DROP TABLE IF EXISTS `facilities`;

-- Step 3: Create new table
CREATE TABLE IF NOT EXISTS `facilities_list` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `local_id` VARCHAR(100) NOT NULL,
  `facility_name` VARCHAR(255) NOT NULL,
  `facility_details` TEXT,
  `sequence_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_local_id (local_id),
  INDEX idx_sequence (local_id, sequence_order),
  CONSTRAINT fk_facilities_list_local FOREIGN KEY (local_id) REFERENCES `local`(local_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

Or copy the SQL from `php-api/migrate-facilities.sql` and run it directly.

### 2. Update PHP API Endpoints

**Replace these files:**
- `php-api/endpoints/admin_facilities.php` → Use `admin_facilities_new.php`
- `php-api/endpoints/admin_facilities_create.php` → Use `admin_facilities_create_new.php`
- `php-api/endpoints/facilities.php` → Use `facilities_new.php`

**How to update:**
```bash
# Backup originals first
mv php-api/endpoints/admin_facilities.php php-api/endpoints/admin_facilities.php.bak
mv php-api/endpoints/admin_facilities_create.php php-api/endpoints/admin_facilities_create.php.bak
mv php-api/endpoints/facilities.php php-api/endpoints/facilities.php.bak

# Copy new versions
cp php-api/endpoints/admin_facilities_new.php php-api/endpoints/admin_facilities.php
cp php-api/endpoints/admin_facilities_create_new.php php-api/endpoints/admin_facilities_create.php
cp php-api/endpoints/facilities_new.php php-api/endpoints/facilities.php
```

### 3. Verify Frontend Components

The frontend components are already updated:
- ✅ `AdminFacilities.tsx` - Uses new array format
- ✅ `FacilitiesSlideshow.tsx` - Updated to use `name` and `details` fields

No additional frontend changes needed.

## API Data Formats

### Admin GET - Fetch Facilities
```
GET /admin/facilities/{localId}

Response:
{
  "facilities": [
    {
      "id": 1,
      "name": "Main Building",
      "details": "3-story modern facility with 10 classrooms",
      "sequenceOrder": 0
    },
    {
      "id": 2,
      "name": "Swimming Pool",
      "details": "Olympic-sized pool",
      "sequenceOrder": 1
    }
  ],
  "images": [...]
}
```

### Admin POST - Save Facilities
```
POST /admin/facilities/{localId}

Request Body:
{
  "facilities": [
    {
      "name": "Main Building",
      "details": "3-story modern facility"
    },
    {
      "name": "Swimming Pool",
      "details": "Olympic-sized pool"
    }
  ]
}

Response:
{
  "message": "Facilities saved successfully",
  "facilities": [...],
  "images": [...]
}
```

### Public GET - Fetch for Display
```
GET /api/facilities/{localId}

Response:
{
  "allFacilities": [
    {
      "name": "Main Building",
      "details": "3-story modern facility",
      "isEnabled": true
    },
    {
      "name": "Swimming Pool",
      "details": "Olympic-sized pool",
      "isEnabled": true
    }
  ],
  "images": [...]
}
```

## Testing

### Admin Side
1. Go to Admin Panel → Find Your YMCA
2. Select a local YMCA
3. Scroll to "Manage Facilities"
4. Add facilities with names and optional details
5. Click "Save Facilities"
6. Verify data persists after refresh

### User Side
1. Go to "Where We Are" page
2. Click on a local YMCA
3. Scroll down to "Available Facilities" section
4. Verify facilities display as bullet list with names and optional details

### Database Verification
```sql
-- Check if new table exists
SELECT * FROM facilities_list;

-- Check for a specific local
SELECT * FROM facilities_list WHERE local_id = 'manila' ORDER BY sequence_order;

-- Count facilities per local
SELECT local_id, COUNT(*) as facility_count FROM facilities_list GROUP BY local_id;
```

## Troubleshooting

### Error: "facilities_list" table doesn't exist
- Run the migration SQL from Step 1
- Verify foreign key constraints are set up correctly

### Admin form shows empty facilities
- Ensure database migration is complete
- Check `/admin/facilities/{localId}` API endpoint
- Verify `facilities_list` table has data

### User side doesn't show facilities
- Check `/api/facilities/{localId}` endpoint
- Verify `facilities_images` table relationship is correct
- Check browser console for API errors

### Images not showing
- `facilities_images` table structure unchanged
- Verify image_order sequence is correct
- Check file paths in database

## Migration from Old Format

If you have data in the old `facilities_backup` table, you can migrate it:

```sql
-- Example: Convert Buildings with details to new format
INSERT INTO facilities_list (local_id, facility_name, facility_details, sequence_order)
SELECT local_id, 'Buildings', buildings, 0 
FROM facilities_backup 
WHERE buildings IS NOT NULL AND buildings != '';

-- Continue for other facility types as needed
INSERT INTO facilities_list (local_id, facility_name, facility_details, sequence_order)
SELECT local_id, 'Swimming Pool', swimming_pool, 1
FROM facilities_backup
WHERE swimming_pool IS NOT NULL AND swimming_pool != '';
```

## Files Involved

### Database
- `php-api/migrate-facilities.sql` - SQL migration script

### API Endpoints
- `php-api/endpoints/admin_facilities_new.php` - GET facilities (admin)
- `php-api/endpoints/admin_facilities_create_new.php` - POST facilities (admin)
- `php-api/endpoints/facilities_new.php` - GET facilities (public)

### Frontend
- `frontend/src/pages/admin/AdminFacilities.tsx` - Admin form (already updated)
- `frontend/src/components/FacilitiesSlideshow.tsx` - User display (already updated)

### Documentation
- `FACILITIES_NEW_FORMAT_MIGRATION.md` - Overview of changes
- This file - Complete setup guide

## Support

For issues or questions about the new facilities system, check:
1. Browser console for API errors
2. Database structure with migration SQL
3. API endpoint responses in Network tab
4. Component props in React DevTools
