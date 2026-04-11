# PHP API for YMCA Philippines

This is a PHP-based REST API converted from the original Node.js Express backend, designed for cPanel hosting.

## Features

- REST API endpoints compatible with the original Node.js backend
- MySQL database integration
- File upload handling
- CORS support
- Admin endpoints for content management

## Database Setup

The API expects the following MySQL database tables (same as the Node.js version):

- `videos`
- `news`
- `calendar_events`
- `locals`
- `pillars`
- `pillar_programs`
- `staff`
- `submit_article`
- `donations`
- `feedback`
- `users`

## Deployment to cPanel

1. **Upload Files**: Upload the entire `php-api/` folder to your cPanel's `public_html` directory or a subdirectory.

2. **Database Configuration**: Update the database credentials in `config.php`:
   ```php
   $host = 'your_mysql_host';
   $user = 'your_db_user';
   $password = 'your_db_password';
   $database = 'your_db_name';
   ```

3. **File Permissions**: Ensure the following directories have proper permissions:
   - `php-api/` (755)
   - `../backend/uploads/` (755) - for file uploads

4. **URL Rewriting**: Make sure `.htaccess` is enabled in your cPanel. The provided `.htaccess` file handles URL routing.

## API Endpoints

### Public Endpoints
- `GET /api/articles` - Get submitted articles
- `GET /api/news` - Get news articles
- `GET /api/users` - Get users
- `GET /api/locals` - Get all locals
- `GET /api/locals/{id}` - Get local details
- `GET /api/pillars/{localId}` - Get pillars for a local

### Form Submissions
- `POST /api/submit-update` - Submit article update
- `POST /api/donate` - Submit donation
- `POST /api/feedback` - Submit feedback

### Admin Endpoints
- `GET /admin/feedback` - Get all feedback
- `GET /admin/submit-updates` - Get submitted updates
- `GET /admin/donations` - Get donations
- `GET/POST/PUT/DELETE /admin/videos` - Manage videos
- `GET/POST/PUT/DELETE /admin/news` - Manage news
- `GET/POST/PUT/DELETE /admin/calendar` - Manage calendar events
- `GET/POST/PUT /admin/locals` - Manage locals
- `POST /admin/locals/{id}/upload` - Upload local images
- `GET/PUT/POST /admin/pillars` - Manage pillars
- `POST/PUT/DELETE /admin/pillar-programs` - Manage pillar programs
- `GET/POST/PUT/DELETE /admin/staff` - Manage staff

## Frontend Integration

Your React frontend can call these PHP endpoints using `fetch()` just like the original Node.js API. No changes needed to your frontend code.

Example:
```javascript
fetch('/php-api/api/news')
  .then(response => response.json())
  .then(data => console.log(data));
```

## File Uploads

File uploads are handled via multipart/form-data. The API accepts:
- Images only (JPEG, PNG, GIF, WebP)
- Maximum file size: 5MB
- Files are stored in `../backend/uploads/`

## Error Handling

The API returns JSON responses with appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Server Error

Error responses include an `error` field with details.

## Security Notes

- All inputs are sanitized using `mysqli_real_escape_string()`
- File uploads are validated for type and size
- Consider adding authentication for admin endpoints in production