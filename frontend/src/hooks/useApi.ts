import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import type { NewsArticleMeta } from '../data/news';
import { resolveApiIndexUrl } from '../config/api';
import { useNewsContext } from '../context/NewsContext';

// Query-parameter routing works on cPanel without .htaccess rewrites
const API_BASE = resolveApiIndexUrl();
export const ADMIN_API_URL = `${API_BASE}?path=/admin`;
export const PUBLIC_API_URL = `${API_BASE}?path=/api`;

/** Build admin API URL with encoded path (reliable on all hosts). */
export function buildAdminUrl(routeSuffix: string): string {
  const suffix = routeSuffix.startsWith('/') ? routeSuffix : `/${routeSuffix}`;
  const fullPath = `/admin${suffix}`;
  return `${API_BASE}?path=${encodeURIComponent(fullPath)}`;
}

/** Build public API URL with encoded path. */
export function buildPublicUrl(routeSuffix: string): string {
  const suffix = routeSuffix.startsWith('/') ? routeSuffix : `/${routeSuffix}`;
  const fullPath = `/api${suffix}`;
  return `${API_BASE}?path=${encodeURIComponent(fullPath)}`;
}

/** Required for authenticated admin API routes (session cookie). */
export const adminRequestConfig = { withCredentials: true as const };

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

// Shared news list (single fetch for the whole app — avoids duplicate requests / race conditions)
export function useNews() {
  return useNewsContext();
}

export function useNewsItem(path: NewsArticleMeta['path']) {
  const { news, loading, error } = useNews();
  const item = useMemo(
    () =>
      Array.isArray(news)
        ? (news.find((newsItem) => newsItem.path === path) ?? null)
        : null,
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
        const payload = response.data;
        setEvents(Array.isArray(payload) ? payload : []);
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
        const response = await axios.get(buildPublicUrl(`/locals/${id}`));
        const data = response.data;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setLocal(data);
          setError(null);
          return;
        }
        throw new Error('Invalid local detail response');
      } catch (detailErr) {
        console.error('Error fetching local detail:', detailErr);
        try {
          const listResponse = await axios.get(`${PUBLIC_API_URL}/locals`);
          const list = Array.isArray(listResponse.data) ? listResponse.data : [];
          const match = list.find((item: { id?: string }) => item?.id === id);
          if (match) {
            setLocal({ ...match, pillars: [] });
            setError(null);
            return;
          }
        } catch (listErr) {
          console.error('Error fetching local from list fallback:', listErr);
        }
        setError('Failed to load local');
      } finally {
        setLoading(false);
      }
    };

    fetchLocal();
  }, [id]);

  return { local, loading, error };
}

// Hook for total community program bullets (Our Reach & Impact)
export function useCommunityProgramsCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(buildPublicUrl('/stats/community-programs'));
        const value = Number(response.data?.count);
        setCount(Number.isFinite(value) ? value : 0);
      } catch (err) {
        console.error('Error fetching community programs count:', err);
        setCount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return { count, loading };
}
