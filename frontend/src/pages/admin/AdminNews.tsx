import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';
import ContentBuilder from '../../components/ContentBuilder';
import type { ContentBlock } from '../../components/ContentBuilder';
import { LOCALS_BY_ID } from '../../data/locals';

interface News {
  id?: number;
  path: string;
  title: string;
  date?: string;
  subtitle?: string;
  body?: string;
  contentBlocks?: ContentBlock[] | string;
  localYMCA?: string;
  imageUrl?: string;
  category: string;
  topic: string;
}

type NewsForm = Omit<News, 'contentBlocks'> & {
  contentBlocks?: ContentBlock[];
};

const categories = ['News', 'Articles', 'Features'];
const topics = ['Education', 'Training', 'Youth Leadership', 'Environment', 'Youth Summit', 'Leadership', 'National Youth Assembly', 'Careers'];

// Image compression utility
const compressImage = (file: File, quality: number = 0.8, maxWidth: number = 1200, maxHeight: number = 1200): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          reject(new Error('Compression failed'));
        }
      }, file.type, quality);
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
};

export default function AdminNews() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [form, setForm] = useState<NewsForm>({
    path: '',
    title: '',
    date: '',
    subtitle: '',
    body: '',
    contentBlocks: [],
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
      const timestamp = Date.now();
      const response = await axios.get(`${API_URL}&t=${timestamp}`);
      if (Array.isArray(response.data)) {
        setNewsList(response.data);
      } else {
        console.error('Unexpected API response format:', response.data);
        setMessage({ type: 'error', text: 'Unexpected data format from server' });
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching news:', error.response?.data || error.message);
      const serverError = error.response?.data?.error;
      setMessage({ type: 'error', text: serverError ? `Failed to load news: ${serverError}` : 'Failed to load news' });
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

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // Reduced to 2MB
    if (file.size > MAX_FILE_SIZE) {
      setMessage({ type: 'error', text: 'Image must be 2 MB or smaller' });
      return;
    }

    // Compress image if it's large
    compressImage(file, 0.8, 1200, 1200).then((compressedFile) => {
      setImageFile(compressedFile);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(compressedFile);
    }).catch((error) => {
      console.error('Image compression failed:', error);
      // Fallback to original file
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }

    // Validate contentBlocks size - increased limit for rich content with multiple images
    const contentBlocksJson = JSON.stringify(form.contentBlocks || []);
    if (contentBlocksJson.length > 10000000) { // ~10MB limit (increased for 10+ images)
      setMessage({ type: 'error', text: 'Content is too large. Please reduce the amount of content or use fewer images.' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('date', form.date || '');
      formData.append('subtitle', form.subtitle || '');
      formData.append('body', form.body || ''); // Keep for backward compatibility
      formData.append('contentBlocks', contentBlocksJson);
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
        await axios.post(`${API_URL}/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 120000, // 2 minutes
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        setMessage({ type: 'success', text: 'News updated successfully' });
      } else {
        const createResponse = await axios.post(API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 120000, // 2 minutes
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        console.log('[AdminNews] Create response:', createResponse.data);
        setMessage({ type: 'success', text: 'News added successfully' });
      }
      setForm({
        path: '',
        title: '',
        date: '',
        subtitle: '',
        body: '',
        contentBlocks: [],
        localYMCA: '',
        imageUrl: '',
        category: 'News',
        topic: '',
      });
      setImageFile(null);
      setEditingId(null);
      // Add a small delay to ensure database has processed the insert
      setTimeout(() => {
        fetchNews();
      }, 500);
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
    const parsedContentBlocks: ContentBlock[] = news.contentBlocks
      ? (Array.isArray(news.contentBlocks) ? news.contentBlocks : JSON.parse(news.contentBlocks))
      : [];
    setForm({
      ...news,
      contentBlocks: parsedContentBlocks,
    });
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
            contentBlocks: [],
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
          <label>Article Content (Paragraphs & Images)</label>
          <ContentBuilder
            blocks={Array.isArray(form.contentBlocks) ? form.contentBlocks : []}
            onChange={(blocks) => setForm((prev) => ({ ...prev, contentBlocks: blocks }))}
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
