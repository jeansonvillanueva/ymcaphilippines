# Facilities Table Migration - New Format

## Current Problem
The old `facilities` table has predefined columns for each facility type (buildings, room_accommodations, basketball_court, etc.), which doesn't support the new dynamic text input interface.

## Solution
Create a new `facilities_list` table to store individual facility items with flexible names and details.

## New Database Structure

### Replace Old Facilities Table with New One

```sql
-- Drop old facilities table (backup first!)
DROP TABLE IF EXISTS `facilities`;

-- Create new facilities_list table with flexible structure
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

-- Keep existing facilities_images table (no changes needed)
-- The images table remains the same and continues to store slideshow images
```

## Data Format Changes

### Frontend Data Format (AdminFacilities.tsx)
```typescript
// Sends array of facilities to backend:
interface FacilityItem {
  id?: number | string;
  name?: string;
  details?: string;
}

// When saving:
{
  facilities: [
    { id: 1, name: "Main Building", details: "3-story modern facility" },
    { id: 2, name: "Swimming Pool", details: "Olympic-sized pool" }
  ]
}
```

### Backend Storage
```sql
-- facilities_list table stores individual items:
| id | local_id | facility_name    | facility_details          | sequence_order | created_at |
|----|----------|------------------|---------------------------|---|-----------|
| 1  | manila   | Main Building    | 3-story modern facility   | 0 | ...       |
| 2  | manila   | Swimming Pool    | Olympic-sized pool        | 1 | ...       |
```

### User Display Format (FacilitiesSlideshow.tsx)
```json
{
  "allFacilities": [
    { "name": "Main Building", "details": "3-story modern facility" },
    { "name": "Swimming Pool", "details": "Olympic-sized pool" }
  ],
  "images": [...]
}
```

## Implementation Steps

1. ✅ Create new `facilities_list` table
2. ✅ Update `/admin/facilities/:localId` (GET) endpoint
3. ✅ Update `/admin/facilities/:localId` (POST) endpoint  
4. ✅ Update `/api/facilities/:localId` (GET) endpoint
5. ✅ Frontend already supports new format

## Migration Notes

- Old predefined facility types (Buildings, Room Accommodations, etc.) are no longer used
- Each YMCA local can now have unlimited facilities
- Facilities can have any name and optional details
- Images are still stored in `facilities_images` table
- Backward compatibility not maintained (intentional redesign)
