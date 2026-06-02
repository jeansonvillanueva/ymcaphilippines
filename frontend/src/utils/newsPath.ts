import type { NewsArticleMeta } from '../data/news';

/** Ensure API paths work with React Router `/news/:slug` routes. */
export function normalizeNewsPath(path: string): NewsArticleMeta['path'] {
  const trimmed = path.trim();
  if (!trimmed) return '/news/untitled' as NewsArticleMeta['path'];
  if (trimmed.startsWith('/news/')) return trimmed as NewsArticleMeta['path'];
  const slug = trimmed.replace(/^\/+/, '').replace(/^news\//i, '');
  return `/news/${slug}` as NewsArticleMeta['path'];
}

function resolveNewsDisplayDate(item: Record<string, unknown>): string | undefined {
  for (const key of ['date', 'Date', 'event_date', 'eventDate']) {
    const value = item[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

export function normalizeNewsItem<T extends { path?: string | null; date?: string }>(
  item: T,
): T & { path: NewsArticleMeta['path']; date?: string } {
  const record = item as Record<string, unknown>;
  const displayDate = resolveNewsDisplayDate(record);

  return {
    ...item,
    path: normalizeNewsPath(item.path ?? ''),
    ...(displayDate ? { date: displayDate } : {}),
  };
}
