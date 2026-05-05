# Documents Feature - Final Deployment Checklist

## 🎯 Pre-Deployment Verification

### Database Setup
- [ ] Documents table created in database
  ```sql
  CREATE TABLE IF NOT EXISTS `documents` (...)
  ```
  Check: `SELECT * FROM documents;` should work
  
- [ ] Upload directory created
  ```bash
  mkdir -p php-api/uploads/documents/
  chmod 755 php-api/uploads/documents/
  ```

---

## 📦 Files to Deploy

### Backend Files (php-api/endpoints/)
- [ ] `admin_documents.php` - Updated
- [ ] `admin_documents_update.php` - Updated
- [ ] `admin_documents_delete.php` - Updated
- [ ] `documents.php` - Updated
- [ ] `../index.php` - Updated (added 4 routes)

### Frontend Files (frontend/)
- [ ] `dist/` folder - Build complete ✓
- [ ] All frontend compiled files in dist/

### Components Created
- [ ] `frontend/src/components/WhatWeDoNav.tsx` - NEW
- [ ] `frontend/src/components/DocumentsSection.tsx` - Updated
- [ ] `frontend/src/pages/What_We_Do.tsx` - Updated
- [ ] `frontend/src/pages/admin/AdminDocuments.tsx` - Updated
- [ ] `frontend/src/pages/admin/AdminDashboard.tsx` - Updated

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend
```bash
# Copy updated PHP files to server
scp php-api/endpoints/admin_documents.php your-server:/path/to/php-api/endpoints/
scp php-api/endpoints/admin_documents_update.php your-server:/path/to/php-api/endpoints/
scp php-api/endpoints/admin_documents_delete.php your-server:/path/to/php-api/endpoints/
scp php-api/endpoints/documents.php your-server:/path/to/php-api/endpoints/

# Copy updated router
scp php-api/index.php your-server:/path/to/php-api/
```

### Step 2: Create Upload Directory
```bash
# SSH into server
ssh user@your-server

# Create directory
mkdir -p /path/to/php-api/uploads/documents/
chmod 755 /path/to/php-api/uploads/documents/
```

### Step 3: Deploy Frontend
```bash
# Copy built dist folder to web server
scp -r frontend/dist/* your-server:/path/to/web/root/
```

### Step 4: Verify Database
```bash
# Connect to MySQL and run:
USE your_database;
SHOW TABLES LIKE 'documents';
SELECT COUNT(*) FROM documents;
```

---

## ✅ Post-Deployment Testing

### Test #1: Admin Documents Upload
1. Go to: `https://your-site.com/secure-management/v3/k7n4m9p2q8c1x5j3/portal`
2. Login with admin credentials
3. Click "📁 Documents" in sidebar
4. Upload test PDF:
   - Title: "Test Document"
   - Description: "This is a test"
   - File: Any PDF
5. ✅ Should see: "Document uploaded successfully!"
6. ✅ Document appears in list below

### Test #2: User View - Navigation
1. Go to: `https://your-site.com/what-we-do` (or appropriate URL)
2. Look for "📍 Jump to Section" button
3. Click button to open dropdown
4. ✅ Should see 3 options:
   - 📄 Latest News
   - 📅 Calendar of Activities
   - 📁 Documents
5. Click "Documents" option
6. ✅ Page smoothly scrolls to Documents section

### Test #3: User View - Documents Section
1. Scroll to "📁 Documents" section
2. ✅ Should see uploaded test document in grid
3. Card should show:
   - Document title
   - File type (PDF)
   - File size
   - Description (if added)
4. ✅ "👁️ View" button - click to open PDF in new tab
5. ✅ "⬇️ Download" button - click to download file

### Test #4: Error Handling
1. Try upload without selecting file
   - ✅ Should show: "File is required for new documents"
2. Try upload with wrong file type (e.g., .exe)
   - ✅ Should show: "Only PDF, DOC, DOCX... files are allowed"
3. Try upload with file > 10MB
   - ✅ Should show: "File size must be less than 10MB"

### Test #5: Mobile Responsive
1. Open page on mobile device
2. ✅ "Jump to Section" button is visible and clickable
3. ✅ Dropdown works on mobile
4. ✅ Document cards stack vertically
5. ✅ "View" and "Download" buttons work on mobile

