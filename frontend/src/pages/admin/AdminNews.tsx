import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';
import RichTextEditor from '../../components/RichTextEditor';
import { LOCALS_BY_ID } from '../../data/locals';

interface News {
  id?: number;
  path: string;
  title: string;
  date?: string;
  subtitle?: string;
  body?: string;
  localYMCA?: string;
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
    body: '',
    localYMCA: '',
    imageUrl: '',
    category: 'News',
    topic: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const localOptions = Object.values(LOCALS_BY_ID).map((local) => ({ id: local.id, name: local.name }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setMessage({ type: 'error', text: 'Image must be 5 MB or smaller' });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('date', form.date || '');
      formData.append('subtitle', form.subtitle || '');
      formData.append('body', form.body || '');
      formData.append('localYMCA', form.localYMCA || '');
      formData.append('category', form.category || 'News');
      formData.append('topic', form.topic || '');
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (form.imageUrl) {
        formData.append('imageUrl', form.imageUrl);
      }

      if (editingId) {
        formData.append('_method', 'PUT');
        await axios.post(`${API_URL}/${editingId}`, formData);
        setMessage({ type: 'success', text: 'News updated successfully' });
      } else {
        await axios.post(API_URL, formData);
        setMessage({ type: 'success', text: 'News added successfully' });
      }
      setForm({
        path: '',
        title: '',
        date: '',
        subtitle: '',
        body: '',
        localYMCA: '',
        imageUrl: '',
        category: 'News',
        topic: '',
      });
      setImageFile(null);
      setEditingId(null);
      fetchNews();
    } catch (error: any) {
      console.error('Error saving news:', error.response?.data || error);
      const serverMessage = error.response?.data?.error;
      setMessage({
        type: 'error',
        text: serverMessage ? `Failed to save news: ${serverMessage}` : 'Failed to save news',
      });
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
            body: '',
            localYMCA: '',
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
          <label htmlFor="news-title">Title *</label>
          <input
            id="news-title"
            type="text"
            name="title"
            placeholder="News title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="news-date">Date</label>
          <input
            id="news-date"
            type="text"
            name="date"
            placeholder="e.g., November 6-7, 2026"
            value={form.date || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="news-category">Category</label>
          <select id="news-category" name="category" value={form.category} onChange={handleChange}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="news-topic">Topic</label>
          <select id="news-topic" name="topic" value={form.topic} onChange={handleChange}>
            <option key="topic-placeholder" value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={`topic-${topic}`} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="news-local">Local YMCA</label>
          <select id="news-local" name="localYMCA" value={form.localYMCA || ''} onChange={handleChange}>
            <option key="local-placeholder" value="">Select local YMCA (optional)</option>
            {localOptions.map((local, index) => {
              const optionKey = local.id ? `local-${local.id}` : `local-unknown-${index}`;
              return (
                <option key={optionKey} value={local.id}>
                  {local.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="news-image">Upload Image</label>
          <input id="news-image" type="file" accept="image/*" onChange={handleFileChange} />
          {form.imageUrl ? (
            <div className="image-preview">
              <img src={form.imageUrl} alt="News preview" style={{ maxWidth: '100%', marginTop: '0.75rem' }} />
            </div>
          ) : null}
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Paragraph (with formatting)</label>
          <RichTextEditor
            value={form.body || ''}
            onChange={(html) => setForm((prev) => ({ ...prev, body: html }))}
            placeholder="Main news paragraph or full article summary"
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="news-subtitle">Subtitle</label>
          <textarea
            id="news-subtitle"
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
                  body: '',
                  localYMCA: '',
                  imageUrl: '',
                  category: 'News',
                  topic: '',
                });
                setImageFile(null);
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
              <th>Local YMCA</th>
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
                <td>{localOptions.find((local) => local.id === news.localYMCA)?.name || news.localYMCA || '-'}</td>
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
