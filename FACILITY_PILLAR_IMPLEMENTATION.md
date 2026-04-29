# Facility Information by Pillars Implementation

## Overview
This implementation updates the Facility Information system to:
1. **Show facilities even without details** - Display all facilities with checkboxes indicating availability
2. **Organize facilities by pillars** - Group facilities under the 4 pillars of the local (Community, Work, Planet, World)
3. **Admin control** - Allow admins to assign each facility type to a pillar
4. **User-friendly display** - Show organized facilities under respective pillars on the user side

## Database Changes

### Schema Updates
Added `*_pillar_id` columns to the `facilities` table for each facility type:
- `buildings_pillar_id`
- `room_accommodations_pillar_id`
- `basketball_court_pillar_id`
- `swimming_pool_pillar_id`
- `fitness_gym_pillar_id`
- `function_hall_pillar_id`
- `badminton_court_pillar_id`
- `tennis_court_pillar_id`
- `martial_arts_pillar_id`
- `spaces_pillar_id`
- `other_facilities_pillar_id`

These columns store the `pillars_id` from the `local_pillars` table to link facilities to pillars.

### File: `backend/database-init.js`
- Updated `facilitiesTableSql` to include pillar ID columns
- Added `ensureFacilitiesColumn()` function to handle migration of existing databases
- Updated `addForeignKeyConstraints()` to ensure all pillar_id columns exist

## API Endpoints

### File: `php-api/endpoints/admin_facilities.php`
**Changed:** GET `/admin/facilities/:localId`

**Response now includes:**
```json
{
  "facilities": {
    "buildings": "Building description",
    "buildings_pillar_id": 1,
    // ... more facilities and pillar assignments
  },
  "images": [...],
  "pillars": [
    {
      "id": 1,
      "key": "community",
      "label": "Community",
      "color": "#hex"
    }
  ]
}
```

### File: `php-api/endpoints/admin_facilities_create.php`
**Changed:** POST `/admin/facilities/:localId`

**Request payload now supports:**
```json
{
  "buildings": "Description",
  "buildings_pillar_id": 1,
  // ... more fields with pillar assignments
}
```

**Response includes:**
- facilities (with pillar assignments)
- images
- pillars (available for this local)

### File: `php-api/endpoints/facilities.php`
**Changed:** GET `/api/facilities/:localId` (public endpoint)

**Response structure changed to:**
```json
{
  "facilitiesByPillar": [
    {
      "pillarId": 1,
      "pillarKey": "community",
      "pillarLabel": "Community",
      "pillarColor": "#hex",
      "facilities": [
        {
          "key": "buildings",
          "label": "Buildings",
          "value": "Description or empty string",
          "hasDetails": true,
          "pillarId": 1
        }
      ]
    }
  ],
  "allFacilities": [...],
  "images": [...],
  "pillars": [...]
}
```

**Key changes:**
- All facilities are returned (even without details)
- `hasDetails` flag indicates if facility has description
- Facilities organized by pillar in `facilitiesByPillar`
- Fallback to `allFacilities` if no pillar assignments exist

## Frontend Components

### File: `frontend/src/pages/admin/AdminFacilities.tsx`
**Changes:**
- Added state for `pillars` to fetch available pillars
- Each facility field now shows a dropdown to assign it to a pillar
- Pillar badges display color-coded information
- Visual feedback showing which pillar a facility is assigned to
- Maintains backward compatibility with existing functionality

**UI Improvements:**
- Pillar selector dropdown for each facility
- Color-coded pillar badges
- Assignment status display
- Better visual organization

### File: `frontend/src/pages/admin/AdminFacilities.css`
**New styles added:**
- `.admin-facilities-pillars-info` - Display available pillars
- `.admin-facilities-pillar-badge` - Colored pillar badges
- `.admin-facilities-field-group` - Group input and pillar selector
- `.admin-facilities-pillar-select` - Dropdown styling
- `.admin-facilities-pillar-assigned` - Assignment status indicator
- `.admin-facilities-pillar-mini-badge` - Mini badge for assigned pillar
- Responsive design for mobile devices

