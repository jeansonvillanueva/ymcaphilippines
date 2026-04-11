# cPanel Upload Troubleshooting Guide

## Issue: 503 Service Unavailable Errors

The 503 errors indicate your files are not accessible. This usually means:

### 1. Files Not Uploaded Correctly
- Check if files are in the right directories
- Verify file permissions (755 for folders, 644 for files)

### 2. Domain Not Pointing to cPanel
- Your domain might not be properly configured
- DNS might not have propagated yet

### 3. cPanel Account Issues
- Account might be suspended or limited
- Storage quota exceeded

## Step-by-Step Fix

### Step 1: Verify File Upload
1. Go to **cPanel → File Manager**
2. Check `public_html/` directory
3. Ensure these exist:
   ```
   public_html/
   ├── index.html (React app)
   ├── assets/ (React assets)
   ├── php-api/
   │   ├── index.php
   │   ├── config.php
   │   └── endpoints/
   ├── backend/
   │   └── uploads/
   └── cPanel-test.html
   ```

### Step 2: Check File Permissions
In File Manager:
1. Right-click each folder → **Change Permissions**
2. Set folders to: **755**
3. Set files to: **644**
4. Special: `backend/uploads/` → **755** (writable)

### Step 3: Verify Domain Configuration
1. Go to **cPanel → Domains → Addon Domains**
2. Ensure your domain is listed and active
3. Check **DNS Zone Editor** for correct records

### Step 4: Test Basic Connectivity
1. Visit: `http://yourdomain.com/cPanel-test.html`
2. If this works, domain is configured
3. If not, check domain settings

### Step 5: Re-upload Files
If files are missing:
1. Use **cPanel → File Manager** to upload
2. Or use **FTP** (credentials in cPanel → FTP Accounts)
3. Upload in batches if large files

### Step 6: Check cPanel Status
1. Go to **cPanel → Server Information**
2. Check if account is active
3. Verify storage usage

## Alternative Upload Methods

### Method 1: cPanel File Manager
1. **cPanel → File Manager**
2. Navigate to `public_html/`
3. Click **Upload** button
4. Select files/folders to upload

### Method 2: FTP Upload
1. **cPanel → FTP Accounts**
2. Create FTP account
3. Use FTP client (FileZilla) to upload
4. Host: yourdomain.com
5. Username: ftp@yourdomain.com
6. Password: (from FTP account)

### Method 3: SSH/SCP (if enabled)
```bash
scp -r php-api/ user@yourdomain.com:public_html/
scp -r frontend/dist/* user@yourdomain.com:public_html/
```

## Quick Test Commands

After uploading, test these URLs:

1. **Basic HTML:** `https://yourdomain.com/cPanel-test.html`
2. **React App:** `https://yourdomain.com`
3. **API Test:** `https://yourdomain.com/php-api/test-db`

## If Still Not Working

### Check Error Logs
1. **cPanel → Metrics → Errors**
2. Look for PHP/Apache errors

### Contact Hosting Support
If all else fails:
1. Contact your hosting provider
2. Explain the 503 errors
3. Ask them to check server configuration

## Expected File Structure

After correct upload, your `public_html/` should look like:

```
public_html/
├── index.html                    # React main file
├── asset-manifest.json          # React manifest
├── cPanel-test.html             # Test file
├── .htaccess                    # Apache config
├── assets/                      # React assets
│   ├── index-*.css
│   ├── index-*.js
│   └── static/
├── php-api/                     # PHP backend
│   ├── index.php
│   ├── config.php
│   ├── utils.php
│   └── endpoints/
│       ├── test_db.php
│       └── ... (other endpoints)
├── backend/                     # Uploads directory
│   └── uploads/
└── favicon.ico                  # Site icon
```

## Success Indicators

✅ **cPanel-test.html loads** → Files are accessible  
✅ **React app loads** → Frontend deployed  
✅ **API endpoints work** → Backend connected  
✅ **No 503 errors** → Server configuration correct  

Try re-uploading the files and check permissions. The 503 errors usually resolve with correct file uploads and permissions.