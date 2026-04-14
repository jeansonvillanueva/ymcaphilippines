import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';

interface Video {
  id?: number;
  title: string;
  description?: string;
  embedUrl?: string;
  videoUrl?: string;
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [form, setForm] = useState<Video>({
    title: '',
    description: '',
    embedUrl: '',
    videoUrl: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${ADMIN_API_URL}/videos`;

  useEffect(() => {
    fetchVideos();
  }, []);

  const normalizeYoutubeUrl = (url: string) => {
    const value = url?.trim();
    if (!value) return '';

    const match = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    return value;
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get(API_URL);
      setVideos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setMessage({ type: 'error', text: 'Failed to load videos' });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({ title: '', description: '', embedUrl: '', videoUrl: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmbedUrl = normalizeYoutubeUrl(form.embedUrl || '');
    if (!form.title.trim() || !normalizedEmbedUrl) {
      setMessage({ type: 'error', text: 'Title and Youtube link are required' });
      return;
    }

    const payload = { ...form, embedUrl: normalizedEmbedUrl };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        setMessage({ type: 'success', text: 'Video updated successfully' });
      } else {
        await axios.post(API_URL, payload);
        setMessage({ type: 'success', text: 'Video added successfully' });
      }
      clearForm();
      fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      setMessage({ type: 'error', text: 'Failed to save video' });
    }
  };

  const handleEdit = (video: Video) => {
    setForm(video);
    setEditingId(video.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage({ type: 'success', text: 'Video deleted successfully' });
        fetchVideos();
        if (editingId === id) {
          clearForm();
        }
      } catch (error) {
        console.error('Error deleting video:', error);
        setMessage({ type: 'error', text: 'Failed to delete video' });
      }
    }
  };

  if (loading) return <div className="loading">Loading videos...</div>;

  return (
    <div className="admin-section">
      {message && (
        <div className={`${message.type}-message`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <form className="admin-form expanded" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Youtube Link</label>
          <input
            type="text"
            name="embedUrl"
            placeholder="https://www.youtube.com/watch?v=your-video-id"
            value={form.embedUrl || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Video title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Video description"
            value={form.description || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Save' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={clearForm} className="btn btn-secondary">
              Back
            </button>
          )}
        </div>
      </form>

      <div className="admin-list-table-wrapper">
        <table className="admin-list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Youtube Link</th>
              <th>Title</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id}>
                <td>{video.id}</td>
                <td>{video.embedUrl ? video.embedUrl.replace('https://', '').slice(0, 30) + '...' : '-'}</td>
                <td>{video.title}</td>
                <td>{video.description || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(video)} className="btn btn-secondary btn-small">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(video.id!)} className="btn btn-danger btn-small">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
