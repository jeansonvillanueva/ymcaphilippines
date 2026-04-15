# cPanel Deployment Issues - Diagnostics & Fixes

## Current Problem Summary

1. **Admin Updates Show Success But Don't Save**: Frontend displays "Local updated successfully" but database shows no changes
2. **503 Errors on Image Uploads**: `/uploads/` files fail to load with 503 Service Unavailable
3. **Zero Content for Users**: Database appears empty or unreachable

---

## Root Causes Identified

### Issue #1: False Positive Update Success
**File**: `php-api/endpoints/admin_locals_update.php` (Line 56-58)

The code returns success even when zero rows are affected:
```php
if ($affectedRows === 0) {
    sendResponse(['message' => 'Local updated successfully', 'warning' => 'No rows were changed'], 200);
}
```

**Why it happens**: Either:
- Local ID in database doesn't exist
- Database column names don't match PHP code
- Database connection pointing to wrong database
- SQL query has syntax errors

### Issue #2: 503 Upload Path Errors
**File**: `php-api/utils.php` (Line 58-61)

```php
function getUploadBasePath() {
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $phpApiPath = dirname($scriptName);
    if ($phpApiPath === '/' || $phpApiPath === '\\') {
        return '';
    }
    return rtrim($phpApiPath, '/');
}
```

On cPanel at `https://ymca.ph/testsite/php-api/`, this returns wrong path:
- `$_SERVER['SCRIPT_NAME']` = `/testsite/php-api/index.php`
- `dirname()` = `/testsite/php-api`
- Returns: `/testsite/php-api` 
- But uploads are at: `/testsite/backend/uploads/`

So image URL becomes: `/testsite/php-api/uploads/` instead of `/testsite/uploads/`

---

## Step-by-Step Fixes

### Fix #1: Add Verbose Logging to Identify DB Issues

Edit `php-api/endpoints/admin_locals_update.php`:

```php
<?php
// PUT /admin/locals/:id
$data = getPostData();
$id = $conn->real_escape_string($_GET['id']);

// DIAGNOSTIC LOGGING
error_log("[LOCALS_UPDATE] ===== START UPDATE REQUEST =====");
error_log("[LOCALS_UPDATE] Local ID: " . $id);
error_log("[LOCALS_UPDATE] POST Data: " . json_encode($data, JSON_UNESCAPED_SLASHES));
error_log("[LOCALS_UPDATE] DB Host: " . getenv('DB_HOST') ?? 'localhost');
error_log("[LOCALS_UPDATE] DB Name: " . getenv('DB_NAME') ?? 'ymcaph_db');

// Test database connection
if ($conn->connect_error) {
    error_log("[LOCALS_UPDATE] **CONNECTION ERROR**: " . $conn->connect_error);
    sendResponse(['error' => 'Database connection failed: ' . $conn->connect_error], 500);
}

// Check if local exists
$checkSql = "SELECT * FROM `local` WHERE local_id = '$id' LIMIT 1";
error_log("[LOCALS_UPDATE] Checking local existence: $checkSql");
$checkResult = $conn->query($checkSql);

if (!$checkResult) {
    error_log("[LOCALS_UPDATE] **QUERY ERROR**: " . $conn->error);
    sendResponse(['error' => 'Database error: ' . $conn->error], 500);
}

if ($checkResult->num_rows === 0) {
    error_log("[LOCALS_UPDATE] **NOT FOUND**: No local with ID=$id in database");
    sendResponse(['error' => 'Local with ID "' . $id . '" not found'], 404);
}

$existing = $checkResult->fetch_assoc();
error_log("[LOCALS_UPDATE] Found existing record: " . json_encode($existing));

// Rest of update code...
```

### Fix #2: Correct Upload Path Calculation

Edit `php-api/utils.php`, replace the `getUploadBasePath()` function:

```php
function getUploadBasePath() {
    // On cPanel with structure: /testsite/php-api/
    // We need to return path that reaches /testsite/uploads/
    
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    error_log('[getUploadBasePath] SCRIPT_NAME: ' . $scriptName);
    
    // Extract the base path before /php-api/
    // Example: /testsite/php-api/index.php -> /testsite
    $basePath = preg_replace('#/php-api/.*$#', '', $scriptName);
    
    error_log('[getUploadBasePath] Calculated base path: ' . $basePath);
    
    if (empty($basePath) || $basePath === '/' || $basePath === '\\') {
        return '';
    }
    
    return rtrim($basePath, '/');
}
```

### Fix #3: Create Diagnostic Script

Create `php-api/diagnose.php`:

