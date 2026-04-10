import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useNews } from '../hooks/useApi';
import NewsArticle from '../components/NewsArticle';
import '../styles/design-system.css';

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
      localYMCA={item.localYMCA}
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
