# Facilities Information - Database Setup Guide

## Problem
The **Facility Information form** in the admin panel is not persisting data because the required database tables (`facilities` and `facilities_images`) are missing from your MySQL database.

When you input facility details, you see the message: *"Loaded default values from local data. Save to create this local record."* But the data doesn't save because there's no table to store it.

## Root Cause
- The `facilities` table was defined in the Node.js backend initialization script (`backend/database-init.js`) but **was never created in the actual database**
- The table definitions were missing from the complete `database-schema.sql` file
- The PHP API endpoints were expecting these tables to exist

## Solution: Create the Missing Tables

You have **3 options** to fix this:

### Option 1: Using PHPMyAdmin (Easiest - Recommended for cPanel)

1. **Log in to PHPMyAdmin** through your cPanel
   - Go to cPanel → Databases → PHPMyAdmin
   - Or navigate to: `https://yourdomain.com/cpanel/phpmyadmin`

2. **Select your database** (e.g., `ymcaphil_testdb`)

3. **Click "SQL" tab** at the top

4. **Copy and paste** the following SQL code:

```sql
-- Create facilities table for YMCA facilities per local
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `local_id` varchar(100) NOT NULL,
  `buildings` varchar(255) DEFAULT NULL,
  `buildings_pillar_id` int DEFAULT NULL,
  `room_accommodations` varchar(255) DEFAULT NULL,
  `room_accommodations_pillar_id` int DEFAULT NULL,
  `basketball_court` varchar(255) DEFAULT NULL,
  `basketball_court_pillar_id` int DEFAULT NULL,
  `swimming_pool` varchar(255) DEFAULT NULL,
  `swimming_pool_pillar_id` int DEFAULT NULL,
  `fitness_gym` varchar(255) DEFAULT NULL,
  `fitness_gym_pillar_id` int DEFAULT NULL,
  `function_hall` varchar(255) DEFAULT NULL,
  `function_hall_pillar_id` int DEFAULT NULL,
  `badminton_court` varchar(255) DEFAULT NULL,
  `badminton_court_pillar_id` int DEFAULT NULL,
  `tennis_court` varchar(255) DEFAULT NULL,
  `tennis_court_pillar_id` int DEFAULT NULL,
  `martial_arts` varchar(255) DEFAULT NULL,
  `martial_arts_pillar_id` int DEFAULT NULL,
  `spaces` varchar(255) DEFAULT NULL,
  `spaces_pillar_id` int DEFAULT NULL,
  `other_facilities` varchar(255) DEFAULT NULL,
  `other_facilities_pillar_id` int DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_local_facilities (local_id),
  INDEX idx_local_id (local_id),
  CONSTRAINT fk_facilities_local FOREIGN KEY (local_id) REFERENCES `local`(local_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create facilities_images table
CREATE TABLE IF NOT EXISTS `facilities_images` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `local_id` varchar(100) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `image_order` int DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_local_id (local_id),
  CONSTRAINT fk_facilities_images_local FOREIGN KEY (local_id) REFERENCES `local`(local_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

5. **Click "Go"** to execute the SQL

6. ✅ **Success!** You should see confirmation that the tables were created

### Option 2: Using PHP Setup Script (Quick)

1. **Upload the setup script** to your server
   - File: [php-api/setup-facilities.php](php-api/setup-facilities.php)
   - Upload to: `https://yourdomain.com/testsite/php-api/setup-facilities.php`

2. **Visit the setup URL** in your browser:
   ```
   https://yourdomain.com/testsite/php-api/setup-facilities.php
   ```

3. ✅ The script will create the tables and return a JSON response with status

### Option 3: Using MySQL Command Line

If you have SSH access to your server:

```bash
# Connect to MySQL
mysql -u your_username -p your_database_name

# Paste the SQL code from Option 1 above
# Then press Enter
```

## After Creating the Tables

### 1. Verify the Tables Were Created
- In PHPMyAdmin, refresh the database view
- You should see `facilities` and `facilities_images` in your table list

### 2. Test the Admin Form
1. Log in to the admin panel: `https://yourdomain.com/testsite/admin`
2. Go to "Find Your YMCA" tab
3. Select a local from the dropdown
4. Scroll down to "Facility Information"
5. Fill in some facility details (e.g., "Main Building - 5 floors")
6. Select a pillar for that facility (Community, Work, Planet, or World)
7. Click "Save"
8. The data should now persist! ✅

