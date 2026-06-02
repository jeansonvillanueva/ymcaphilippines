import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import axios from 'axios';
import type { NewsArticleMeta } from '../data/news';
import { resolveApiIndexUrl } from '../config/api';
import { normalizeNewsItem } from '../utils/newsPath';
import { sortNewsByDateDesc } from '../utils/newsDate';

const API_BASE = resolveApiIndexUrl();
const PUBLIC_NEWS_URL = `${API_BASE}?path=/api/news`;

type NewsContextValue = {
  news: NewsArticleMeta[];
  loading: boolean;
  error: string | null;
  refreshNews: (options?: { silent?: boolean }) => Promise<void>;
};

const NewsContext = createContext<NewsContextValue | undefined>(undefined);

async function fetchSortedNews(): Promise<NewsArticleMeta[]> {
  const response = await axios.get(PUBLIC_NEWS_URL, {
    params: { t: Date.now() },
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });

  if (!response.data || !Array.isArray(response.data)) {
    return [];
  }

  const normalized = response.data.map((item: NewsArticleMeta) => normalizeNewsItem(item));
  return sortNewsByDateDesc(normalized);
}

export function NewsProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchGenerationRef = useRef(0);
  const hasLoadedRef = useRef(false);

  const refreshNews = useCallback(async (options?: { silent?: boolean }) => {
    const generation = ++fetchGenerationRef.current;
    const silent = options?.silent === true;
    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const sorted = await fetchSortedNews();
      if (generation !== fetchGenerationRef.current) {
        return;
      }
      setNews(sorted);
      hasLoadedRef.current = true;
    } catch (err) {
      console.error('Error fetching news:', err);
      if (generation !== fetchGenerationRef.current) {
        return;
      }
      if (!silent) {
        setNews([]);
      }
      setError('Failed to load news');
    } finally {
      if (generation === fetchGenerationRef.current && !silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refreshNews();
  }, [refreshNews]);

  // Refetch when user returns to the tab (picks up admin edits without full page reload)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && hasLoadedRef.current) {
        void refreshNews({ silent: true });
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshNews]);

  return (
    <NewsContext.Provider value={{ news, loading, error, refreshNews }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNewsContext(): NewsContextValue {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}
