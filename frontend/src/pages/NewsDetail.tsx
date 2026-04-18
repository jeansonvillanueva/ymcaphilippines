import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useNews } from '../hooks/useApi';
import NewsArticle, { type LocalYMCAConfig } from '../components/NewsArticle';
import { LOCALS_BY_ID } from '../data/locals';
import '../styles/design-system.css';

function resolveLocalYMCA(localYMCA?: string | LocalYMCAConfig | null): LocalYMCAConfig | undefined {
  if (!localYMCA) return undefined;
  if (typeof localYMCA !== 'string') return localYMCA;

  const normalized = localYMCA.trim().toLowerCase();
  const normalizedKey = normalized.replace(/[-_\s]/g, '');

  const localConfig = LOCALS_BY_ID[localYMCA] ??
    Object.values(LOCALS_BY_ID).find((local) => {
      const localName = local.name.trim().toLowerCase();
      const localId = local.id.toLowerCase();
      const normalizedLocalId = localId.replace(/[-_\s]/g, '');
      return (
        local.id === localYMCA ||
        local.id.toLowerCase() === normalized ||
        normalizedLocalId === normalizedKey ||
        localName === normalized
      );
    });

  if (!localConfig) return undefined;

  return {
    name: localConfig.name,
    logoSrc: localConfig.logoImageUrl ?? '',
    socialLinks: {
      facebook: localConfig.facebookUrl,
      instagram: localConfig.instagramUrl,
      x: localConfig.twitterUrl,
    },
  };
}

const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { news, loading, error } = useNews();

  const currentPath = useMemo(() => {
    if (!slug) return null;
    return `/news/${slug}`;
  }, [slug]);

  const item = useMemo(() => {
    if (!currentPath) return null;
    return news.find((n) => n.path === currentPath) ?? null;
  }, [currentPath, news]);

  if (loading) return <div className="loading">Loading news...</div>;
  if (error) return <div className="latest-news-error">{error}</div>;
  if (!item) return <div className="latest-news-error">News article not found.</div>;

  return (
    <NewsArticle
      title={item.title}
      date={item.date}
      subtitle={item.subtitle}
      imageUrl={item.imageUrl}
      localYMCA={resolveLocalYMCA(item.localYMCA as any)}
      websiteUrl={item.websiteUrl}
      articlePath={currentPath || undefined}
      layoutVariant="article"
    >
      {item.body ? (
        <div dangerouslySetInnerHTML={{ __html: item.body }} />
      ) : (
        <p>No content available for this article.</p>
      )}
    </NewsArticle>
  );
};

export default NewsDetail;
