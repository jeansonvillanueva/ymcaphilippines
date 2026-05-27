import { LATEST_NEWS } from './news';

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
  { type: 'page', title: 'What We Do', subtitle: 'News & calendar', path: '/what-we-do' },
  { type: 'page', title: 'Latest News', path: '/what-we-do#latest-news' },
  { type: 'page', title: 'Calendar of Activities', path: '/what-we-do#calendar' },
  { type: 'page', title: 'Where We Are', subtitle: 'Find your YMCA', path: '/where-we-are' },
  { type: 'page', title: 'Find Your YMCA', path: '/where-we-are#find-your-ymca' },
  { type: 'page', title: 'Contact Us', path: '/where-we-are#contact-us' },
  { type: 'page', title: 'Get Involved', path: '/get-involved' },
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

  return out.slice(0, limit);
}
