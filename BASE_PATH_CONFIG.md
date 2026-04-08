# Base Path Configuration Note

## Your Site Configuration

Your frontend is configured with a **base path of `/testsite/`** in the Vite configuration:

```javascript
// vite.config.ts
export default defineConfig({
  base: '/testsite/',  // <-- Public base URL
  plugins: [react()],
  // ...
})
```

This means all routes are prefixed with `/testsite/`.

---

## How to Access the Admin Panel

### ✅ Correct URLs

**From your local machine (development):**
- `http://localhost:5173/testsite/admin`

**Relative path (any environment):**
- `/testsite/admin`

**If deployed to a domain:**
- `https://yourdomain.com/testsite/admin`

### ❌ Incorrect URLs (won't work)

- ~~`http://localhost:5173/admin`~~ ❌
- ~~`localhost:5173/admin`~~ ❌
- ~~`/admin`~~ ❌

---

## All Routes with Base Path

Your website routes are all accessible with the `/testsite/` prefix:

| Page | URL |
|------|-----|
| Home | `/testsite/` or `/testsite/` |
| What We Do | `/testsite/calendar` |
| Where We Are | `/testsite/find-ymca` |
| About Us | `/testsite/about-us` |
| Donate | `/testsite/donate` |
| Get Involved | `/testsite/get-involved` |
| **Admin Panel** | **/testsite/admin** |

---

## Why This Configuration?

The base path `/testsite/` is configured in your Vite config to allow the site to be deployed to a subdirectory on your server rather than at the root domain. This is common when:

- Hosting multiple sites on one server
- Hosting on a shared hosting platform
- Using a subdirectory for testing/staging
- Publishing to a GitHub Pages-style URL structure

---

## Changing the Base Path (if needed)

To change the base path, edit `frontend/vite.config.ts`:

```javascript
export default defineConfig({
  base: '/',                // Root path
  // or
  base: '/mysite/',         // Different subdirectory
  // or
  base: '/v2/',             // Version-based path
  plugins: [react()],
  // ...
})
```

**Note**: If you change the base path, you'll need to rebuild the frontend:
```bash
npm run build
```

---

## For Production Deployment

When deploying to production, make sure:

1. ✅ Your server serves static files from the correct directory
2. ✅ All routes under `/testsite/` are delegated to `index.html` (for SPA routing)
3. ✅ The backend API at `http://localhost:3000/admin/*` is accessible
4. ✅ CORS is configured properly if API is on different domain

---

## Quick Reference

**You should bookmark:**
```
http://localhost:5173/testsite/admin
```

This is your admin panel URL! 🎉

---

**Last Updated**: April 8, 2026
