# Frontend Component Migration Examples

This document shows how to migrate each frontend component to use data from the admin API instead of hardcoded data.

## 1. Home.tsx - YMCA Videos

### Original (Hardcoded)
```typescript
const YOUTUBE_VIDEOS: VideoItem[] = [
  { id: 'vision2030', title: 'YMCA Vision 2030', ... },
  { id: 'promotion', title: 'YMCA Promotion', ... },
];

function Home() {
  return (
    <VideoShowcase heading="YMCA Videos" videos={YOUTUBE_VIDEOS} />
  );
}
```

### Updated (Using API)
```typescript
import { useVideos } from '../hooks/useApi';

function Home() {
  const { videos, loading, error } = useVideos();
  
  // Transform API data to match VideoItem type
  const videoItems = videos.map((v) => ({
    id: v.id.toString(),
    title: v.title,
    description: v.description,
    embedUrl: v.embedUrl,
    videoUrl: v.videoUrl,
  }));

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  if (error || !videoItems.length) {
    // Fall back to empty or show message
    return null;
  }

  return (
    <VideoShowcase heading="YMCA Videos" videos={videoItems} />
  );
}
```

## 2. What_We_Do.tsx - Calendar Events

### Updated (Using API)
```typescript
import { useCalendarEvents } from '../hooks/useApi';

const WhatWeDo: React.FC = () => {
  const { events: apiEvents, loading } = useCalendarEvents();
  
  // Transform API events to CalendarEventRecord format
  const calendarRecords = apiEvents.map((event) => ({
    title: event.title,
    date: event.date, // Already in YYYY-MM-DD format
    description: event.description,
    image: event.imageUrl,
  }));

  const [selected, setSelected] = useState<CalendarEvent | null>(
    calendarRecords.find((e) => e.date === today) ?? null
  );

  // ... rest of component using calendarRecords instead of CALENDAR_EVENT_RECORDS
};
```

## 3. What_We_Do.tsx - Latest News

### Updated (Using API)
```typescript
import { useNews } from '../hooks/useApi';

const WhatWeDo: React.FC = () => {
  const { news: apiNews, loading } = useNews();

  // Transform API news to NewsArticleMeta format
  const newsItems = apiNews.map((item) => ({
    path: item.path as `/news/${string}`,
    title: item.title,
    date: item.date,
    subtitle: item.subtitle,
    imageUrl: item.imageUrl,
    category: item.category as NewsCategory,
    topic: item.topic,
  }));

  // Use newsItems instead of LATEST_NEWS
  const filteredItems = useMemo(() => {
    return newsItems.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      if (topic !== 'All' && item.topic !== topic) return false;
      if (archiveYear !== 'All') {
        const y = extractYear(item.date);
        if (!y || y !== archiveYear) return false;
      }
      return true;
    });
  }, [archiveYear, category, topic, newsItems]);

  // ... rest of component
};
```

## 4. About_Us.tsx - Staff (Meet Our Family)

### Updated (Using API)
```typescript
import { useStaff } from '../hooks/useApi';

function AboutUs() {
  const { staff: apiStaff, loading } = useStaff();
  
  // Transform API staff to ORG_STRUCTURE format
  const staffByDept: Record<string, OrgMember[]> = {};
  
  apiStaff.forEach((member) => {
    const dept = member.departmentGroup || 'Other';
    if (!staffByDept[dept]) staffByDept[dept] = [];
    staffByDept[dept].push({
      name: member.name,
      position: member.position,
      imageUrl: member.imageUrl,
    });
  });

  // Find the first staff member as head
  const headStaff = apiStaff.sort((a, b) => 
    (a.sequenceOrder || 0) - (b.sequenceOrder || 0)
  )[0];

  const orgStructure = {
    head: headStaff ? {
      name: headStaff.name,
      position: headStaff.position,
      imageUrl: headStaff.imageUrl,
    } : null,
    branches: Object.entries(staffByDept).map(([deptName, members]) => ({
      title: deptName,
      children: members,
    })),
  };

  // ... rest of component using orgStructure
}
```

## 5. Where_We_Are.tsx - Locals

### Updated (Using API)
```typescript
import { useLocals } from '../hooks/useApi';

function WhereWeAre() {
  const { locals: apiLocals, loading } = useLocals();

  // Map locals data to REGIONS structure or use directly
  const localsByRegion = useMemo(() => {
    // Group locals by region
    const regionMap: Record<string, any[]> = {};
    
    apiLocals.forEach((local) => {
      // Determine region based on local id
      const region = getRegionForLocal(local.id);
      if (!regionMap[region]) regionMap[region] = [];
      regionMap[region].push(local);
    });

    return Object.entries(regionMap).map(([region, locals]) => ({
      id: region,
      name: region,
      branches: locals.map((local) => ({
        id: local.id,
        name: local.name,
        markerId: local.id,
        link: local.facebookUrl,
      })),
    }));
  }, [apiLocals]);

  // ... rest of component using localsByRegion
}
```

