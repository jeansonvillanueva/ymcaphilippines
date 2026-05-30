import type { NewsArticleMeta } from '../data/news';

/** Ensure API paths work with React Router `/news/:slug` routes. */
export function normalizeNewsPath(path: string): NewsArticleMeta['path'] {
  const trimmed = path.trim();
  if (!trimmed) return '/news/untitled' as NewsArticleMeta['path'];
  if (trimmed.startsWith('/news/')) return trimmed as NewsArticleMeta['path'];
  const slug = trimmed.replace(/^\/+/, '').replace(/^news\//i, '');
  return `/news/${slug}` as NewsArticleMeta['path'];
}

export function normalizeNewsItem<T extends { path?: string | null }>(item: T): T & { path: NewsArticleMeta['path'] } {
  return {
    ...item,
    path: normalizeNewsPath(item.path ?? ''),
  };
}