```php
<?php
require_once 'config.php';

header('Content-Type: application/json');

$diagnostics = [
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'database' => [
        'host' => 'localhost',
        'user' => 'ymcaph_user',
        'database' => 'ymcaph_db',
        'connected' => false,
        'error' => null,
        'tables' => [],
    ],
    'directories' => [
        'uploads' => [
            'path' => __DIR__ . '/../backend/uploads/',
            'exists' => false,
            'writable' => false,
            'files' => [],
        ],
    ],
    'server' => [
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'N/A',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
    ],
];

// Test database connection
if ($conn->connect_error) {
    $diagnostics['database']['error'] = $conn->connect_error;
} else {
    $diagnostics['database']['connected'] = true;
    
    // Get tables
    $result = $conn->query("SHOW TABLES");
    if ($result) {
        while ($row = $result->fetch_row()) {
            $diagnostics['database']['tables'][] = $row[0];
        }
    }
    
    // Check if 'local' table exists and has records
    $localResult = $conn->query("SELECT COUNT(*) as count FROM `local`");
    if ($localResult) {
        $localCount = $localResult->fetch_assoc();
        $diagnostics['database']['local_count'] = $localCount['count'];
    }
}

// Check uploads directory
$uploadsPath = __DIR__ . '/../backend/uploads/';
$diagnostics['directories']['uploads']['exists'] = is_dir($uploadsPath);
$diagnostics['directories']['uploads']['writable'] = is_writable($uploadsPath);

if ($diagnostics['directories']['uploads']['exists']) {
    $files = glob($uploadsPath . '*');
    $diagnostics['directories']['uploads']['files'] = array_slice(array_map('basename', $files), 0, 10);
}

// Test path calculation
require_once 'utils.php';
$diagnostics['upload_path'] = getUploadBasePath();

echo json_encode($diagnostics, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
```

Access it at: `https://ymca.ph/testsite/php-api/diagnose.php`

### Fix #4: Test Database Updates Directly

Create `php-api/test-update.php`:

```php
<?php
require_once 'config.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing local ID']);
    exit;
}

$id = $conn->real_escape_string($_GET['id']);
$testName = 'TEST_UPDATE_' . date('Y-m-d H:i:s');

// Test update
$updateSql = "UPDATE `local` SET name='$testName' WHERE local_id='$id'";
error_log("[TEST_UPDATE] SQL: $updateSql");

$isSuccess = $conn->query($updateSql);
$affectedRows = $conn->affected_rows;

$response = [
    'success' => $isSuccess,
    'affected_rows' => $affectedRows,
    'sql' => $updateSql,
    'error' => $conn->error ?: null,
];

// Verify update
$verifyResult = $conn->query("SELECT name FROM `local` WHERE local_id='$id'");
if ($verifyResult) {
    $row = $verifyResult->fetch_assoc();
    $response['verify_name'] = $row['name'] ?? 'NOT FOUND';
}

header('Content-Type: application/json');
echo json_encode($response, JSON_PRETTY_PRINT);
?>
```

Access it at: `https://ymca.ph/testsite/php-api/test-update.php?id=MANILA`

---

## Troubleshooting Checklist

### ✅ Step 1: Run Diagnostics
1. Visit `https://ymca.ph/testsite/php-api/diagnose.php`
2. Check:
   - `database.connected` = true
   - `database.tables` contains `local`
   - `database.local_count` > 0
   - `directories.uploads.writable` = true

### ✅ Step 2: Test Direct Update
1. Visit `https://ymca.ph/testsite/php-api/test-update.php?id=MANILA`
2. Check response:
   - `success` = true
   - `affected_rows` = 1
   - `verify_name` starts with `TEST_UPDATE_`

### ✅ Step 3: Check Error Logs
**cPanel File Manager:**
- Go to `public_html/php-api/error.log`
- Look for [LOCALS_UPDATE] entries
- Look for database connection errors

**Terminal (if SSH access available):**
```bash
tail -50 /home/ymcaph/public_html/php-api/error.log
```

### ✅ Step 4: Verify Database Manually
**Using cPanel phpMyAdmin:**
1. Login to phpMyAdmin
2. Select `ymcaph_db` database
3. Click `local` table
4. Verify records exist (not empty)
5. Check column names match PHP code:
   - local_id
   - name
   - facebook_url (not facebookUrl)
   - instagramUrl (check exact casing)
   - etc.

### ✅ Step 5: Fix Field Name Mismatches
If you find column names don't match, edit `admin_locals_update.php`:

Look for mismatches like:
- `instagramUrl` in PHP but `instagram_url` in database
- `twitterUrl` in PHP but `twitter_url` in database

Fix by using correct column names:
```php
$sql = "UPDATE `local` SET 
    name='$name', 
    facebook_url='$facebookUrl',      // Match actual column
    instagram_url='$instagramUrl',    // Match actual column
    twitter_url='$twitterUrl'         // Match actual column
 WHERE local_id='$id'";
```

---

## Quick Deploy Fix

If you want to deploy fixes now:

1. **Add logging to update endpoint:**
   - Update `php-api/endpoints/admin_locals_update.php` with diagnostic logging

2. **Fix upload path:**
   - Update `php-api/utils.php` getUploadBasePath() function

3. **Upload diagnostic scripts:**
   - Add `php-api/diagnose.php`
   - Add `php-api/test-update.php`

4. **Test:**
   - Run `/diagnose.php` to verify setup
   - Run `/test-update.php?id=MANILA` to test updates
   - Check browser console for response

---

## Expected Results After Fixes

✅ Diagnostic script shows green on all checks  
✅ Test update script returns `affected_rows: 1`  
✅ Admin panel updates save to database  
✅ Images load without 503 errors  
✅ Zero content issue resolved  
