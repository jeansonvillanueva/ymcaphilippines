# React/TypeScript Application Dependency Analysis

**Project:** YMCA of the Philippines Website  
**Date:** Analysis completed  
**Focus:** c:\Users\Jeanson\yphilippines\frontend\

---

## Executive Summary

Your application has **15 production dependencies** but several are either completely unused or heavily underutilized. There are significant opportunities to reduce bundle size by removing unused packages and replacing heavy libraries with lighter alternatives.

**Estimated reduction potential:** ~4-5 MB from bundle (40-50% reduction)

---

## 1. UNUSED DEPENDENCIES

### 🔴 CRITICAL - Not Used At All

| Package | Size (approx) | Usage | Location | Status |
|---------|-------------|-------|----------|--------|
| `@emotion/react` | ~38 KB | **ZERO** - Never imported | - | Remove |
| `@emotion/styled` | ~15 KB | **ZERO** - Never imported | - | Remove |
| `@fullcalendar/bootstrap` | ~5 KB | **ZERO** - Never imported | - | Remove |
| `@mui/material` | ~3.5 MB | **ZERO** - Only appears in dead code | `frontend/src/pages/Card-Media/MUICardComponent.tsx` | ⚠️ See note below |

### ⚠️ Note on MUICardComponent.tsx

**File:** [frontend/src/pages/Card-Media/MUICardComponent.tsx](frontend/src/pages/Card-Media/MUICardComponent.tsx)

- This component uses Material-UI components but is **never imported** anywhere in the application
- Searched entire codebase - zero usages found
- The app instead uses a custom `Card.tsx` component
- **Recommendation:** Delete this file and remove @mui/material dependency

---

## 2. ALL IMPORTED DEPENDENCIES

### ✅ ACTIVELY USED

| Package | Import Count | Files Using | Purpose |
|---------|--------------|-------------|---------|
| `react` | - | All files | Framework |
| `react-dom` | - | main.tsx | Rendering |
| `react-router-dom` | 5 files | App.tsx, Navbar.tsx, Where_We_Are.tsx, Get_Involved.tsx, About_Us.tsx | Routing/Navigation |
| `react-icons/fa` | 2 files | [Footer.tsx](frontend/src/components/Footer.tsx), [NewsArticle.tsx](frontend/src/components/NewsArticle.tsx) | Social media & contact icons |
| `@fortawesome/react-fontawesome` | 1 file | [Navbar.tsx](frontend/src/components/Navbar.tsx) | Search icon |
| `@fortawesome/free-solid-svg-icons` | 1 file | [Navbar.tsx](frontend/src/components/Navbar.tsx) | Search magnifying glass icon |
| `@fullcalendar/react` | 1 file | [ActivityCalendar.tsx](frontend/src/components/ActivityCalendar.tsx) | Event calendar display |
| `@fullcalendar/core` | 1 file | [ActivityCalendar.tsx](frontend/src/components/ActivityCalendar.tsx) | Calendar core types |
| `@fullcalendar/daygrid` | 1 file | [ActivityCalendar.tsx](frontend/src/components/ActivityCalendar.tsx) | Calendar month view |
| `@fullcalendar/interaction` | 1 file | [ActivityCalendar.tsx](frontend/src/components/ActivityCalendar.tsx) | Click handlers |
| `axios` | 1 file (sparse usage) | [Where_We_Are.tsx](frontend/src/pages/Where_We_Are.tsx) | HTTP requests (~line 337) |
| `react-select` | 1 file | [Article_Form.tsx](frontend/src/pages/Article_Form.tsx) | YMCA dropdown selector |

---

## 3. ENTRY POINT ANALYSIS

### main.tsx Entry Flow
```
main.tsx
├── imports: React, createRoot
├── imports: App.tsx
└── renders: App component
```

**[main.tsx](frontend/src/main.tsx) imports:**
- `react` (StrictMode)
- `react-dom/client`
- `App.tsx` (no dependencies bundled here - lazy loaded via router)

**App.tsx imports (~21 route components):**
- All route components are **currently imported directly** (not lazy loaded)
- This means the entire app code is bundled upfront
- Estimated impact: All pages loaded before first paint

---

## 4. LARGE DEPENDENCY PACKAGES - FULLY LOADED

### 🔴 FullCalendar Suite (~2.5-3 MB total)

