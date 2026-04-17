import type { ReactNode } from 'react';
import NewsArticle, { type LocalYMCAConfig } from './NewsArticle';
import { useNewsItem } from '../hooks/useApi';
import { getNewsArticleMeta, type NewsArticleMeta } from '../data/news';

interface NewsPageWrapperProps {
  path: NewsArticleMeta['path'];
  children: ReactNode;
  layoutVariant?: 'news' | 'article';
  localYMCA?: LocalYMCAConfig;
  websiteUrl?: string;
}

export default function NewsPageWrapper({
  path,
  children,
  layoutVariant = 'news',
  localYMCA,
  websiteUrl,
}: NewsPageWrapperProps) {
  const { item } = useNewsItem(path);
  const fallback = getNewsArticleMeta(path);

  return (
    <NewsArticle
      title={item?.title || fallback?.title || 'News'}
      subtitle={item?.subtitle || fallback?.subtitle}
      date={item?.date || fallback?.date}
      imageUrl={item?.imageUrl ?? fallback?.imageUrl}
      articlePath={path}
      layoutVariant={layoutVariant}
      localYMCA={localYMCA}
      websiteUrl={websiteUrl}
    >
      {children}
    </NewsArticle>
  );
}
