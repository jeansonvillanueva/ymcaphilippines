import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';
import ContentBuilder from '../../components/ContentBuilder';
import type { ContentBlock } from '../../components/ContentBuilder';
import ContentRenderer from '../../components/ContentRenderer';
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
const topics = [
  'Education',
  'Training',
  'Youth Leadership',
  'Environment',
  'Youth Summit',
  'Leadership',
  'National Youth Assembly',
  'Careers',
  'Community Development',
  'Volunteerism',
  'Health and Wellness',
  'Mental Health',
  'Sports and Recreation',
  'Culture and Arts',
  'Disaster Response',
  'Climate Action',
  'Social Responsibility',
  'Scholarships',
  'Events and Programs',
  'Partnerships',
  'Advocacy',
  'Technology and Innovation',
  'Entrepreneurship',
  'Faith and Values',
  'International Programs',
  'Local YMCA Activities',
  'Success Stories',
  'Announcements',
  'Workshops',
  'Seminars',
  'Conferences',
  'Outreach Programs',
  'Fundraising',
  'Community Service',
  'Inclusive Development',
  'Women Empowerment',
  'Children and Youth',
  'Sustainability',
  'Digital Skills',
  'Volunteer Opportunities',
  'Public Service',
  'Campus Initiatives',
  'Employment Opportunities',
  'Press Releases'
];
// Parse date string for chronological sorting (latest first)
const parseNewsDate = (date?: string) => {
  if (!date) return Number.MIN_SAFE_INTEGER;
  const parsed = Date.parse(date);
  if (!Number.isNaN(parsed)) return parsed;
  const year = date.match(/\b(19|20)\d{2}\b/)?.[0];
  if (year) return new Date(`${year}-01-01`).getTime();
  return Number.MIN_SAFE_INTEGER;
};

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
  const [topicSearch, setTopicSearch] = useState('');
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);

  const API_URL = `${ADMIN_API_URL}/news`;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const timestamp = Date.now();
      const response = await axios.get(`${API_URL}&t=${timestamp}`);
      if (Array.isArray(response.data)) {
        // Sort news by date field chronologically (latest first), not by created_at
        const sortedNews = response.data.sort((a, b) => parseNewsDate(b.date) - parseNewsDate(a.date));
        setNewsList(sortedNews);
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

  const handleTopicSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTopicSearch(value);
    setShowTopicSuggestions(true);
  };

  const handleSelectTopic = (selectedTopic: string) => {
    setForm((prev) => ({ ...prev, topic: selectedTopic }));
    setTopicSearch(selectedTopic);
    setShowTopicSuggestions(false);
  };

  const filteredTopics = topicSearch.trim() === '' 
    ? topics 
    : topics.filter((topic) => topic.toLowerCase().includes(topicSearch.toLowerCase()));

  const extractSlideshowImages = () => {
    const images: Array<{ url: string; order: number }> = [];
    (form.contentBlocks || []).forEach((block) => {
      if (block.type === 'slideshow' && block.slideshow_images) {
        block.slideshow_images.forEach((img) => {
          images.push({
            url: img.url,
            order: images.length, // Global order across all slideshows
          });
        });
      }
    });
    return images;
  };

  const uploadSlideshowImages = async (newsId: number) => {
    const images = extractSlideshowImages();
    if (images.length === 0) return;

    for (const image of images) {
      try {
        // Convert base64 to blob
        const response = await fetch(image.url);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('image', blob, `slideshow-${image.order}.jpg`);

        await axios.post(`${ADMIN_API_URL}/news/${newsId}/upload`, formData);
      } catch (error) {
        console.error(`Error uploading slideshow image ${image.order}:`, error);
        throw new Error(`Failed to upload slideshow image ${image.order + 1}`);
      }
    }
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setForm((prev) => ({ ...prev, imageUrl: '' }));

    const fileInput = document.getElementById('news-image') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = '';
    }
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
        formData.append('id', editingId.toString());
        await axios.post(`${API_URL}/${editingId}`, formData, {
          timeout: 120000, // 2 minutes
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        // Delete old slideshow images and upload new ones for editing
        try {
          // First, delete all existing slideshow images for this news
          await axios.delete(`${ADMIN_API_URL}/news/${editingId}/images/all`);
        } catch (error) {
          console.log('Note: Could not delete existing slideshow images (may not exist)');
        }
        // Upload new slideshow images
        await uploadSlideshowImages(editingId);
        setMessage({ type: 'success', text: 'News updated successfully' });
      } else {
        const createResponse = await axios.post(API_URL, formData, {
          timeout: 120000, // 2 minutes
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        console.log('[AdminNews] Create response:', createResponse.data);
        const newNewsId = createResponse.data.id;
        // Upload slideshow images for new news
        if (newNewsId) {
          await uploadSlideshowImages(newNewsId);
        }
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
      setTopicSearch('');
      setShowTopicSuggestions(false);
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
    setTopicSearch(news.topic || '');
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

        <div className="form-group topic-search-group">
          <label htmlFor="news-topic">Topic</label>
          <div className="topic-search-wrapper">
            <input
              id="news-topic"
              type="text"
              placeholder="Search or type a topic..."
              value={topicSearch || form.topic}
              onChange={handleTopicSearch}
              onFocus={() => setShowTopicSuggestions(true)}
              onBlur={() => setTimeout(() => setShowTopicSuggestions(false), 200)}
              className="topic-search-input"
            />
            {showTopicSuggestions && (topicSearch.trim() !== '' || form.topic === '') && (
              <div className="topic-suggestions">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                    <div
                      key={`topic-${topic}`}
                      className={`topic-suggestion-item ${form.topic === topic ? 'selected' : ''}`}
                      onClick={() => handleSelectTopic(topic)}
                    >
                      {topic}
                    </div>
                  ))
                ) : (
                  <div className="topic-suggestion-item disabled">
                    No topics found
                  </div>
                )}
              </div>
            )}
          </div>
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
              <button
                type="button"
                onClick={handleRemoveImage}
                className="btn btn-danger btn-small"
                style={{ marginTop: '0.75rem' }}
              >
                Delete Image
              </button>
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

        <div className="admin-news-preview" style={{ gridColumn: '1 / -1' }}>
          <div className="admin-news-preview__header">
            <span>Preview</span>
          </div>
          <article className="admin-news-preview__article">
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt={form.title || 'News preview'}
                className="admin-news-preview__image"
              />
            )}
            <div className="admin-news-preview__meta">
              {form.category && <span>{form.category}</span>}
              {form.topic && <span>{form.topic}</span>}
              {form.date && <span>{form.date}</span>}
            </div>
            <h2>{form.title || 'Untitled news article'}</h2>
            {form.subtitle && <p className="admin-news-preview__subtitle">{form.subtitle}</p>}
            <ContentRenderer contentBlocks={Array.isArray(form.contentBlocks) ? form.contentBlocks : []} />
          </article>
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
                  contentBlocks: [],
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

      <style>{`
        .admin-news-preview {
          border: 1px solid #d9e2ec;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          margin-top: 1rem;
        }

        .admin-news-preview__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: #f5f7fa;
          border-bottom: 1px solid #d9e2ec;
          color: #243b53;
          font-weight: 700;
        }

        .admin-news-preview__article {
          max-width: 860px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .admin-news-preview__image {
          width: 100%;
          max-height: 360px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .admin-news-preview__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          color: #52606d;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .admin-news-preview__meta span:not(:last-child)::after {
          content: "•";
          margin-left: 0.5rem;
          color: #9fb3c8;
        }

        .admin-news-preview__article h2 {
          margin: 0 0 0.75rem;
          color: #102a43;
          font-size: 1.8rem;
          line-height: 1.2;
        }

        .admin-news-preview__subtitle {
          color: #334e68;
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
      `}</style>
    </div>
  );
}