### File: `frontend/src/components/FacilitiesSlideshow.tsx`
**Major changes:**
- Renamed `facilities` to `allFacilities` and added `facilitiesByPillar`
- Added `pillars` state to store available pillars
- Facilities organized under their assigned pillars
- Checkboxes display for all facilities (read-only)
- Fallback to list view if no pillar assignments exist
- Handles all facilities including those without details

**User-facing features:**
- Pillar sections with color-coded headers
- Facilities grouped under pillars
- Checkboxes indicate availability
- Details shown when available
- Image slideshow at top
- Responsive grid layout

### File: `frontend/src/components/FacilitiesSlideshow.css`
**New styles:**
- `.facilities-slideshow-image-section` - Wrapper for slideshow
- `.facilities-by-pillar` - Container for pillar-organized facilities
- `.facilities-pillar-grid` - Responsive grid for pillar sections
- `.facilities-pillar-section` - Individual pillar card
- `.facilities-pillar-header` - Color-coded header
- `.facilities-item` - Facility item with checkbox
- `.facilities-checkbox` - Styled checkbox input
- `.facilities-item-label` - Facility name
- `.facilities-item-details` - Facility description
- Responsive design for mobile (single column on small screens)

## Usage Guide

### For Admin Users

1. **Access Facilities Management**
   - Go to Admin > Edit Local > Manage Facilities
   - All 11 facility types will be displayed

2. **Add/Edit Facility Information**
   - Enter details for each facility type
   - Details are optional - leave blank if facility doesn't exist

3. **Assign Facilities to Pillars**
   - For each facility with details, select the appropriate pillar
   - Available pillars are shown at the top (Community, Work, Planet, World)
   - Color-coded indicators show assignments

4. **Upload Facility Images**
   - Upload up to 5 images
   - Images are displayed in a slideshow on user side
   - Apply to all facilities collectively (not per facility type)

5. **Save Changes**
   - Click "Save Facilities" to persist all changes
   - Changes are immediately reflected on user-facing pages

### For Users

1. **View Facilities**
   - On the local YMCA page, scroll to "Facilities" section
   - Images appear at the top in a slideshow (if available)

2. **Facilities Organized by Pillar**
   - Facilities are displayed under their assigned pillar
   - Each pillar is color-coded for easy identification
   - Checkboxes indicate facility availability

3. **View Details**
   - Facility descriptions appear under the name
   - Details were uploaded by the admin for that facility

4. **Navigation**
   - Use slideshow controls (arrow buttons) to browse images
   - Click indicator dots to jump to specific image
   - Facilities are automatically organized by pillar

## Backward Compatibility

- Existing facility data is preserved
- New pillar_id columns are added via migration
- If no pillar assignments exist, facilities display in fallback list format
- All existing functionality continues to work

## Migration Path for Existing Installations

1. **Database Update:**
   - Run `npm run build` in backend to trigger database initialization
   - New columns will be automatically added to existing `facilities` tables

2. **No Data Loss:**
   - All existing facility descriptions are preserved
   - Pillar assignments start as empty (NULL)

3. **Next Steps:**
   - Admins need to assign facilities to pillars
   - Re-upload facility images if desired

## Technical Details

### Pillar Assignment Logic
- Each facility type can be assigned to at most one pillar
- NULL pillar_id means facility is not assigned to any pillar
- Unassigned facilities with details still display in the system

### Data Structure
```
Facility Type → Pillar ID (1-4) or NULL
  buildings → 1 (Community Pillar)
  basketball_court → 2 (Work Pillar)
  etc.
```

### Pillar Colors
- Predefined in database per local
- Automatically applied to UI elements
- Configurable through admin pillar settings

## Future Enhancements

Potential improvements:
- Drag-and-drop reordering of facilities
- Per-facility image uploads
- Facility category management
- Facility search/filter
- Facility ratings or reviews

---

**Implementation Date:** April 28, 2026
**Status:** Complete and Ready for Testing
