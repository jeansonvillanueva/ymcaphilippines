import { useState, useEffect } from 'react';
import axios from 'axios';

const API_HOST = window.location.hostname;
const API_PORT = import.meta.env.VITE_BACKEND_PORT ?? '3000';
const API_BASE = `${window.location.protocol}//${API_HOST}:${API_PORT}`;
export const ADMIN_API_URL = `${API_BASE}/admin`;
export const PUBLIC_API_URL = `${API_BASE}/api`;

// Hook for fetching videos
export function useVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${ADMIN_API_URL}/videos`);
        setVideos(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos');
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
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${PUBLIC_API_URL}/news`);
        setNews(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading, error };
}

// Hook for fetching calendar events
export function useCalendarEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${ADMIN_API_URL}/calendar`);
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        setError('Failed to load calendar events');
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
        const response = await axios.get(`${ADMIN_API_URL}/locals/${id}`);
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
