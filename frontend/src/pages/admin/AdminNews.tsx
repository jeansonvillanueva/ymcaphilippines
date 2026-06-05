import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';
import ContentBuilder from '../../components/ContentBuilder';
import type { ContentBlock } from '../../components/ContentBuilder';
import { LOCALS_BY_ID } from '../../data/locals';
import { compareNewsDatesDesc } from '../../utils/newsDate';
import { parseContentBlocks } from '../../utils/contentBlocks';
import {
  ADMIN_NEWS_PREVIEW_PATH,
  saveAdminNewsPreviewDraft,
  type AdminNewsPreviewDraft,
} from '../../utils/adminNewsPreview';
import { useAdminEditingLabel, type AdminEditingItemChange } from './useAdminEditingLabel';

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

type Props = {
  onEditingItemChange?: AdminEditingItemChange;
};

export default function AdminNews({ onEditingItemChange }: Props) {
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

  useAdminEditingLabel(onEditingItemChange, editingId !== null, form.title);

  const buildPreviewDraft = (): AdminNewsPreviewDraft => ({
    title: form.title,
    date: form.date,
    subtitle: form.subtitle,
    imageUrl: form.imageUrl,
    category: form.category,
    topic: form.topic,
    localYMCA: form.localYMCA,
    contentBlocks: Array.isArray(form.contentBlocks) ? form.contentBlocks : [],
  });

  const savePreviewDraft = () => {
    saveAdminNewsPreviewDraft(buildPreviewDraft());
  };

  useEffect(() => {
    const timer = window.setTimeout(savePreviewDraft, 400);
    return () => window.clearTimeout(timer);
  }, [form]);

  const openPreviewPage = (event: React.MouseEvent<HTMLAnchorElement>) => {
    savePreviewDraft();
    event.currentTarget.href = ADMIN_NEWS_PREVIEW_PATH;
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const timestamp = Date.now();
      const response = await axios.get(`${API_URL}&t=${timestamp}`);
      if (Array.isArray(response.data)) {
        // Sort news by date field chronologically (latest first), not by created_at
        const sortedNews = response.data.sort((a, b) => compareNewsDatesDesc(a.date, b.date));
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

  const cloneBlocksForSave = (blocks: ContentBlock[], stripPendingImages = false) => {
    return blocks.map((block) => {
      if (block.type === 'image') {
        if (stripPendingImages && block.content.startsWith('data:')) {
          return { ...block, content: '' };
        }
        return block;
      }

      if (block.type !== 'slideshow') return block;

      return {
        ...block,
        slideshow_images: (block.slideshow_images || [])
          .filter((image) => !stripPendingImages || !image.url.startsWith('data:'))
          .map((image, index) => ({ ...image, order: index })),
      };
    });
  };

  const buildNewsFormData = (blocks: ContentBlock[], includeImage: boolean) => {
    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('date', form.date || '');
    formData.append('subtitle', form.subtitle || '');
    formData.append('body', form.body || '');
    formData.append('contentBlocks', JSON.stringify(blocks));
    formData.append('localYMCA', form.localYMCA || '');
    formData.append('category', form.category || 'News');
    formData.append('topic', form.topic || '');

    if (includeImage) {
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (form.imageUrl !== undefined && !form.imageUrl.startsWith('data:')) {
        formData.append('imageUrl', form.imageUrl || '');
      }
    }

    return formData;
  };

  const uploadPendingBlockImages = async (newsId: number, blocks: ContentBlock[]) => {
    let uploadOrder = 0;
    const updatedBlocks: ContentBlock[] = [];

    for (const block of blocks) {
      if (block.type === 'image' && block.content.startsWith('data:')) {
        try {
          const response = await fetch(block.content);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append('image', blob, `content-image-${uploadOrder}.jpg`);

          const uploadResponse = await axios.post(`${ADMIN_API_URL}/news/${newsId}/upload`, formData);
          updatedBlocks.push({
            ...block,
            content: uploadResponse.data?.image_url || block.content,
          });
          uploadOrder += 1;
        } catch (error) {
          console.error(`Error uploading content image ${uploadOrder}:`, error);
          throw new Error(`Failed to upload content image ${uploadOrder + 1}`);
        }
        continue;
      }

      if (block.type !== 'slideshow') {
        updatedBlocks.push(block);
        continue;
      }

      const updatedImages = [];
      for (const image of block.slideshow_images || []) {
        if (!image.url.startsWith('data:')) {
          updatedImages.push({ ...image, order: updatedImages.length });
          continue;
        }

        try {
          const response = await fetch(image.url);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append('image', blob, `slideshow-${uploadOrder}.jpg`);

          const uploadResponse = await axios.post(`${ADMIN_API_URL}/news/${newsId}/upload`, formData);
          updatedImages.push({
            ...image,
            id: String(uploadResponse.data?.id ?? image.id),
            url: uploadResponse.data?.image_url || image.url,
            order: updatedImages.length,
          });
          uploadOrder += 1;
        } catch (error) {
          console.error(`Error uploading slideshow image ${uploadOrder}:`, error);
          throw new Error(`Failed to upload slideshow image ${uploadOrder + 1}`);
        }
      }

      updatedBlocks.push({ ...block, slideshow_images: updatedImages });
    }

    return updatedBlocks;
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

    const rawBlocks = Array.isArray(form.contentBlocks) ? form.contentBlocks : [];
    const initialBlocksForSave = cloneBlocksForSave(rawBlocks, true);
    const contentBlocksJson = JSON.stringify(initialBlocksForSave);
    if (contentBlocksJson.length > 1000000) {
      setMessage({ type: 'error', text: 'Content is too large. Please reduce the amount of content or use fewer images.' });
      return;
    }

    try {
      if (editingId) {
        try {
          await axios.delete(`${ADMIN_API_URL}/news/${editingId}/images/all`);
        } catch (error) {
          console.log('Note: Could not delete existing slideshow images (may not exist)');
        }

        const uploadedBlocks = await uploadPendingBlockImages(editingId, rawBlocks);
        const formData = buildNewsFormData(uploadedBlocks, true);
        formData.append('_method', 'PUT');
        formData.append('id', editingId.toString());
        await axios.post(`${API_URL}/${editingId}`, formData, {
          timeout: 120000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        setMessage({ type: 'success', text: 'News updated successfully' });
      } else {
        const formData = buildNewsFormData(initialBlocksForSave, true);
        const createResponse = await axios.post(API_URL, formData, {
          timeout: 120000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        console.log('[AdminNews] Create response:', createResponse.data);
        const newNewsId = createResponse.data.id;
        if (newNewsId) {
          const uploadedBlocks = await uploadPendingBlockImages(newNewsId, rawBlocks);
          const updateFormData = buildNewsFormData(uploadedBlocks, false);
          updateFormData.append('_method', 'PUT');
          updateFormData.append('id', newNewsId.toString());
          await axios.post(`${API_URL}/${newNewsId}`, updateFormData, {
            timeout: 120000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          });
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
    const parsedContentBlocks = parseContentBlocks(news.contentBlocks);
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
        <div className={`admin-status-banner ${message.type}-message`} role="status" aria-live="polite">
          <span className="admin-status-banner__text">{message.text}</span>
          <button type="button" className="admin-status-banner__close" onClick={() => setMessage(null)} aria-label="Dismiss notification">
            ×
          </button>
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
              <img src={form.imageUrl} alt="News preview" />
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

        <div className="form-group wp-post-field" style={{ gridColumn: '1 / -1' }}>
          <div className="wp-post-field__toolbar">
            <label htmlFor="news-content-editor">Content</label>
            <a
              href={ADMIN_NEWS_PREVIEW_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-preview-btn"
              onClick={openPreviewPage}
            >
              Preview article
            </a>
          </div>
          <div id="news-content-editor">
            <ContentBuilder
              blocks={Array.isArray(form.contentBlocks) ? form.contentBlocks : []}
              onChange={(blocks) => setForm((prev) => ({ ...prev, contentBlocks: blocks }))}
            />
          </div>
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
        .wp-post-field__toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem 1rem;
          margin-bottom: 0.5rem;
        }

        .wp-post-field__toolbar label {
          margin-bottom: 0;
        }

        .admin-preview-btn {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 0 14px;
          border: 1px solid #2271b1;
          border-radius: 6px;
          background: #fff;
          color: #2271b1;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .admin-preview-btn:hover {
          background: #f0f6fc;
          border-color: #135e96;
          color: #135e96;
        }
      `}</style>
    </div>
  );
}
