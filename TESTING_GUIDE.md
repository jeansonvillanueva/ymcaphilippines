# Testing Guide: PHP API on cPanel

## Step 1: Upload Files to cPanel
1. Upload the entire `php-api/` folder to your cPanel's `public_html` directory
2. Ensure the `backend/uploads/` folder exists and is writable (permissions 755)

## Step 2: Update Frontend API URLs
Before testing, update your React frontend to point to the PHP API instead of the Node.js backend.

In your React code, change API calls from:
```javascript
fetch('/api/news')  // Node.js
```
To:
```javascript
fetch('/php-api/api/news')  // PHP API
```

## Step 3: Test Database Connection
Visit these URLs in your browser to test database connectivity:

- `https://yourdomain.com/php-api/test-db`
  - Should return: `{"message": "Database is working!"}`

- `https://yourdomain.com/php-api/test-article`
  - Should return an array of submitted articles

## Step 4: Test Public API Endpoints
Test these endpoints to ensure data is being served:

- `https://yourdomain.com/php-api/api/news` - News articles
- `https://yourdomain.com/php-api/api/locals` - YMCA locals
- `https://yourdomain.com/php-api/api/articles` - Submitted articles

## Step 5: Test Form Submissions
Test that forms can submit data to the database:

- Submit a feedback form
- Submit a donation form
- Submit an article update

Check if data appears in the admin endpoints.

## Step 6: Test Admin Functionality
Access admin endpoints to verify CRUD operations:

- `https://yourdomain.com/php-api/admin/feedback` - View feedback
- `https://yourdomain.com/php-api/admin/news` - Manage news
- `https://yourdomain.com/php-api/admin/videos` - Manage videos
- `https://yourdomain.com/php-api/admin/calendar` - Manage events

## Step 7: Test File Uploads
Test image uploads through admin interfaces:

1. Try uploading images for news articles
2. Try uploading staff photos
3. Verify files appear in `backend/uploads/` directory
4. Check that image URLs are returned correctly

## Step 8: Test Frontend Integration
1. Build and upload your React frontend to cPanel
2. Verify that pages load dynamic data instead of static content
3. Test user interactions (forms, admin panels)
4. Check browser console for any API errors

## Common Issues to Check

### Database Connection Issues
- Verify MySQL credentials in `config.php`
- Check if database exists and tables are created
- Ensure user has proper permissions

### API Routing Issues
- Confirm `.htaccess` is enabled in cPanel
- Check that `mod_rewrite` is enabled
- Verify file permissions (755 for directories, 644 for files)

### CORS Issues
- The PHP API has CORS enabled, but check cPanel settings if needed

### File Upload Issues
- Ensure `backend/uploads/` directory exists and is writable
- Check PHP upload limits in cPanel
- Verify file permissions

## Success Indicators

Your setup is working when:
- ✅ Database test endpoints return success messages
- ✅ API endpoints return JSON data from database
- ✅ Frontend loads dynamic content instead of static data
- ✅ Forms successfully submit and save to database
- ✅ Admin panels can create, read, update, delete content
- ✅ File uploads work and images display correctly
- ✅ No console errors in browser developer tools

## Debugging Tools

1. **Browser Developer Tools**: Check Network tab for API calls
2. **cPanel Error Logs**: Check PHP error logs
3. **Database Tools**: Use phpMyAdmin to verify data
4. **Test Scripts**: Use the provided test endpoints

## Quick Test Script

Create a simple HTML file to test multiple endpoints at once:

```html
<!DOCTYPE html>
<html>
<head>
    <title>API Test</title>
</head>
<body>
    <h1>API Connection Test</h1>
    <div id="results"></div>

    <script>
        const endpoints = [
            '/php-api/test-db',
            '/php-api/api/news',
            '/php-api/admin/feedback'
        ];

        const resultsDiv = document.getElementById('results');

        endpoints.forEach(endpoint => {
            fetch(endpoint)
                .then(response => response.json())
                .then(data => {
                    resultsDiv.innerHTML += `<h3>${endpoint}</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
                })
                .catch(error => {
                    resultsDiv.innerHTML += `<h3>${endpoint}</h3><p style="color: red;">Error: ${error.message}</p>`;
                });
        });
    </script>
</body>
</html>
```

Upload this as `test.html` to your cPanel and visit it to quickly check multiple endpoints.