import { LATEST_NEWS } from './news';
import { CALENDAR_EVENT_RECORDS } from './calendarEvents';

export type SearchResultType = 'news' | 'page' | 'event';

export type SearchResult = {
  type: SearchResultType;
  title: string;
  subtitle?: string;
  path: string;
};

const PAGE_ENTRIES: SearchResult[] = [
  { type: 'page', title: 'Home — The Y', subtitle: 'About, mission, vision', path: '/' },
  { type: 'page', title: 'About Us', subtitle: 'The Y Philippines', path: '/#about' },
  { type: 'page', title: 'Mission', path: '/#mission' },
  { type: 'page', title: 'Vision', path: '/#vision' },
  { type: 'page', title: 'History', path: '/#history' },
  { type: 'page', title: 'Meet Our Family', subtitle: 'Organizational staff', path: '/#meet-family' },
  { type: 'page', title: 'What We Do', subtitle: 'News & calendar', path: '/calendar' },
  { type: 'page', title: 'Latest News', path: '/calendar#latest-news' },
  { type: 'page', title: 'Calendar of Activities', path: '/calendar#calendar' },
  { type: 'page', title: 'Where We Are', subtitle: 'Find your YMCA', path: '/find-ymca' },
  { type: 'page', title: 'Find Your YMCA', path: '/find-ymca#find-ymca' },
  { type: 'page', title: 'Contact Us', path: '/find-ymca#contact-us' },
  { type: 'page', title: 'Get Involved', path: '/get-involved' },
  { type: 'page', title: 'Support — Donate', path: '/donate' },
  { type: 'page', title: 'Submit YMCA Update', subtitle: 'Local news submission', path: '/Article' },
];

function normalize(q: string) {
  return q.trim().toLowerCase();
}

function matches(haystack: string, q: string) {
  return haystack.toLowerCase().includes(q);
}

export function searchSite(rawQuery: string, limit = 12): SearchResult[] {
  const q = normalize(rawQuery);
  if (!q) return [];

  const out: SearchResult[] = [];

  for (const n of LATEST_NEWS) {
    const blob = `${n.title} ${n.topic} ${n.subtitle ?? ''} ${n.category}`;
    if (matches(blob, q)) {
      out.push({
        type: 'news',
        title: n.title,
        subtitle: n.date ? `${n.date} · ${n.category}` : n.category,
        path: n.path,
      });
    }
  }

  for (const p of PAGE_ENTRIES) {
    const blob = `${p.title} ${p.subtitle ?? ''}`;
    if (matches(blob, q)) {
      out.push({ ...p });
    }
  }

  for (const e of CALENDAR_EVENT_RECORDS) {
    const blob = `${e.title} ${e.description ?? ''} ${e.date}`;
    if (matches(blob, q)) {
      out.push({
        type: 'event',
        title: e.title,
        subtitle: e.date,
        path: '/calendar#calendar',
      });
    }
  }

  return out.slice(0, limit);
}
