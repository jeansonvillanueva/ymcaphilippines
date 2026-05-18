import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { LATEST_NEWS, type NewsArticleMeta } from '../data/news';

// Use query parameter routing instead of path-based routing
// This works on cPanel without needing .htaccess rewrites
const API_BASE = 'https://ymca.ph/php-api/index.php';
export const ADMIN_API_URL = `${API_BASE}?path=/n2r8k5j9m1`;
export const PUBLIC_API_URL = `${API_BASE}?path=/api`;

// Configure axios with credentials for authentication
// This ensures session cookies are sent/received with every request
axios.defaults.withCredentials = true;

// Hook for fetching videos
export function useVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${PUBLIC_API_URL}/videos`);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setVideos(response.data);
        } else {
          setVideos([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        // On error, continue without videos - component will handle empty array
        setVideos([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
}

// Hook for fetching news
export function useNews() {
  const [news, setNews] = useState<NewsArticleMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${PUBLIC_API_URL}/news`);
        // Only use API data if it has items; otherwise fallback to local data
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setNews(response.data);
        } else {
          setNews(LATEST_NEWS);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching news, using local data:', err);
        // On error, fallback to local news data
        setNews(LATEST_NEWS);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading, error };
}

export function useNewsItem(path: NewsArticleMeta['path']) {
  const { news, loading, error } = useNews();
  const item = useMemo(
    () => news.find((newsItem) => newsItem.path === path) ?? null,
    [news, path]
  );

  return { item, loading, error };
}

// Hook for fetching calendar events (public endpoint - no auth required)
export function useCalendarEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Use PUBLIC_API_URL to allow users to see calendar without admin login
        const response = await axios.get(`${PUBLIC_API_URL}/calendar`);
        setEvents(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        // Don't show error - just display empty calendar if unavailable
        setEvents([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}

// Hook for fetching staff
export function useStaff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${ADMIN_API_URL}/staff`);
        setStaff(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching staff:', err);
        setError('Failed to load staff');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return { staff, loading, error };
}

// Hook for fetching locals
export function useLocals() {
  const [locals, setLocals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocals = async () => {
      try {
        const response = await axios.get(`${ADMIN_API_URL}/locals`);
        setLocals(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching locals:', err);
        setError('Failed to load locals');
      } finally {
        setLoading(false);
      }
    };

    fetchLocals();
  }, []);

  return { locals, loading, error };
}

// Hook for fetching a specific local
export function useLocalById(id: string) {
  const [local, setLocal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchLocal = async () => {
      try {
        const response = await axios.get(`${PUBLIC_API_URL}/locals/${id}`);
        setLocal(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching local:', err);
        setError('Failed to load local');
      } finally {
        setLoading(false);
      }
    };

    fetchLocal();
  }, [id]);

  return { local, loading, error };
}
