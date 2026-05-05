# Documents Feature - Quick Start Deployment

## ⚡ Quick Setup (5 minutes)

### 1. Create Database Table (1 min)
```sql
CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `file_url` VARCHAR(500) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50),
  `file_size` INT,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_display_order (display_order),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

**Action**: Run this in your database manager (phpMyAdmin, MySQL Workbench, etc.)

---

### 2. Create Upload Directory (30 sec)
```bash
mkdir -p php-api/uploads/documents/
chmod 755 php-api/uploads/documents/
```

**Action**: Run these commands on your server via SSH/Terminal

---

### 3. Deploy Backend Files (1 min)
Copy these 4 files to `php-api/endpoints/`:
- ✅ `admin_documents.php` - Admin upload/fetch endpoint
- ✅ `admin_documents_update.php` - Admin update endpoint
- ✅ `admin_documents_delete.php` - Admin delete endpoint
- ✅ `documents.php` - Public fetch endpoint

**Action**: Upload files via FTP or copy to server

---

### 4. Deploy Frontend Files (1 min)
Copy these 2 new files:
- ✅ `frontend/src/pages/admin/AdminDocuments.tsx`
- ✅ `frontend/src/components/DocumentsSection.tsx`

Update these 2 existing files:
- ✅ `frontend/src/pages/admin/AdminDashboard.tsx` (added Documents import and tab)
- ✅ `frontend/src/pages/What_We_Do.tsx` (added DocumentsSection import)

**Action**: Replace files in your frontend folder

---

### 5. Build & Deploy Frontend (1 min)
```bash
cd frontend
npm run build
# Deploy dist folder to your web server
```

**Action**: Run build command and deploy

---

## ✅ Verification Checklist

After deployment, verify everything works:

1. **Database Check**
   - [ ] Table exists in database

2. **Admin Panel Check**
   - [ ] Log in to admin
   - [ ] See "📁 Documents" tab in sidebar
   - [ ] Can upload a test PDF
   - [ ] Can view uploaded documents in list

3. **User Page Check**
   - [ ] Go to "What We Do" page
   - [ ] Scroll down and see "Documents" section
   - [ ] See uploaded documents
   - [ ] Can click "View" to open PDF
   - [ ] Can click "Download" to download file

4. **Mobile Check**
   - [ ] Documents section looks good on mobile
   - [ ] Buttons are clickable and accessible

---

## 🎯 First Test Steps

### Admin Upload Test
1. Go to Admin Dashboard → Documents
2. Fill in:
   - Title: "Test Document"
   - Description: "This is a test"
   - Order: 0
   - File: Any PDF file
3. Click "Upload Document"
4. Should see success message and file in list

### User View Test
1. Go to Home page
2. Click "What We Do" in navigation
3. Scroll down to "Documents" section
4. Should see the test document
5. Try both "View" and "Download" buttons

---

## 🔧 Troubleshooting Quick Fixes

### Documents not showing on user page?
- [ ] Check Admin panel - are documents uploaded?
- [ ] Check browser console for errors
- [ ] Hard refresh the page (Ctrl+Shift+R)

### Upload button not working?
- [ ] Check upload directory permissions (should be 755)
- [ ] Check PHP error logs
- [ ] Verify file is under 10MB

### Can't see admin tab?
- [ ] Rebuild frontend: `npm run build`
- [ ] Clear browser cache
- [ ] Check browser console for errors

---

## 📁 File Structure

```
project/
├── php-api/
│   ├── endpoints/
│   │   ├── admin_documents.php ✨ NEW
│   │   ├── admin_documents_update.php ✨ NEW
│   │   ├── admin_documents_delete.php ✨ NEW
│   │   └── documents.php ✨ NEW
│   ├── uploads/
│   │   └── documents/ ✨ NEW (needs to be created)
│   └── config.php
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDocuments.tsx ✨ NEW
│   │   │   │   └── AdminDashboard.tsx ✏️ UPDATED
│   │   │   └── What_We_Do.tsx ✏️ UPDATED
│   │   └── components/
│   │       └── DocumentsSection.tsx ✨ NEW
│   └── package.json
└── database-schema.sql (optional - add for reference)
```

---

## 🎨 Feature Summary

### What Users See
- 📋 New "Documents" section on "What We Do" page
- 🔽 Grid layout of available documents
- 👁️ View button to open PDF in new tab
- ⬇️ Download button to save file locally
- 📊 File type, size, and description visible

### What Admins Can Do
- 📤 Upload new documents (PDF, DOC, DOCX, XLS, XLSX, TXT)
- ✏️ Edit document title and description
- 🔢 Set display order (lower number = appears first)
- 🗑️ Delete documents
- 📝 Add optional descriptions
- 📊 See file size and type

---

## 🚀 Success Indicators

Feature is working correctly when:
- ✅ Admin can upload files without errors
- ✅ Documents appear instantly after upload
- ✅ Users see documents on "What We Do" page
- ✅ Download/View buttons work properly
- ✅ No console errors
- ✅ Mobile layout looks good

---

**Ready to deploy?** Follow the 5-step process above and verify with the checklist!

For detailed documentation, see `DOCUMENTS_FEATURE_GUIDE.md`
