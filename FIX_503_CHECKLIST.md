# 🚨 503 Error Fix Checklist

## Immediate Actions (Do These First)

### 1. ✅ Verify Domain Points to cPanel
- [ ] Go to your domain registrar (GoDaddy, Namecheap, etc.)
- [ ] Check DNS settings point to your cPanel nameservers
- [ ] Wait 24-48 hours for DNS propagation if changed recently

### 2. ✅ Check cPanel Account Status
- [ ] Login to cPanel dashboard
- [ ] Check if account shows "Active" status
- [ ] Verify storage usage isn't at limit
- [ ] Check for any suspension notices

### 3. ✅ Verify File Upload
- [ ] Go to **cPanel → File Manager**
- [ ] Navigate to `public_html/`
- [ ] Confirm these files exist:
  - [ ] `index.html` (React app)
  - [ ] `assets/` folder
  - [ ] `php-api/` folder
  - [ ] `backend/uploads/` folder
  - [ ] `cPanel-test.html`

### 4. ✅ Fix File Permissions
For each item in File Manager:
- [ ] Right-click → **Change Permissions**
- [ ] Set folders to: `755`
- [ ] Set files to: `644`
- [ ] Special: `backend/uploads/` → `755` (writable)

### 5. ✅ Test Basic Connectivity
- [ ] Visit: `http://yourdomain.com/cPanel-test.html`
- [ ] If this loads → Domain is configured
- [ ] If not → Domain/DNS issue

## If Files Are Missing

### Upload Method 1: cPanel File Manager
1. **cPanel → File Manager → public_html**
2. Click **Upload** button
3. Upload files in batches:
   - First: `cPanel-test.html`
   - Then: React `dist/` contents
   - Then: `php-api/` folder
   - Finally: create `backend/uploads/`

### Upload Method 2: FTP
1. **cPanel → FTP Accounts**
2. Create FTP account
3. Use FileZilla or similar FTP client
4. Upload to `public_html/`

## Test After Each Step

After completing each section above, test:

1. **Basic HTML:** `https://yourdomain.com/cPanel-test.html`
2. **React App:** `https://yourdomain.com`
3. **API:** `https://yourdomain.com/php-api/test-db`

## Expected Results

### ✅ SUCCESS (All Working)
- cPanel-test.html loads
- React app displays
- API returns "Database is working!"

### ⚠️ PARTIAL SUCCESS
- cPanel-test.html loads but others don't → File permission issue
- Some files load but not others → Missing files or .htaccess issue

### ❌ FAILURE (Nothing Works)
- Even cPanel-test.html doesn't load → Domain/DNS/cPanel issue

## Emergency Troubleshooting

### If Nothing Loads
1. Contact your hosting provider
2. Ask: "Why am I getting 503 errors?"
3. Request they check server configuration

### If Domain Issues
1. Use cPanel's temporary URL: `https://cpanel-server.com/~username/`
2. Test if files work there
3. If yes → Domain DNS issue
4. If no → File/cPanel configuration issue

### Quick Domain Test
1. Go to **cPanel → Domains → Addon Domains**
2. Check if your domain is listed
3. If not → Add it
4. If listed but not working → DNS issue

## Success Checklist

- [ ] Domain accessible
- [ ] cPanel-test.html loads
- [ ] React app displays
- [ ] API endpoints work
- [ ] No 503 errors
- [ ] Images can upload
- [ ] Admin panel works

## Need Help?

Run the diagnostic tool: `https://yourdomain.com/diagnose-cpanel.html`

It will tell you exactly what's working and what's not.