## 6. LocalDetails.tsx - Local Specific Data

### Updated (Using API)
```typescript
import { useLocalById } from '../hooks/useApi';

interface LocalDetailsProps {
  localId: string;
}

function LocalDetails({ localId }: LocalDetailsProps) {
  const { local, loading, error } = useLocalById(localId);

  if (loading) return <div>Loading...</div>;
  if (error || !local) return <div>Local not found</div>;

  return (
    <div>
      <img src={local.heroImageUrl} alt={local.name} />
      <h1>{local.name}</h1>
      <p>Corporate Members: {local.corporate}</p>
      <p>Non-Corporate Members: {local.nonCorporate}</p>
      <p>Youth Members: {local.youth}</p>
      <p>Other Members: {local.others}</p>
      <p>As of: {local.totalMembersAsOf}</p>
      {/* Display pillars and other local info */}
    </div>
  );
}
```

## Migration Checklist

- [ ] Update Home.tsx to fetch videos from API
- [ ] Update What_We_Do.tsx to fetch news and calendar events from API
- [ ] Update About_Us.tsx to fetch staff from API
- [ ] Update Where_We_Are.tsx to fetch locals from API
- [ ] Update LocalDetails.tsx to fetch specific local data
- [ ] Test all components with API data
- [ ] Remove hardcoded data files (optional, keep as backup)
- [ ] Test on production data

## Tips for Migration

1. **Test Gradually**: Migrate one component at a time
2. **Keep Fallbacks**: Handle loading and error states
3. **Use TypeScript**: Ensure data types match component expectations
4. **Test Filtering**: Verify filter functionality still works with API data
5. **Performance**: Consider caching if data doesn't change frequently
6. **Error Handling**: Display user-friendly messages when data fails to load

## Handling Loading States

```typescript
// Show placeholder while loading
if (loading) {
  return (
    <div className="loading-skeleton">
      {/* Show placeholder cards/elements */}
    </div>
  );
}

// Show error message
if (error) {
  return (
    <div className="error-message">
      <p>Unable to load content. Please try again later.</p>
    </div>
  );
}

// Show empty state if no data
if (!data || data.length === 0) {
  return (
    <div className="empty-state">
      <p>No content available yet.</p>
    </div>
  );
}
```

## API Response Format Reference

### Videos API Response
```typescript
[
  {
    id: 1,
    title: "YMCA Vision 2030",
    description: "Description text",
    embedUrl: "https://youtu.be/...",
    videoUrl: null,
    created_at: "2026-04-08T10:00:00.000Z",
    updated_at: "2026-04-08T10:00:00.000Z"
  }
]
```

### News API Response
```typescript
[
  {
    id: 1,
    path: "/news/Card_One",
    title: "Teachers Training Program",
    date: "November 6-7, 2026",
    subtitle: "Subtitle text",
    imageUrl: "https://...",
    category: "News",
    topic: "Education",
    created_at: "2026-04-08T10:00:00.000Z",
    updated_at: "2026-04-08T10:00:00.000Z"
  }
]
```

### Calendar Events API Response
```typescript
[
  {
    id: 1,
    title: "NAO Meeting",
    date: "2026-03-03",
    description: "Meeting description",
    imageUrl: null,
    created_at: "2026-04-08T10:00:00.000Z",
    updated_at: "2026-04-08T10:00:00.000Z"
  }
]
```

### Staff API Response
```typescript
[
  {
    id: 1,
    name: "Orlando F. Carreon",
    position: "OIC – National General Secretary",
    imageUrl: "https://...",
    departmentGroup: "National General Secretary",
    sequenceOrder: 1,
    created_at: "2026-04-08T10:00:00.000Z",
    updated_at: "2026-04-08T10:00:00.000Z"
  }
]
```

### Locals API Response
```typescript
[
  {
    id: "manila",
    name: "YMCA of Manila",
    established: "1920",
    facebookUrl: "https://facebook.com/...",
    heroImageUrl: "https://...",
    logoImageUrl: "https://...",
    corporate: 150,
    nonCorporate: 200,
    youth: 300,
    others: 50,
    totalMembersAsOf: "December 2025",
    created_at: "2026-04-08T10:00:00.000Z",
    updated_at: "2026-04-08T10:00:00.000Z"
  }
]
```
