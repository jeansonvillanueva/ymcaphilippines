import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContentRenderer from '../../components/ContentRenderer';
import NewsArticle, { type LocalYMCAConfig } from '../../components/NewsArticle';
import { LOCALS_BY_ID } from '../../data/locals';
import { hasSlideshowBlocks } from '../../utils/contentBlocks';
import {
  ADMIN_NEWS_PREVIEW_STORAGE_KEY,
  loadAdminNewsPreviewDraft,
  type AdminNewsPreviewDraft,
} from '../../utils/adminNewsPreview';
import '../../styles/design-system.css';
import './AdminNewsPreview.css';

const DASHBOARD_PATH = '/secure-management/v3/k7n4m9p2q8c1x5j3/portal/dashboard';

function resolveLocalYMCA(localYMCA?: string): LocalYMCAConfig | undefined {
  if (!localYMCA?.trim()) return undefined;
  const localConfig = LOCALS_BY_ID[localYMCA];
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

export default function AdminNewsPreview() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<AdminNewsPreviewDraft | null>(() => loadAdminNewsPreviewDraft());

  const refreshDraft = useCallback(() => {
    setDraft(loadAdminNewsPreviewDraft());
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === ADMIN_NEWS_PREVIEW_STORAGE_KEY) {
        refreshDraft();
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshDraft]);

  if (!draft) {
    return (
      <div className="admin-news-preview-page">
        <header className="admin-news-preview-page__bar">
          <Link to={DASHBOARD_PATH} className="admin-news-preview-page__back">
            ← Back to admin
          </Link>
        </header>
        <div className="admin-news-preview-page__empty">
          <h1>No preview available</h1>
          <p>Open preview from the news editor after adding content.</p>
          <button
            type="button"
            className="admin-news-preview-page__btn"
            onClick={() => navigate(DASHBOARD_PATH)}
          >
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  const contentBlocks = draft.contentBlocks;
  const inlineSlideshow = hasSlideshowBlocks(contentBlocks);
  const layoutVariant = draft.category === 'Articles' ? 'article' : 'news';

  return (
    <div className="admin-news-preview-page">
      <header className="admin-news-preview-page__bar">
        <button
          type="button"
          className="admin-news-preview-page__back"
          onClick={() => {
            if (window.opener && !window.opener.closed) {
              window.close();
              return;
            }
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate(DASHBOARD_PATH);
            }
          }}
        >
          ← Back to editor
        </button>
        <span className="admin-news-preview-page__badge">Draft preview — updates live</span>
        <button
          type="button"
          className="admin-news-preview-page__refresh"
          onClick={refreshDraft}
          title="Reload preview now"
        >
          Refresh
        </button>
      </header>

      <div className="admin-news-preview-page__content">
        <NewsArticle
          title={draft.title || 'Untitled news article'}
          date={draft.date}
          subtitle={draft.subtitle}
          imageUrl={draft.imageUrl}
          localYMCA={resolveLocalYMCA(draft.localYMCA)}
          layoutVariant={layoutVariant}
          hideHeaderMedia={inlineSlideshow}
        >
          <ContentRenderer contentBlocks={contentBlocks} />
        </NewsArticle>
      </div>
    </div>
  );
}
