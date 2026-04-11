# Frontend API URL Update Script

## Update Your React Frontend for PHP API

After uploading your PHP API to cPanel, you need to update your React frontend to point to the new API endpoints.

### Step 1: Update API Base URL

In your `frontend/src/hooks/useApi.ts` file, change the API_BASE from the Render deployment to your cPanel domain:

**Before:**
```typescript
const API_BASE = 'https://ymcaph-backend.onrender.com';
```

**After:**
```typescript
const API_BASE = 'https://yourdomain.com/php-api';
```

Replace `yourdomain.com` with your actual cPanel domain.

### Step 2: Update Direct Fetch Calls

Check for any direct fetch calls in your components. For example, in `Article_Form.tsx`:

**Before:**
```javascript
const response = await fetch(`${PUBLIC_API_URL}/submit-update`, {
```

**After:**
```javascript
const response = await fetch('/php-api/api/submit-update', {
```

### Step 3: Test the Changes

1. Build your React app: `npm run build`
2. Upload the `dist` folder to your cPanel
3. Test that the frontend loads dynamic data

### Step 4: Environment Variables (Optional)

For better configuration management, you can use environment variables:

Create `.env.production`:
```
VITE_API_BASE=https://yourdomain.com/php-api
```

Then update `useApi.ts`:
```typescript
const API_BASE = import.meta.env.VITE_API_BASE || 'https://yourdomain.com/php-api';
```

### Quick Update Script

Run this command in your frontend directory to update the API URL:

```bash
# Replace 'yourdomain.com' with your actual domain
sed -i 's|https://ymcaph-backend.onrender.com|https://yourdomain.com/php-api|g' src/hooks/useApi.ts
```

### Verification

After updating:
- ✅ News should load from database instead of static data
- ✅ Admin panels should work with CRUD operations
- ✅ Forms should submit to PHP API
- ✅ File uploads should work
- ✅ No more fallback to local static data