# Secretary Positions Feature - Implementation Guide

## Overview

This update adds support for **Department Head Positions**, allowing you to designate staff members as heads of their departments. Head positions appear first in their respective departments and are displayed with special styling in the Leadership section.

## What's New

### New Field: Head Position

A new **Head Position** dropdown has been added to the Staff admin form with the following options:

1. **SECRETARY FOR FINANCE** - Head of Finance department
2. **NATIONAL PROGRAM SECRETARY** - Head of National Programs
3. **SECRETARY FOR MEMBER ASSOCIATION** - Head of Member Association
4. **SECRETARY FOR OPERATION** - Head of Operations

## Database Changes

**New Column Added to `staff` Table:**
- `headPosition` (varchar(100)) - Stores the department head position title

**Migration SQL:**
Run the file `ADD_HEAD_POSITION_MIGRATION.sql` to add this column to your database.

## Admin Panel Usage

### Adding a Department Head

1. Navigate to **Admin > Staff Management**
2. Fill in the staff member's details:
   - **Name** - Full name (required)
   - **Position** - Job title/role (required)
   - **Department/Group** - Select the appropriate department
   - **Head Position** - Select one of the four department heads (NEW)
   - **Secretary Type** - Optional, for additional classification
   - **Display Order** - Controls position within department
   - **Photo** - Upload staff photo

3. Click "Add Staff"

### Display Behavior

- **Staff with Head Position**: Appear first in their department, followed by other staff
- **Vacant Position**: If you want to show a vacant head position, create a staff entry with:
  - Empty or placeholder name
  - The position/role name
  - The Head Position selected
  - YMCA logo will display if no image is provided

### Example: Marking Someone as Secretary for Finance Head

1. In the admin form:
   - Name: "Maria Santos"
   - Position: "Secretary for Finance"
   - Department: "Secretary for Finance"
   - **Head Position: "SECRETARY FOR FINANCE"** ← Select this
   - Upload photo
   - Click Add Staff

## Frontend Display

### Leadership Section

The "Meet Our Family" page now displays:

1. **Leadership Section** (at the top)
   - Shows all staff with Head Positions
   - Displays: Image, Name, Position, Department Head Title
   - If vacant: Shows YMCA logo, position name, and head title

2. **Organizational Chart** (below)
   - Shows full organizational hierarchy
   - Head positions appear first in each department
   - Organized by department group

### Sorting Rules

Staff are sorted within each department as follows:
1. Staff with Head Position first
2. Then other staff sorted by Display Order (sequence)

## Database Migration Steps

### Option 1: Using MySQL/phpMyAdmin

1. Open phpMyAdmin
2. Select your YMCA Philippines database
3. Go to SQL tab
4. Copy and paste the contents of `ADD_HEAD_POSITION_MIGRATION.sql`
5. Click Execute

### Option 2: Using Command Line

```bash
mysql -u [username] -p [database_name] < ADD_HEAD_POSITION_MIGRATION.sql
```

### Option 3: Using Backend Script (if configured)

Run the migration via the backend database initialization if available.

## API Endpoints Updated

### Create Staff (POST)
```
POST /admin/staff
{
  "name": "Rev. Maria Santos",
  "position": "Secretary for Finance",
  "departmentGroup": "Secretary for Finance",
  "headPosition": "SECRETARY FOR FINANCE",
  "secretaryType": "SECRETARY FOR FINANCE",
  "sequenceOrder": 1,
  "imageUrl": "..." or upload photo file
}
```

### Update Staff (PUT)
```
PUT /admin/staff/:id
{
  "name": "Rev. Maria Santos",
  "position": "Secretary for Finance",
  "departmentGroup": "Secretary for Finance",
  "headPosition": "SECRETARY FOR FINANCE",
  "secretaryType": "SECRETARY FOR FINANCE",
  "sequenceOrder": 1,
  "imageUrl": "..." or upload photo file
}
```

## Files Modified

1. **Database**
   - `database-schema.sql` - Added headPosition column definition
   - `ADD_HEAD_POSITION_MIGRATION.sql` - Migration script (new file)

2. **Backend**
   - `php-api/endpoints/admin_staff_create.php` - Added headPosition handling
   - `php-api/endpoints/admin_staff_update.php` - Added headPosition handling

3. **Frontend**
   - `frontend/src/pages/admin/AdminStaff.tsx` - Added Head Position dropdown in form
   - `frontend/src/pages/About_Us.tsx` - Updated display logic to show head positions first

## Troubleshooting

### Issue: Head Position dropdown doesn't appear in admin form

**Solution:** Ensure you've rebuilt the frontend after pulling the latest changes:
```bash
cd frontend
npm run build
```

### Issue: New staff members show but head positions aren't sorting correctly

**Solution:** Check that the `headPosition` column was properly added to the database. Verify using:
```sql
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME='staff' AND COLUMN_NAME='headPosition';
```

### Issue: Vacant positions showing as "Vacant" name instead of just logo

**Solution:** Leave the Name field empty when creating a vacant position. The system will display "Vacant" automatically.

## Backward Compatibility

This feature is fully backward compatible:
- Existing staff with `secretaryType` will continue to display in the Leadership section
- New head positions work alongside existing secretary type classifications
- All existing data is preserved

## Next Steps

1. Run the migration SQL to add the `headPosition` column
2. Rebuild the frontend (if running locally)
3. Start adding department heads through the admin panel
4. View the results on the "Meet Our Family" page

For questions or issues, refer to the admin documentation or contact support.
