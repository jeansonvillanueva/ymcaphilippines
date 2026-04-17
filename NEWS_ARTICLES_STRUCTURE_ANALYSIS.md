# News & Articles Structure Analysis

## 1. "Y Latest News" Page Location & Display

### Main Page File
- **Location**: [frontend/src/pages/What_We_Do.tsx](frontend/src/pages/What_We_Do.tsx)
- **CSS Styles**: [frontend/src/pages/What_We_Do.css](frontend/src/pages/What_We_Do.css)
- **Route**: `/calendar` (mapped in App.tsx)

### Display Structure
The "Y Latest News" page displays news in a **two-section layout**:

1. **Featured Section** (above the fold)
   - Large hero image (min-height: 82vh, max-height: 720px)
   - Overlay with title, date, and "Read Featured" CTA
   - Automatically shows the first featured item from filtered news

2. **Archive Grid Section** (below the fold)
   - 3-column grid layout of news cards (responsive: 2 columns on tablets, 1 on mobile)
   - Each card displays:
     - Image with category tag (News/Article/Feature)
     - Title, date/subtitle, description
     - "Read More" button
   - **Pagination**: Navigate with arrow buttons (← →) and dot indicators
   - **3 cards per page** (CARDS_PER_PAGE = 3)

### Filtering System
- **Sidebar filters** (sticky, top: 120px):
  - **Category**: All, News, Articles, Features
  - **Topic**: Dynamically populated from news items
  - **Archive Year**: Dynamically extracted from dates
- Filters are applied in real-time with instant results

---

## 2. Homepage & Slideshow Display

### Main Homepage File
- **Location**: [frontend/src/pages/Home.tsx](frontend/src/pages/Home.tsx)
- **CSS Styles**: [frontend/src/pages/Home.css](frontend/src/pages/Home.css)
- **Route**: `/`

### Hero Slideshow Implementation
1. **Automatic Selection**:
   - Fetches all news via `useNews()` hook
   - Sorts by date (most recent first)
   - Takes top 3 most recent news items
   - Each item becomes a hero slide

2. **Slide Data**:
   ```typescript
   type HeroSlide = {
     image: item.imageUrl,
     heading: item.title,
     subheading: item.subtitle ?? item.date,
     path: item.path
   }
   ```

3. **Display Features**:
   - Full-width hero banner
   - Manual slide navigation (buttons to go previous/next)
   - Auto-rotation capability
   - Each slide is clickable → links to full article

4. **Fallback**:
   - If API news fetch fails, falls back to `LATEST_NEWS` from local data

---

## 3. Individual Article/News Pages

### Page Types & Locations

#### Static News Card Pages (Template-based)
- **Location**: `frontend/src/pages/Card-Media/news/Card_*.tsx`
- **Files**:
  - Card_One.tsx through Card_Seven.tsx
  - Each imports meta from `getNewsArticleMeta('/news/Card_*')`
  - Renders via `<NewsArticle>` component

#### Article Pages
- **Location**: `frontend/src/pages/Card-Media/articles/Manila_YMCA/`
- **Files**:
  - Article_One.tsx (College Y Club General Assembly)
  - Article_Two.tsx (YMCA Career Development Program)

#### Dynamic Article Viewer
- **Location**: [frontend/src/pages/NewsDetail.tsx](frontend/src/pages/NewsDetail.tsx)
- **Route**: `/news/:slug`
- **Functionality**:
  - Matches URL slug to article path `/news/{slug}`
  - Fetches from `useNews()` hook
  - Displays via `<NewsArticle>` component with `layoutVariant="article"`

### NewsArticle Component Structure
- **Location**: [frontend/src/components/NewsArticle.tsx](frontend/src/components/NewsArticle.tsx)
- **CSS**: [frontend/src/components/NewsArticle.css](frontend/src/components/NewsArticle.css)