### 3. View on User Side
1. Go to "Where We Are" page: `https://yourdomain.com/testsite/where-we-are`
2. Click on a local YMCA
3. Scroll down to the four pillars section
4. You should now see the facilities listed under their respective pillars

## Table Structure Explained

### `facilities` Table
Stores facility information for each local YMCA with 11 facility types:
- Buildings
- Room Accommodations
- Basketball Court
- Swimming Pool
- Fitness Gym
- Function Hall
- Badminton Court
- Tennis Court
- Martial Arts
- Spaces
- Other Facilities

Each facility can have:
- **Description** (varchar 255) - Details about the facility
- **Pillar Assignment** (int) - Which pillar this facility belongs to (Community, Work, Planet, World)

### `facilities_images` Table
Stores images associated with facilities for a local:
- `image_url` - URL to the uploaded image
- `image_order` - Display order of images
- Maximum 5 images per local

## Column Details

### facilities Table Columns
| Column | Type | Purpose |
|--------|------|---------|
| `id` | INT | Primary key (auto-increment) |
| `local_id` | VARCHAR(100) | Foreign key to `local` table |
| `[facility]` | VARCHAR(255) | Facility description (e.g., buildings) |
| `[facility]_pillar_id` | INT | Pillar assignment for that facility |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |

### facilities_images Table Columns
| Column | Type | Purpose |
|--------|------|---------|
| `id` | INT | Primary key (auto-increment) |
| `local_id` | VARCHAR(100) | Foreign key to `local` table |
| `image_url` | VARCHAR(500) | URL to facility image |
| `image_order` | INT | Display order (0 = first) |
| `created_at` | TIMESTAMP | Upload time |

## Files Modified/Created

### 1. ✅ Database Schema Updated
- **File**: [database-schema.sql](database-schema.sql)
- **Change**: Added `facilities` and `facilities_images` table definitions

### 2. ✅ Migration File Created
- **File**: [ADD_FACILITIES_TABLES.sql](ADD_FACILITIES_TABLES.sql)
- **Purpose**: Ready-to-run SQL migration

### 3. ✅ PHP Setup Script Created
- **File**: [php-api/setup-facilities.php](php-api/setup-facilities.php)
- **Purpose**: One-click table creation (option 2 above)

## Troubleshooting

### Issue: "Table 'local' doesn't exist" Error
**Solution**: Make sure the `local` table exists first. It should have been created when you set up locals.

### Issue: "Foreign key constraint" Error
**Solution**: 
- Ensure the `local` table exists
- Ensure your database engine is InnoDB (supports foreign keys)
- Try Option 2 (PHPMyAdmin) instead of command line

### Issue: Still Can't Save Facility Data
1. Check that both `facilities` and `facilities_images` tables exist in PHPMyAdmin
2. Clear your browser cache
3. Log out and log back into the admin panel
4. Try again

### Issue: Can't Access Setup Script
- Make sure the file is uploaded to the correct path
- Check file permissions (should be readable)
- Try Option 1 (PHPMyAdmin) instead

## API Endpoints (Now Working)

After creating the tables, these endpoints will work:

### Get Facilities for a Local
```
GET /admin/facilities/{localId}
```
Returns: facility details + images + pillars for that local

### Save/Update Facilities
```
POST /admin/facilities/{localId}
Body: { buildings: "description", buildings_pillar_id: 1, ... }
```

### Upload Facility Images
```
POST /admin/facilities/{localId}/upload
Body: FormData with image file
```

### Delete Facility Image
```
DELETE /admin/facilities/{localId}/images/{imageId}
```

## Next Steps

1. ✅ Create the tables using one of the options above
2. ✅ Test the admin form by adding some facility data
3. ✅ Verify the data appears on the public "Where We Are" page
4. ✅ Upload facility images if desired

## Questions?

If you need help:
- Check the [FACILITY_PILLAR_IMPLEMENTATION.md](FACILITY_PILLAR_IMPLEMENTATION.md) for implementation details
- Review the [ADMIN_SETUP.md](ADMIN_SETUP.md) for general admin panel documentation