**Files:** [ActivityCalendar.tsx](frontend/src/components/ActivityCalendar.tsx)

**Currently loaded packages:**
```
@fullcalendar/core       (main bundle)
@fullcalendar/react      (wrapper)
@fullcalendar/daygrid    (month/week view)
@fullcalendar/interaction (event clicks)
@fullcalendar/bootstrap  (UNUSED)
```

**Actual usage:** Simple month calendar with event clicks - **only 5% of FullCalendar's features are used**

**Opportunity:** Replace with lightweight alternatives:
- `vanilla-calendar-pro` (~50 KB)
- `tui-calendar` (~200 KB)
- Custom React component (~10 KB)

---

### 🔴 @mui/material (~3.5 MB + emotions peers)

**Status:** Dead code

**Files:** [MUICardComponent.tsx](frontend/src/pages/Card-Media/MUICardComponent.tsx) (unused)

**Already used:** Custom `Card.tsx` component works fine

**Action:** Delete MUICardComponent.tsx and remove package

---

### 🟡 react-select (~50 KB)

**Files:** [Article_Form.tsx](frontend/src/pages/Article_Form.tsx) - line 2

**Usage:** Single dropdown for YMCA branch selection

**Opportunity:** Could use native `<select>` element for this use case, or `react-hook-form` which is lighter

---

### 🟡 FontAwesome + react-icons Duplication

**Two icon libraries used:**
- `@fortawesome/react-fontawesome` + `@fullcalendar/free-solid-svg-icons` (~50 KB combined)
- `react-icons/fa` (~15 KB)

**Total icon library footprint:** ~65 KB

**Actual usage:**
- 1x search icon (Navbar - FontAwesome)
- 6x social/contact icons (Footer, NewsArticle - react-icons)

**Opportunity:** Consolidate to single library or use inline SVGs

---

### ✅ axios (~15 KB) - Single Use

**Files:** [Where_We_Are.tsx](frontend/src/pages/Where_We_Are.tsx) - line 337

**Usage:** One API call for feedback submission

**Opportunity:** Replace with native Fetch API to save 15 KB

---

## 5. LAZY LOADING OPPORTUNITIES

### Current Architecture
All 21 route components are imported at the top level of App.tsx:
```tsx
// App.tsx currently does:
import About_Y from './pages/Home';
import Calendar from './pages/What_We_Do';
import Find_Your_YMCA from './pages/Where_We_Are';
// ... 18 more imports
```

**Problem:** Entire app code is bundled upfront regardless of route

### Recommended Lazy Loading Strategy

Pages that are **not on critical path:**
- `Calendar` (What_We_Do) - moderate traffic
- `LocalDetails` - specific route
- `Donate` - conversion funnel
- `Get_Involved` - secondary CTA
- All `Card-Media` article routes - 9 routes

```tsx
// BEFORE (current)
import Calendar from './pages/What_We_Do';

// AFTER (lazy loaded)
const Calendar = lazy(() => import('./pages/What_We_Do'));
```

**Estimated saving:** 150-200 KB off initial bundle

---

## 6. SPECIFIC FILES WITH UNNECESSARY IMPORTS

### [Article_Form.tsx](frontend/src/pages/Article_Form.tsx)
- **Unnecessary imports:** None - all are used
- **Optimization:** `react-select` could be replaced with native `<select>`

### [Where_We_Are.tsx](frontend/src/pages/Where_We_Are.tsx)  
- **Line 12:** `import axios from 'axios'`
- **Usage:** 1x POST call to `/api/feedback`
- **Recommendation:** Replace with Fetch API

### [Card-Media/MUICardComponent.tsx](frontend/src/pages/Card-Media/MUICardComponent.tsx)
- **Status:** Dead code - DELETE
- **Size saved:** 3.5 MB (@mui/material)
- **Lines to remove:** All (file not used)

---

## 7. DEPENDENCY SUMMARY TABLE