**Display Features**:
- **Hero Images**:
  - Supports single `imageUrl` or multiple `heroImageUrls`
  - Multiple images auto-rotate every 15 seconds (HERO_INTERVAL_MS = 15_000)
- **Main Content Area**:
  - Article title, date, subtitle
  - Body content (rendered from HTML)
  - Scroll-reveal animations
  
**Two Layout Variants**:
1. **`layoutVariant="news"`**: Card-style display, compact
2. **`layoutVariant="article"`**: Full editorial layout with sidebar

**Sidebar** (when `localYMCA` provided):
- Local YMCA logo and name
- Website link
- Social media links (Facebook, Instagram, X/Twitter)
- "More Like This" section with related articles (3 items, same topic)

---

## 4. Admin Panel Structure

### Admin News Management
- **Location**: [frontend/src/pages/admin/AdminNews.tsx](frontend/src/pages/admin/AdminNews.tsx)
- **Route**: `/admin/news`

### Form Fields
```typescript
interface News {
  id?: number;
  path: string;           // URL path (auto-generated or manual)
  title: string;          // Required
  date?: string;          // e.g., "March 12, 2026 at 10:59 AM"
  subtitle?: string;      // Short summary
  body?: string;          // Full HTML content
  localYMCA?: string;     // Local YMCA ID/name for sidebar
  imageUrl?: string;      // Base64 or uploaded URL
  category: string;       // 'News' | 'Articles' | 'Features'
  topic: string;          // Topic filter option
}
```

### Predefined Options
- **Categories**: News, Articles, Features
- **Topics**: Education, Training, Youth Leadership, Environment, Youth Summit, Leadership, National Youth Assembly, Careers

### Admin CRUD Operations
1. **Create**: `POST /admin/news`
2. **Read**: `GET /admin/news`
3. **Update**: `PUT /admin/news/:id`
4. **Delete**: `DELETE /admin/news/:id`

### Image Handling in Admin Panel
- File upload with validation (max 5 MB)
- Convert to Base64 for preview display
- Automatically upload to backend `/uploads` directory

### Admin API Endpoints
- **Base URL**: `https://ymca.ph/testsite/php-api/admin`
- **News Endpoint**: `/admin/news`
- Requires authentication (checks session/token)

---

## 5. Image Handling & Storage

### Image Sources
1. **Static Assets**: `frontend/src/assets/images/latest_news/`
   - card1.jpg, card2.jpg, card3.jpg, etc.
   - Imported directly in TypeScript/TSX files
   - Used as fallback in `LATEST_NEWS` data

2. **Uploaded Images** (Dynamic):
   - Stored in: `backend/uploads/` directory
   - Upload via admin panel with image validation
   - Stored as Base64 in database OR as file path

### Image URL Normalization
Both **Card** and **NewsArticle** components normalize URLs:
```typescript
const normalizeImageUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/testsite/') || url.startsWith('/testsite/backend/uploads/')) return url;
  if (url.startsWith('/backend/uploads/')) return url;
  if (url.startsWith('/uploads/')) return `/testsite/backend${url}`;
  if (url.startsWith('/php-api/uploads/')) return `/testsite/backend/${url.substring('/php-api/uploads/'.length)}`;
  return url;
};
```

### Image Display Sizes
- **Card Images**: Standard thumbnail in grid
- **Hero Images**: Full-width, object-fit: cover
- **Article Sidebar Logo**: Small (YMCA local logo)

### Multi-image Support
- `heroImageUrls?: string[]` – array of rotating images
- Auto-switches every 15 seconds
- Falls back to single `imageUrl` if not provided

---

## 6. Data Structure & Database Schema

