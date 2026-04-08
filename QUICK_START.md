# Quick Start Guide - Admin Panel

## ⚡ Get Started in 5 Minutes

### Prerequisites
- ✅ MySQL server running
- ✅ Backend Node.js server
- ✅ Frontend development server

### Step 1: Verify Backend is Running
```bash
cd backend
npm install  # if not already installed
npm start
```
Expected output:
```
Connected to MySQL
Feedback table exists or was created successfully
Server is running on port 3000
```

### Step 2: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
Expected output:
```
Local: http://localhost:5173/
```

### Step 3: Access Admin Panel
Navigate to: **http://localhost:5173/testsite/admin**

*Note: Your site is configured with base path `/testsite/`*

## 📝 Quick Tasks

### Add Your First Video
1. Click **YMCA Videos** tab
2. Enter:
   - Title: `My First Video`
   - YouTube URL: `https://youtu.be/KfGMl7ov2x8`
3. Click **Add Video**
4. ✅ Done! Video appears in the list

### Add Your First News Article
1. Click **Latest News** tab
2. Enter:
   - Title: `My News Article`
   - Path: `/news/Article_Test`
   - Category: Select from dropdown
   - Topic: Select from dropdown
3. Click **Add News**
4. ✅ Done!

### Add Your First Event
1. Click **Calendar Events** tab
2. Enter:
   - Title: `My Event`
   - Date: Pick a date
   - Description: Event details
3. Click **Add Event**
4. ✅ Done!

### Update Local YMCA Stats
1. Click **Find Your YMCA** tab
2. Select a local from dropdown
3. Update member counts:
   - Corporate Members: 150
   - Non-Corporate: 200
   - Youth: 300
   - Others: 50
4. Click **Update Local Information**
5. ✅ Done!

### Add Staff Member
1. Click **Meet Our Family** tab
2. Enter:
   - Name: `John Doe`
   - Position: `Staff Name`
   - Department: Select from dropdown
   - Photo URL: Image link
3. Click **Add Staff**
4. ✅ Done!

## 🔧 Configuration

### Database Connection
If MySQL is not on `localhost:3000`, update `backend/db.js`:

```javascript
const db = mysql.createConnection({
  host: 'YOUR_HOST',
  user: 'YOUR_USER',
  password: 'YOUR_PASSWORD',
  database: 'yphilippines'
});
```

### API URL
If backend is on different port, update API URLs in:
- `frontend/src/pages/admin/AdminVideos.tsx`
- `frontend/src/pages/admin/AdminNews.tsx`
- `frontend/src/pages/admin/AdminCalendar.tsx`
- `frontend/src/pages/admin/AdminLocals.tsx`
- `frontend/src/pages/admin/AdminStaff.tsx`
- `frontend/src/hooks/useApi.ts`

Change:
```typescript
const API_URL = 'http://localhost:3000/admin/...';
// to
const API_URL = 'http://YOUR_HOST:PORT/admin/...';
```

## 📊 Database Check

To verify tables were created:

```bash
# Connect to MySQL
mysql -u root

# Select database
use yphilippines;

# List all tables
SHOW TABLES;
```

Expected tables:
- ✅ videos
- ✅ news
- ✅ calendar_events
- ✅ locals
- ✅ pillars
- ✅ pillar_programs
- ✅ staff

## 🚀 Next: Frontend Migration

To make the website display admin-managed content:

1. Open `frontend/src/pages/Home.tsx`
2. Replace hardcoded `YOUTUBE_VIDEOS` with API call
3. See **MIGRATION_GUIDE.md** for detailed examples
4. Repeat for other pages

Example:
```typescript
// Before
import { YOUTUBE_VIDEOS } from '../data/videos';

// After
import { useVideos } from '../hooks/useApi';

function Home() {
  const { videos } = useVideos();
  // Use videos from API
}
```

## ❓ Troubleshooting

### "Failed to connect to backend"
- ✅ Is backend server running? (`npm start` in backend folder)
- ✅ Is it on port 3000? (check `backend/index.js`)
- ✅ CORS enabled? (already in place, no changes needed)

### "Tables not created"
- ✅ MySQL is running?
- ✅ Database `yphilippines` exists?
- ✅ Check backend console for errors
- ✅ Try refreshing the browser and checking console

### "Images not loading"
- ✅ Use full URLs (https://...)
- ✅ Not relative paths
- ✅ Check image URL is accessible in browser

### Admin page styling looks wrong
- ✅ Clear browser cache (Ctrl+Shift+Delete)
- ✅ Restart dev server
- ✅ Check browser console for CSS errors

## 📚 Learn More

- **Admin Setup**: See `ADMIN_SETUP.md`
- **Migration Examples**: See `MIGRATION_GUIDE.md`
- **Database Schema**: See `ADMIN_SETUP.md` - Database Tables section

## 💡 Tips

1. **Images**: Use external URLs (AWS S3, Cloudinary, etc.)
2. **Drafts**: Delete and re-add if you need to start over
3. **Bulk Upload**: Add items one by one through the form
4. **Backup**: Export your MySQL data periodically

## 🎉 You're Ready!

Your admin panel is fully functional and connected to the database.

**Next Step**: Connect your website pages to use this admin data!

---

**Having issues?** Check the browser console (F12) and backend logs for error messages.
