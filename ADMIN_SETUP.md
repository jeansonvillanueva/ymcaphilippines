# YMCA Admin Panel Setup Guide

## Overview
This admin panel allows you to manage website content without hardcoding it. All content is stored in the MySQL database and can be edited through an easy-to-use web interface.

## What's Included

### Backend (Express.js API)
- **Database Initialization**: Automatic table creation on server startup
- **Admin Endpoints**: RESTful API for CRUD operations on all content types
- **API URL**: `http://localhost:3000/admin/*`

### Frontend (React/TypeScript)
- **Admin Dashboard**: Central hub for managing all content
- **Separate Admin Pages**: AdminVideos, AdminNews, AdminCalendar, AdminLocals, AdminStaff
- **Custom Hooks**: `useApi.ts` for fetching data from the backend
- **Admin Route**: `/admin` - accessible in the navigation

## Database Tables Created

### 1. videos
```sql
- id (INT, Primary Key)
- title (VARCHAR 255, Required)
- description (TEXT)
- embedUrl (VARCHAR 500) - YouTube embed URL
- videoUrl (VARCHAR 500) - Alternative video URL
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 2. news
```sql
- id (INT, Primary Key)
- path (VARCHAR 255, Unique) - Route path like /news/Card_One
- title (VARCHAR 255, Required)
- date (VARCHAR 100)
- subtitle (TEXT)
- imageUrl (VARCHAR 500)
- category (VARCHAR 50) - News, Articles, Features
- topic (VARCHAR 100)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 3. calendar_events
```sql
- id (INT, Primary Key)
- title (VARCHAR 255, Required)
- date (DATE, Required) - YYYY-MM-DD format
- description (TEXT)
- imageUrl (VARCHAR 500)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 4. locals (Where We Are)
```sql
- id (VARCHAR 100, Primary Key) - matches markerId (manila, baguio, etc.)
- name (VARCHAR 255, Required)
- established (VARCHAR 50)
- facebookUrl (VARCHAR 500)
- heroImageUrl (VARCHAR 500)
- logoImageUrl (VARCHAR 500)
- corporate (INT) - Member count
- nonCorporate (INT)
- youth (INT)
- others (INT)
- totalMembersAsOf (VARCHAR 50)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 5. pillars (Local Pillars)
```sql
- id (INT, Primary Key)
- localId (VARCHAR 100, Foreign Key to locals)
- key (VARCHAR 50) - Unique per local
- label (VARCHAR 255)
- color (VARCHAR 50)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 6. pillar_programs (Pillar Programs)
```sql
- id (INT, Primary Key)
- pillarId (INT, Foreign Key to pillars)
- title (VARCHAR 255)
- bullets (JSON) - Array of bullet points
- sequenceOrder (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### 7. staff (Meet Our Family)
```sql
- id (INT, Primary Key)
- name (VARCHAR 255, Required)
- position (VARCHAR 255, Required)
- imageUrl (VARCHAR 500)
- departmentGroup (VARCHAR 255) - National General Secretary, etc.
- sequenceOrder (INT) - Display order
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## API Endpoints

### Videos
- `GET /admin/videos` - Get all videos
- `POST /admin/videos` - Add new video
- `PUT /admin/videos/:id` - Update video
- `DELETE /admin/videos/:id` - Delete video

### News
- `GET /admin/news` - Get all news
- `POST /admin/news` - Add new news
- `PUT /admin/news/:id` - Update news
- `DELETE /admin/news/:id` - Delete news

### Calendar Events
- `GET /admin/calendar` - Get all events
- `POST /admin/calendar` - Add new event
- `PUT /admin/calendar/:id` - Update event
- `DELETE /admin/calendar/:id` - Delete event

### Locals
- `GET /admin/locals` - Get all locals
- `GET /admin/locals/:id` - Get specific local
- `POST /admin/locals` - Add new local
- `PUT /admin/locals/:id` - Update local

### Pillars
- `GET /admin/pillars/:localId` - Get pillars for a local
- `PUT /admin/pillars/:id` - Update pillar
- `POST /admin/pillar-programs` - Add program to pillar
- `PUT /admin/pillar-programs/:id` - Update pillar program
- `DELETE /admin/pillar-programs/:id` - Delete pillar program

### Staff
- `GET /admin/staff` - Get all staff
- `POST /admin/staff` - Add new staff
- `PUT /admin/staff/:id` - Update staff
- `DELETE /admin/staff/:id` - Delete staff

## Accessing the Admin Panel

1. **Start the backend server** (if not already running):
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Admin Panel**:
   - Navigate to `http://localhost:5173/testsite/admin` (with your base path)
   - Or navigate to just `/testsite/admin` if accessing from the same host
   - Or click the "Admin" link in the navigation

   **Note**: Your site uses base path `/testsite/` configured in `vite.config.ts`

## Using the Admin Panel

### YMCA Videos Tab
- **Add Videos**: Fill in title, description, and YouTube embed URL
- **Edit/Delete**: Click Edit to modify or Delete to remove videos
- Videos will appear on the Home page

### Latest News Tab
- **Add News**: Provide title, path (e.g., /news/Card_One), category, topic, and image
- **Filter News**: By category, topic, and archive year on the frontend
- **View News**: Filter by category (News, Articles, Features), topic, and year

### Calendar Events Tab
- **Add Events**: Title, date (YYYY-MM-DD), description, and optional image
- **View by Date**: Events are grouped by date
- **Multiple Events**: Add multiple events for the same date

### Find Your YMCA Tab
- **Select Local**: Choose from the dropdown list of all YMCA locals
- **Update Stats**: Update member counts (Corporate, Non-Corporate, Youth, Others)
- **Local Info**: Update established year, Facebook URL, hero image, and logo
- **View Table**: See overview of all locals and their member counts

### Meet Our Family Tab
- **Add Staff**: Name, position, department, photo URL, and display order
- **Organize by Department**: Staff are grouped by their department
- **Display Order**: Control the order staff members appear on the About Us page
- **Edit Photos**: Update staff photos and information anytime

## Migration: Using API Data Instead of Hardcoded Data

To migrate the frontend components to use data from the API instead of hardcoded data:

### Step 1: Import the Custom Hook
```typescript
import { useVideos, useNews, useCalendarEvents, useStaff, useLocals } from '../hooks/useApi';
```

### Step 2: Replace Hardcoded Data
**Before (Home.tsx):**
```typescript
const YOUTUBE_VIDEOS: VideoItem[] = [
  { id: 'vision2030', title: 'YMCA Vision 2030', ... },
  // ... more hardcoded videos
];
```

**After (Home.tsx):**
```typescript
import { useVideos } from '../hooks/useApi';

function Home() {
  const { videos, loading, error } = useVideos();
  
  if (loading) return <div>Loading videos...</div>;
  if (error) return <div>Error loading videos</div>;
  
  // Transform API data to match component props
  const videoItems = videos.map(v => ({
    id: v.id.toString(),
    title: v.title,
    description: v.description,
    embedUrl: v.embedUrl,
    videoUrl: v.videoUrl,
  }));
  
  return (
    <VideoShowcase heading="YMCA Videos" videos={videoItems} />
  );
}
```

### Step 3: Apply to Other Components

**What_We_Do.tsx** - For Calendar and News:
```typescript
import { useNews, useCalendarEvents } from '../hooks/useApi';

function WhatWeDo() {
  const { news, loading: newsLoading } = useNews();
  const { events, loading: eventsLoading } = useCalendarEvents();
  
  // Transform and use the data...
}
```

**About_Us.tsx** - For Staff:
```typescript
import { useStaff } from '../hooks/useApi';

function AboutUs() {
  const { staff, loading } = useStaff();
  
  // Group staff by departmentGroup and use...
}
```

**Where_We_Are.tsx** - For Locals:
```typescript
import { useLocals } from '../hooks/useApi';

function WhereWeAre() {
  const { locals, loading } = useLocals();
  
  // Use locals data for markers and details...
}
```

## Important Notes

### Database Connection
- Ensure MySQL server is running with database `yphilippines`
- Default connection: localhost, user: root, password: (empty)
- Update `backend/db.js` if your credentials differ

### Image URLs
- Store image URLs (not files) in the database
- Images should be hosted externally (AWS S3, Cloudinary, etc.)
- Update image URLs through the admin panel

### Featured News
- In the admin panel for News, the first item added becomes featured
- Featured news appears prominently on the "What We Do" page

### Backward Compatibility
- Hardcoded data files (news.ts, calendarEvents.ts, etc.) can coexist with API data
- Gradually migrate components to use API data
- Keep hardcoded data as fallback during transition

## Troubleshooting

### Admin panel not loading
- Ensure backend server is running on port 3000
- Check browser console for CORS errors
- Verify MySQL database connection

### Data not updating
- Clear browser cache
- Check browser console for API errors
- Verify database tables were created (check MySQL)

### Images not displaying
- Verify image URLs are correct and accessible
- Check if external image hosting service is working
- Use absolute URLs (https://...) not relative paths

### CORS errors
- Backend already has CORS enabled
- If custom frontend URL, may need to update CORS settings in `backend/index.js`

## Next Steps

1. ✅ Backend API endpoints are ready
2. ✅ Admin panel is ready to use
3. 📝 Migrate frontend components to use API
4. 🔒 Add authentication/authorization for admin access
5. 📝 Create content in the admin panel
6. 🚀 Deploy to production

## File Structure

```
frontend/src/
├── pages/
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── AdminDashboard.css
│       ├── AdminVideos.tsx
│       ├── AdminNews.tsx
│       ├── AdminCalendar.tsx
│       ├── AdminLocals.tsx
│       └── AdminStaff.tsx
├── hooks/
│   └── useApi.ts
└── App.tsx (updated with /admin route)

backend/
├── index.js (updated with admin routes)
├── database-init.js (new)
└── db.js
```

---

**Status**: Admin panel is fully functional and ready for use!