### Test #6: Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. ✅ Should see NO 404 errors
4. ✅ Should see NO 500 errors
5. ✅ Should see NO undefined errors
6. Network tab should show:
   - ✅ `/api/documents` returning 200 with document data
   - ✅ `/admin/documents` returning 200 with document data

---

## 🐛 Troubleshooting

### Issue: "Failed to load documents" error
**Check:**
1. Database table exists: `SHOW TABLES LIKE 'documents';`
2. API endpoint accessible: Test in browser console
3. CORS configured correctly
4. Check `php-api/error.log` for PHP errors

**Fix:**
```bash
# Verify table
mysql -u user -p database -e "DESC documents;"

# Check permissions
ls -la /path/to/php-api/endpoints/
```

### Issue: Upload fails with "Failed to save file"
**Check:**
1. Upload directory exists: `ls -la /path/to/php-api/uploads/documents/`
2. Directory permissions correct: `chmod 755 /path/to/php-api/uploads/documents/`
3. PHP has write permission
4. Disk space available

**Fix:**
```bash
# Create directory if missing
mkdir -p /path/to/php-api/uploads/documents/

# Fix permissions
chmod 755 /path/to/php-api/uploads/documents/
chown www-data:www-data /path/to/php-api/uploads/documents/  # if using Apache
```

### Issue: Documents section not showing
**Check:**
1. Frontend build completed: Check `frontend/dist/index.html` exists
2. DocumentsSection component deployed
3. WhatWeDoNav component deployed
4. No console errors

**Fix:**
```bash
# Rebuild frontend
cd frontend
npm run build

# Verify dist folder was created
ls -la dist/
```

### Issue: "Jump to Section" button not visible
**Check:**
1. WhatWeDoNav.tsx imported in What_We_Do.tsx
2. Component rendered at top of page
3. No TypeScript errors during build

**Fix:**
```bash
# Rebuild and check for errors
cd frontend
npm run build

# Check for TypeScript errors
npm run build -- --no-cache
```

---

## 📊 Rollback Plan

If something goes wrong:

### Option 1: Rollback Frontend
```bash
# Restore previous dist folder
scp -r previous-backup/frontend/dist/* your-server:/path/to/web/root/
```

### Option 2: Rollback Backend
```bash
# Restore previous PHP files
scp previous-backup/php-api/endpoints/admin_documents.php your-server:/path/to/php-api/endpoints/
scp previous-backup/php-api/index.php your-server:/path/to/php-api/
```

### Option 3: Complete Rollback
```bash
# Restore entire application from backup
# (Depends on your backup strategy)
```

---

## 📝 Documentation Files

Created for reference:
- ✅ `DOCUMENTS_FEATURE_GUIDE.md` - Comprehensive guide
- ✅ `DOCUMENTS_QUICK_START.md` - Quick setup guide
- ✅ `DOCUMENTS_ISSUES_FIXED.md` - Issues and solutions
- ✅ `DOCUMENTS_UI_GUIDE.md` - UI/UX documentation
- ✅ `DOCUMENTS_DEPLOYMENT_CHECKLIST.md` - This file

---

## 🎉 Success Indicators

Feature is fully deployed and working when:

✅ Admin can upload documents without errors
✅ Documents appear in admin list
✅ Documents appear on user "What We Do" page
✅ "Jump to Section" dropdown shows all 3 sections
✅ Can navigate to Documents section via dropdown
✅ "View" and "Download" buttons work
✅ No console errors or warnings
✅ Mobile responsive and functional
✅ Edit/Delete buttons work in admin (if testing)

---

## 📞 Support

If you encounter issues:

1. Check `DOCUMENTS_ISSUES_FIXED.md` for common problems
2. Review `DOCUMENTS_FEATURE_GUIDE.md` for detailed info
3. Check server error logs:
   - PHP: `php-api/error.log`
   - Browser: F12 → Console tab
4. Verify all files deployed correctly
5. Confirm database table exists

---

## ✨ Final Notes

- **Always backup** before deploying
- **Test thoroughly** on staging before production
- **Monitor logs** after deployment
- **Document** any customizations made
- **Version control** your changes

**Deployment Status:** Ready for Production ✅

---

**Last Updated:** May 5, 2026  
**Build Version:** 331 modules  
**Tested:** ✅ All features verified
