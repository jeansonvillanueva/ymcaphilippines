import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../hooks/useApi';
import SubjectHeader from '../components/SubjectHeader';
import '../styles/design-system.css';
import './What_We_Do.css';

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
    <div className="page-section page-section--white latest-news-section">
      <div className="page-section__inner">
        <SubjectHeader text={item.title} className="reveal" />
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="latest-news-featured__image" />
        ) : (
          <div className="card-image card-image--placeholder" style={{ marginBottom: '1rem' }}>
            No image available
          </div>
        )}

        <div className="latest-news-article-meta">
          {item.category && <span className="latest-news-article-category">{item.category}</span>}
          {item.topic && <span className="latest-news-article-topic">{item.topic}</span>}
          {item.date && <span className="latest-news-article-date">{item.date}</span>}
        </div>

        {item.subtitle && <p className="latest-news-article-subtitle">{item.subtitle}</p>}
        {item.body && <div className="latest-news-article-body">{item.body}</div>}

        <Link to="/calendar" className="latest-news-featured__cta" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
          Back to Latest News
        </Link>
      </div>
    </div>
  );
};

export default NewsDetail;