### Database Table: `news`
```sql
CREATE TABLE news (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  path VARCHAR(255) UNIQUE,                      -- URL path like '/news/Card_One'
  title VARCHAR(255) NOT NULL,                   -- Article title
  date VARCHAR(100),                             -- Date string, e.g., "March 12, 2026 at 10:59 AM"
  subtitle TEXT,                                 -- Short summary/subtitle
  body TEXT,                                     -- Full article content (HTML)
  localYMCA VARCHAR(100),                        -- Local YMCA reference/name
  imageUrl VARCHAR(500),                         -- Main article image URL
  category VARCHAR(50),                          -- News | Articles | Features
  topic VARCHAR(100),                            -- Category filter: Education, Training, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### Local Data Structure (Fallback)
- **Location**: [frontend/src/data/news.ts](frontend/src/data/news.ts)
- Type: `NewsArticleMeta[]` array
- Used when API fetch fails or returns empty
- Contains 9 predefined news items

```typescript
export type NewsArticleMeta = {
  path: `/news/${string}`;           // Must match App.tsx route
  title: string;
  date?: string;
  subtitle?: string;
  imageUrl?: string | null;
  category: NewsCategory;            // 'News' | 'Articles' | 'Features'
  topic: string;
  body?: string;                      // Full HTML content
  localYMCA?: LocalYMCAMeta;          // Sidebar info
  websiteUrl?: string;
}

export type LocalYMCAMeta = {
  name: string;
  logoSrc: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    x?: string;
  }
}
```

### Data Fetch Strategy (useNews Hook)
```typescript
export function useNews() {
  // 1. Try to fetch from API: GET https://ymca.ph/testsite/php-api/api/news
  // 2. If API returns data, use it
  // 3. If API fails or returns empty, fallback to LATEST_NEWS (local data)
  // 4. Never shows error to user; always has data from one source
}
```

---

## 7. Key Implementation Patterns

### Component Hierarchy
```
What_We_Do.tsx (Latest News page)
├── SubjectHeader (section title)
├── Featured card (large hero)
└── Card-Media/Card.tsx (grid of news cards)
    └── Link to /news/:slug

Home.tsx
└── Hero Slideshow
    └── Uses top 3 news items

App.tsx (Routing)
├── /calendar → What_We_Do
├── /news/:slug → NewsDetail
├── /news/Card_* → Individual card pages
└── /admin/news → AdminNews (protected)
```

### Data Flow
```
useNews() hook
├── Fetch from API: /api/news
├── Fallback to: LATEST_NEWS (frontend/src/data/news.ts)
└── Returns: news[], loading, error

Admin panel
├── Fetch from API: /admin/news
├── Create/Update/Delete via form
└── Upload images to backend/uploads/
```

### API Integration Points
- **Public API**: `https://ymca.ph/testsite/php-api/api/news`
- **Admin API**: `https://ymca.ph/testsite/php-api/admin/news`
- **Backend**: `backend/` (Node.js Express or similar)
- **PHP API**: `php-api/` (alternative backend)

---

## Summary Table

| Aspect | Location | Details |
|--------|----------|---------|
| **Latest News Page** | `frontend/src/pages/What_We_Do.tsx` | 2-section layout: featured + grid with pagination, 3 filters |
| **Homepage Slideshow** | `frontend/src/pages/Home.tsx` | Top 3 news items, auto-rotates, manual nav |
| **Article Templates** | `frontend/src/pages/Card-Media/news/Card_*.tsx` | 7 static news pages + 2 article pages |
| **Dynamic Articles** | `frontend/src/pages/NewsDetail.tsx` | Route: `/news/:slug`, fetches from API/local data |
| **Article Component** | `frontend/src/components/NewsArticle.tsx` | Displays with optional sidebar, hero images, related items |
| **Admin Panel** | `frontend/src/pages/admin/AdminNews.tsx` | CRUD form for news, image upload, filters |
| **Database Schema** | `backend/database-init.js` | `news` table with 11 columns |
| **Local Data** | `frontend/src/data/news.ts` | `LATEST_NEWS[]` fallback, 9 items |
| **Image Storage** | `backend/uploads/` | Uploaded images from admin panel |
| **Image Normalization** | `Card.tsx`, `NewsArticle.tsx` | URL path conversion for testsite structure |

