import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';

interface News {
  id?: number;
  path: string;
  title: string;
  date?: string;
  subtitle?: string;
  imageUrl?: string;
  category: string;
  topic: string;
}

const categories = ['News', 'Articles', 'Features'];
const topics = ['Education', 'Training', 'Youth Leadership', 'Environment', 'Youth Summit', 'Leadership', 'National Youth Assembly', 'Careers'];

export default function AdminNews() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [form, setForm] = useState<News>({
    path: '',
    title: '',
    date: '',
    subtitle: '',
    imageUrl: '',
    category: 'News',
    topic: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${ADMIN_API_URL}/news`;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(API_URL);
      setNewsList(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setMessage({ type: 'error', text: 'Failed to load news' });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.path.trim()) {
      setMessage({ type: 'error', text: 'Title and path are required' });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setMessage({ type: 'success', text: 'News updated successfully' });
      } else {
        await axios.post(API_URL, form);
        setMessage({ type: 'success', text: 'News added successfully' });
      }
      setForm({
        path: '',
        title: '',
        date: '',
        subtitle: '',
        imageUrl: '',
        category: 'News',
        topic: '',
      });
      setEditingId(null);
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
      setMessage({ type: 'error', text: 'Failed to save news' });
    }
  };

  const handleEdit = (news: News) => {
    setForm(news);
    setEditingId(news.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this news?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage({ type: 'success', text: 'News deleted successfully' });
        fetchNews();
        if (editingId === id) {
          setForm({
            path: '',
            title: '',
            date: '',
            subtitle: '',
            imageUrl: '',
            category: 'News',
            topic: '',
          });
          setEditingId(null);
        }
      } catch (error) {
        console.error('Error deleting news:', error);
        setMessage({ type: 'error', text: 'Failed to delete news' });
      }
    }
  };

  if (loading) return <div className="loading">Loading news...</div>;

  return (
    <div className="admin-section">
      <h2>Manage Y Latest News</h2>

      {message && (
        <div className={`${message.type}-message`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <form className="admin-form expanded" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            placeholder="News title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Path *</label>
          <input
            type="text"
            name="path"
            placeholder="/news/Card_One"
            value={form.path}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="text"
            name="date"
            placeholder="e.g., November 6-7, 2026"
            value={form.date || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Topic</label>
          <select name="topic" value={form.topic} onChange={handleChange}>
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            placeholder="https://..."
            value={form.imageUrl || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Subtitle</label>
          <textarea
            name="subtitle"
            placeholder="Subtitle or description"
            value={form.subtitle || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update News' : 'Add News'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({
                  path: '',
                  title: '',
                  date: '',
                  subtitle: '',
                  imageUrl: '',
                  category: 'News',
                  topic: '',
                });
                setEditingId(null);
              }}
              className="btn btn-secondary"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h3>News List</h3>
      {newsList.length === 0 ? (
        <p>No news yet. Add one to get started!</p>
      ) : (
        <table className="admin-list-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Topic</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsList.map((news) => (
              <tr key={news.id}>
                <td>{news.title}</td>
                <td>{news.category}</td>
                <td>{news.topic}</td>
                <td>{news.date || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(news)} className="btn btn-secondary btn-small">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(news.id!)} className="btn btn-danger btn-small">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