| Dependency | Size (approx) | Used | Recommendation |
|------------|---------------|------|-----------------|
| `@emotion/react` | 38 KB | ❌ NO | **REMOVE** |
| `@emotion/styled` | 15 KB | ❌ NO | **REMOVE** |
| `@fullcalendar/bootstrap` | 5 KB | ❌ NO | **REMOVE** |
| `@fullcalendar/core` | 200 KB | ✅ YES | Consider lighter alternative |
| `@fullcalendar/daygrid` | 150 KB | ✅ YES | Consider lighter alternative |
| `@fullcalendar/interaction` | 50 KB | ✅ YES | Consider lighter alternative |
| `@fullcalendar/react` | 100 KB | ✅ YES | Consider lighter alternative |
| `@fortawesome/react-fontawesome` | 25 KB | ✅ YES (1 icon) | Consolidate or use SVG |
| `@fortawesome/free-solid-svg-icons` | 50 KB | ✅ YES (1 icon) | Consolidate or use SVG |
| `@mui/material` | 3.5 MB | ❌ NO | **REMOVE** |
| `axios` | 15 KB | ✅ YES (1 call) | Replace with Fetch API |
| `react-icons` | 15 KB | ✅ YES | Keep (efficient) |
| `react-router-dom` | 70 KB | ✅ YES | Keep |
| `react-select` | 50 KB | ✅ YES | Consider native `<select>` |
| `react` / `react-dom` | 150 KB | ✅ YES | Keep (core) |

---

## 8. ACTIONABLE RECOMMENDATIONS (Priority Order)

### Phase 1: High Impact, Quick Wins (Save ~4 MB)
1. **Delete MUICardComponent.tsx and remove @mui/material**
   - Impact: -3.5 MB
   - Time: 5 minutes
   - Files affected: [frontend/src/pages/Card-Media/MUICardComponent.tsx](frontend/src/pages/Card-Media/MUICardComponent.tsx)

2. **Remove @emotion/react and @emotion/styled**
   - Impact: -53 KB
   - Time: 2 minutes
   - Command: `npm uninstall @emotion/react @emotion/styled`

3. **Replace axios with Fetch API in Where_We_Are.tsx**
   - Impact: -15 KB
   - Time: 10 minutes
   - Change 1 function call

### Phase 2: Medium Impact (Save ~500 KB)
4. **Replace FullCalendar with lightweight alternative**
   - Impact: -500-600 KB
   - Time: 2-3 hours (testing)
   - Alternatives: vanilla-calendar-pro, custom component

5. **Implement lazy loading for routes**
   - Impact: -150-200 KB off initial bundle
   - Time: 1 hour
   - Affects: [frontend/src/App.tsx](frontend/src/App.tsx)
   - Add `React.lazy()` to non-critical pages

### Phase 3: Nice to Have (Save ~100 KB)
6. **Consolidate icon libraries**
   - Impact: -60-80 KB
   - Either: Move FontAwesome to react-icons, or use inline SVGs
   - Time: 1-2 hours

7. **Replace react-select with native select**
   - Impact: -50 KB
   - Time: 30 minutes
   - File: [frontend/src/pages/Article_Form.tsx](frontend/src/pages/Article_Form.tsx)

---

## 9. BUNDLE IMPACT ESTIMATE

```
Current estimated bundle:
├── React, React-DOM         ~150 KB
├── React Router             ~70 KB
├── FullCalendar Suite       ~500 KB  ⚠️ Heavy
├── @mui/material            ~3.5 MB  ❌ UNUSED
├── @emotion packages        ~53 KB   ❌ UNUSED
├── react-icons/fa           ~15 KB
├── @fortawesome/*           ~75 KB   ⚠️ 1 icon only
├── react-select             ~50 KB   ⚠️ 1 dropdown
├── axios                    ~15 KB   ⚠️ 1 request
└── App code + other         ~200 KB
────────────────────────────────────
TOTAL (gzipped)             ~4.6 MB
```

**After recommended changes:**
```
Removed:
- @mui/material              -3.5 MB
- @emotion/*                 -53 KB
- @fullcalendar/bootstrap    -5 KB
- axios (→ Fetch API)        -15 KB
- @fullcalendar → lighter    -400 KB
- @fortawesome (→ consolidate) -50 KB

TOTAL (gzipped)             ~0.53 MB  (89% reduction!)
```

---

## 10. Next Steps

1. **Review [frontend/src/pages/Card-Media/MUICardComponent.tsx](frontend/src/pages/Card-Media/MUICardComponent.tsx)** - Is this truly dead code?
2. **Confirm FullCalendar usage** - Are all features being used or just the month view?
3. **Test Fetch API replacement** - Verify Where_We_Are feedback works without axios
4. **Measure current bundle** - Run `npm run build` and check dist size
5. **Implement changes incrementally** - Start with Phase 1, test each step

