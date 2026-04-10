# Photo Upload Implementation for Meet Our Family Page

## Overview
Implemented a complete photo upload feature for the "Meet Our Family" (staff) section on the About Us page. Users can now upload staff photos directly through the admin panel, and these photos are displayed on the public website.

## Changes Made

### 1. Backend Updates (`backend/index.js`)
- **Modified `/admin/staff` POST endpoint** to handle file uploads using multer
  - Added `upload.single('photo')` middleware
  - Processes uploaded files and stores them in the `/uploads` directory
  - Returns the file path as `imageUrl` in the response
  
- **Modified `/admin/staff` PUT endpoint** to handle file uploads for staff updates
  - Added `upload.single('photo')` middleware to allow photo updates
  - Maintains the option to use `imageUrl` if no file is provided

### 2. Frontend Admin Panel Updates (`frontend/src/pages/admin/AdminStaff.tsx`)
- **Added file upload input**
  - File input field with image validation
  - File preview display showing the selected/current photo
  
- **Added state management**
  - `photoFile`: Stores the currently selected file
  - `photoPreview`: Stores the preview URL for the image
  - `fileInputRef`: Reference to the file input element
  
- **Updated form submission**
  - Uses `FormData` when a file is selected
  - Sends multipart/form-data requests when uploading
  - Falls back to text URL input if no file is selected
  
- **UI Improvements**
  - Photo preview with max dimensions (200x200px)
  - Option to use URL or upload file
  - Clear form reset functionality
  - Edit mode shows current photo preview

### 3. Frontend User Page Updates (`frontend/src/pages/About_Us.tsx`)
- **Added dynamic staff fetching**
  - Calls `/admin/staff` API endpoint on component mount
  - Fetches staff data with uploaded photos
  
- **Added org structure transformation**
  - Converts flat staff list from API into hierarchical organization structure
  - Groups staff by department (`departmentGroup`)
  - Maintains proper hierarchy display
  
- **Added loading state**
  - Shows "Loading staff members..." while fetching data
  - Falls back to static structure if API fails
  
- **Fallback mechanism**
  - Keeps static staff data as fallback for backup/offline scenarios
  - Gracefully handles API errors

## File Structure
```
backend/
  uploads/          # Directory where uploaded photos are stored
  index.js          # Updated staff endpoints

frontend/
  src/
    pages/
      About_Us.tsx              # Updated to fetch staff from API
      admin/
        AdminStaff.tsx          # Updated with file upload
```

## API Endpoints

### Get Staff
- **GET** `/admin/staff`
- Returns all staff members with their photos

### Add Staff with Photo
- **POST** `/admin/staff`
- Accepts multipart/form-data with:
  - `name` (required)
  - `position` (required)
  - `departmentGroup` (optional)
  - `sequenceOrder` (optional)
  - `photo` (file) - optional
  - `imageUrl` (URL string) - optional

### Update Staff with Photo
- **PUT** `/admin/staff/:id`
- Accepts multipart/form-data with same fields as POST
- Can update photo, text URL, or both

## How to Use

### Uploading Staff Photos (Admin)
1. Navigate to Admin Dashboard
2. Go to "Manage Meet Our Family (Staff)" section
3. Fill in name and position
4. Choose optional department and display order
5. Click "Upload Photo" and select an image file
6. Photo preview will appear
7. Click "Add Staff" button
8. Photo is uploaded and staff member is added

### Updating Staff Photos (Admin)
1. In the Staff Directory, click "Edit" on a staff member
2. Replace the selected file or update the URL
3. Click "Update Staff" to save changes

### Viewing Staff Photos (User Side)
1. Navigate to About Us page
2. Scroll to "Meet Our Family" section
3. All uploaded staff photos are displayed in the organizational chart
4. Photos are fetched from the database and displayed dynamically

## Technical Details

### File Upload Flow
1. User selects file in admin form
2. File preview is generated using FileReader
3. On submit, FormData is created with file and staff data
4. Backend receives multipart/form-data request
5. Multer processes file and saves to `/uploads` directory
6. Database stores the file path as `imageUrl`
7. Frontend fetches staff data and displays with photo URLs

### Image Handling
- **Supported formats**: Any image format (checked via mimetype)
- **Max file size**: 5MB (configurable in multer settings)
- **Default fallback**: YMCA logo shown if no photo provided
- **URL support**: Can also use external URLs instead of uploading

## Future Enhancements
- Image compression for faster loading
- Drag-and-drop file upload
- Image crop/resize functionality
- Batch photo upload
- Photo gallery view for staff details
