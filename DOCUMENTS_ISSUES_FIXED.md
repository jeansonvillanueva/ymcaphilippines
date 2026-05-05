# Documents Feature - Issues Fixed

## Summary of Problems & Solutions

### Issue #1: 404 Error - Routes Not Found
**Problem**: Frontend was getting 404 errors when calling `/admin/documents` endpoints
```
Failed to load resource: the server responded with a status of 404 (Not Found)
```

**Root Cause**: The new documents endpoints weren't registered in the PHP router (`php-api/index.php`)

**Solution**: 
- Added public route: `/api/documents` (GET)
- Added admin routes: `/admin/documents` (GET, POST)
- Added admin routes: `/admin/documents/{id}` (PUT, DELETE)

**File Changed**: `php-api/index.php`
```php
// Added after public calendar endpoint:
case '/api/documents':
    if ($requestMethod === 'GET') {
        require_once 'endpoints/documents.php';
    }
    break;

// Added after facilities routes:
case '/n2r8k5j9m1/documents':
case '/admin/documents':
    if ($requestMethod === 'GET') {
        require_once 'endpoints/admin_documents.php';
    } elseif ($requestMethod === 'POST') {
        require_once 'endpoints/admin_documents.php';
    }
    break;

case (preg_match('/^(\/n2r8k5j9m1\/documents\/(\d+)|\/admin\/documents\/(\d+))$/', $path, $matches) ? true : false):
    $_GET['id'] = $matches[2] ?? $matches[3];
    if ($requestMethod === 'PUT') {
        require_once 'endpoints/admin_documents_update.php';
    } elseif ($requestMethod === 'DELETE') {
        require_once 'endpoints/admin_documents_delete.php';
    }
    break;
```

---

### Issue #2: Incorrect API URLs in Frontend
**Problem**: Frontend component was using wrong URL patterns
```javascript
// WRONG:
await axios.put(`${API_URL}_update.php?id=${editingId}`, ...)
await axios.delete(`${API_URL}_delete.php?id=${id}`, ...)
```

**Root Cause**: Old endpoint pattern didn't match the router's RESTful structure

**Solution**: Updated to use proper REST path format
```javascript
// CORRECT:
await axios.put(`${API_URL}/${editingId}`, ...)
await axios.delete(`${API_URL}/${id}`, ...)
```

**Files Changed**: 
- `frontend/src/pages/admin/AdminDocuments.tsx`
  - Line 102: Changed PUT URL from `${API_URL}_update.php?id=${editingId}` to `${API_URL}/${editingId}`
  - Line 155: Changed DELETE URL from `${API_URL}_delete.php?id=${id}` to `${API_URL}/${id}`

---

### Issue #3: PHP Endpoints Not Compatible with Router
**Problem**: PHP endpoint files were written as standalone scripts with their own header/auth logic

**Root Cause**: They weren't following the pattern used by the router's include system

**Solution**: Removed duplicate headers and auth checks, made files compatible with router includes

**Files Updated**:

#### `php-api/endpoints/admin_documents.php`
- Removed: `header()`, database connection includes, auth checks
- These are already handled by `index.php` before including the file
- File now focuses only on the business logic

#### `php-api/endpoints/admin_documents_update.php`
- Updated to use `getPostData()` helper function
- Updated to use `$_GET['id']` set by router
- Removed duplicate headers/auth

#### `php-api/endpoints/admin_documents_delete.php`
- Updated to use `$_GET['id']` set by router
- Removed duplicate headers/auth

#### `php-api/endpoints/documents.php`
- Removed duplicate headers
- Removed method check (router ensures only GET reaches this)

---

## Testing Checklist

✅ **To verify the fixes are working:**

1. **Admin Panel Access**
   - [ ] Login to admin dashboard
   - [ ] Check sidebar for "📁 Documents" tab
   - [ ] Tab should be visible and clickable

2. **Document Upload**
   - [ ] Click "Documents" in admin sidebar
   - [ ] Fill in title: "Test Document"
   - [ ] Select a PDF/DOC file
   - [ ] Click "Upload Document"
   - [ ] Should see success message (not "Failed to load documents")

3. **Document Display**
   - [ ] Document should appear in the list below
   - [ ] File name, type, and size should be visible

4. **User View**
   - [ ] Go to "What We Do" page
   - [ ] Scroll down to see "📁 Documents" section
   - [ ] Uploaded documents should display in grid
   - [ ] "View" and "Download" buttons should work

5. **Browser Console**
   - [ ] Open Developer Tools (F12)
   - [ ] Go to Console tab
   - [ ] Should see NO 404 errors
   - [ ] Should see NO "Failed to load documents" errors

---

## Files Changed Summary

| File | Change | Reason |
|------|--------|--------|
| `php-api/index.php` | Added 4 route cases for documents | Enable routing to documents endpoints |
| `frontend/src/pages/admin/AdminDocuments.tsx` | Updated API URLs to use `/id` instead of `_method.php?id=` | Match router's RESTful pattern |
| `php-api/endpoints/admin_documents.php` | Removed headers/auth, use router's context | Compatible with router includes |
| `php-api/endpoints/admin_documents_update.php` | Use `getPostData()`, `$_GET['id']` | Compatible with router includes |
| `php-api/endpoints/admin_documents_delete.php` | Use `$_GET['id']` from router | Compatible with router includes |
| `php-api/endpoints/documents.php` | Removed duplicate headers | Compatible with router includes |

---

## How the Flow Works Now

### User Upload Flow:
```
1. Admin fills form in AdminDocuments.tsx
2. Frontend sends: POST to `${ADMIN_API_URL}/documents` (with file)
3. Router matches: `/admin/documents` (POST)
4. Includes: `php-api/endpoints/admin_documents.php`
5. File processes: upload, database insert
6. Response sent to frontend
```

### Document Fetch Flow (Admin):
```
1. AdminDocuments.tsx calls: GET `${ADMIN_API_URL}/documents`
2. Router matches: `/admin/documents` (GET)
3. Includes: `php-api/endpoints/admin_documents.php`
4. Returns: JSON list of all documents
```

### Document Fetch Flow (Public):
```
1. DocumentsSection.tsx calls: GET `${PUBLIC_API_URL}/documents`
2. Router matches: `/api/documents` (GET)
3. Includes: `php-api/endpoints/documents.php`
4. Returns: JSON list of all documents
```

---

## Build Status
✅ Frontend rebuilt successfully
✅ All routing configured
✅ All files updated

**Ready to Test!** 🚀
