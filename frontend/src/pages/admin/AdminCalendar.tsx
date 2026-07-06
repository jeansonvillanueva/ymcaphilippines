import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ADMIN_API_URL, adminRequestConfig } from '../../hooks/useApi';
import { useAdminEditingLabel, type AdminEditingItemChange } from './useAdminEditingLabel';

interface CalendarEvent {
  id?: number;
  title: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  imageUrl?: string;
  documentTitle?: string;
  documentUrl?: string;
  documentFileName?: string;
  documentFileType?: string;
  documentFileSize?: number;
}

type Props = {
  onEditingItemChange?: AdminEditingItemChange;
};

export default function AdminCalendar({ onEditingItemChange }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [form, setForm] = useState<CalendarEvent>({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    imageUrl: '',
    documentTitle: '',
    documentUrl: '',
    documentFileName: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${ADMIN_API_URL}/calendar`;

  useAdminEditingLabel(onEditingItemChange, editingId !== null, form.title);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(API_URL, adminRequestConfig);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage({ type: 'error', text: 'Failed to load events' });
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Only PDF, DOC, DOCX, XLS, XLSX, and TXT files are allowed' });
      return;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setMessage({ type: 'error', text: 'Document must be 10 MB or smaller' });
      return;
    }

    setDocumentFile(file);
    setMessage(null);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const resetForm = () => {
    setForm({
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      imageUrl: '',
      documentTitle: '',
      documentUrl: '',
      documentFileName: '',
    });
    setImageFile(null);
    setDocumentFile(null);
    const documentInput = document.getElementById('calendar-document-input') as HTMLInputElement;
    if (documentInput) documentInput.value = '';
  };

  const uploadRequestConfig = {
    ...adminRequestConfig,
    timeout: 120000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }

    // Validate date range
    const startDate = form.startDate?.trim();
    const endDate = form.endDate?.trim();
    
    if (!startDate || !endDate) {
      setMessage({ type: 'error', text: 'Start date and end date are required' });
      return;
    }

    if (startDate > endDate) {
      setMessage({ type: 'error', text: 'Start date cannot be after end date' });
      return;
    }

    const documentTitle = (form.documentTitle || '').trim();
    if (documentFile && !documentTitle) {
      setMessage({ type: 'error', text: 'Document title is required when uploading a document' });
      return;
    }
    if (!editingId && documentTitle && !documentFile) {
      setMessage({ type: 'error', text: 'Document file is required when a document title is provided' });
      return;
    }

    try {
      // Auto-generate description if not provided
      let description = (form.description || '').trim();
      if (!description) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        
        const formattedStart = startDateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
        const formattedEnd = endDateObj.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
        
        if (startDate === endDate) {
          description = `${form.title} on ${formattedStart}. Details to follow.`;
        } else {
          description = `${form.title} from ${formattedStart} to ${formattedEnd}. Details to follow.`;
        }
      }

      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (form.imageUrl && !form.imageUrl.startsWith('data:')) {
        formData.append('imageUrl', form.imageUrl);
      }
      if (documentTitle) {
        formData.append('documentTitle', documentTitle);
      }
      if (documentFile) {
        formData.append('document', documentFile);
      } else if (form.documentUrl) {
        formData.append('documentUrl', form.documentUrl);
        if (form.documentFileName) formData.append('documentFileName', form.documentFileName);
        if (form.documentFileType) formData.append('documentFileType', form.documentFileType);
        if (form.documentFileSize) formData.append('documentFileSize', String(form.documentFileSize));
      }

      // Extensive logging for debugging
      console.log('=== CALENDAR EVENT SUBMISSION ===');
      console.log('API_URL:', API_URL);
      console.log('Editing ID:', editingId);
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ✓ ${key}: [File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ✓ ${key}: "${value}"`);
        }
      }
      
      console.log('Validation passed:', {
        title: form.title.trim().length > 0,
        startDate: !!startDate,
        endDate: !!endDate,
        datesValid: startDate <= endDate,
      });

      if (editingId) {
        formData.append('_method', 'PUT');
        formData.append('id', String(editingId));
        console.log(`[UPDATE] Sending POST request to: ${API_URL}/${editingId}`);
        console.log('[UPDATE] Waiting for response...');
        const response = await axios.post(`${API_URL}/${editingId}`, formData, uploadRequestConfig);
        console.log('[UPDATE] Response received:', {
          status: response.status,
          data: response.data,
        });
        
        // Check for error in response
        if (response.data?.error) {
          setMessage({ type: 'error', text: `Update failed: ${response.data.error}` });
        } else {
          setMessage({ type: 'success', text: 'Event updated successfully' });
        }
      } else {
        console.log(`[CREATE] Sending POST request to: ${API_URL}`);
        console.log('[CREATE] Waiting for response...');
        const response = await axios.post(API_URL, formData, uploadRequestConfig);
        console.log('[CREATE] Response received:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
        });
        
        // Check for error in response
        if (response.data?.error) {
          setMessage({ type: 'error', text: `Create failed: ${response.data.error}` });
        } else if (response.data?.id) {
          console.log('[CREATE] SUCCESS: Event created with ID', response.data.id);
          setMessage({ type: 'success', text: 'Event added successfully' });
        } else {
          console.log('[CREATE] Unexpected response structure:', response.data);
          setMessage({ type: 'success', text: 'Event added successfully' });
        }
      }
      resetForm();
      setEditingId(null);
      
      // Refetch events with a small delay to ensure database write completes
      console.log('Fetching events after submission...');
      setTimeout(() => {
        fetchEvents();
      }, 500);
    } catch (error: any) {
      console.error('Error saving event:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save event';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setForm(event);
    setEditingId(event.id || null);
    setImageFile(null);
    setDocumentFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_URL}/${id}`, adminRequestConfig);
        setMessage({ type: 'success', text: 'Event deleted successfully' });
        fetchEvents();
        if (editingId === id) {
          resetForm();
          setEditingId(null);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        setMessage({ type: 'error', text: 'Failed to delete event' });
      }
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;

  // Sort events by start date (most recent first)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.startDate || a.date || 0).getTime();
    const dateB = new Date(b.startDate || b.date || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="admin-section">
      <h2>Manage Calendar of Activities</h2>
      <p className="admin-section-description">
        Add events or photos to specific dates. Events will appear on the Calendar of Activities page.
      </p>

      {message && (
        <div className={`${message.type}-message`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <form className="admin-form expanded" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title *</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., NAO Meeting"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Start Date * (YYYY-MM-DD)</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>End Date * (YYYY-MM-DD)</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Description (optional)</label>
          <textarea
            name="description"
            placeholder="Event details and description... (Leave blank for auto-generated description)"
            value={form.description || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Upload Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {form.imageUrl ? (
            <div className="image-preview">
              <img src={form.imageUrl} alt="Event preview" />
            </div>
          ) : null}
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="document-title">Document Title (optional)</label>
          <input
            id="document-title"
            type="text"
            name="documentTitle"
            placeholder="e.g., Event Program Schedule"
            value={form.documentTitle || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="calendar-document-input">
            Upload Document (optional) (PDF, DOC, DOCX, XLS, XLSX, TXT)
          </label>
          <input
            id="calendar-document-input"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
            onChange={handleDocumentFileChange}
          />
          {documentFile && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              Selected: {documentFile.name} ({formatFileSize(documentFile.size)})
            </p>
          )}
          {!documentFile && form.documentFileName && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              Current file: {form.documentFileName}
              {form.documentUrl ? (
                <>
                  {' '}
                  (<a href={form.documentUrl} target="_blank" rel="noopener noreferrer">View</a>)
                </>
              ) : null}
            </p>
          )}
        </div>

        <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Event' : 'Add Event'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setEditingId(null);
              }}
              className="btn btn-secondary"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h3>Upcoming & Recent Events</h3>
      {sortedEvents.length === 0 ? (
        <p>No events yet. Add one to get started!</p>
      ) : (
        <div className="events-timeline">
          {sortedEvents.map((event) => {
            const startDate = new Date(event.startDate || event.date || '');
            const endDate = new Date(event.endDate || event.date || '');
            
            const formattedStart = startDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            
            const formattedEnd = endDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            
            const dateRangeText = event.startDate === event.endDate || !event.endDate 
              ? formattedStart 
              : `${formattedStart} - ${formattedEnd}`;
            
            return (
              <div key={event.id} className="admin-item" style={{ marginBottom: '1.5rem' }}>
                <h5 className="admin-item-title">{event.title}</h5>
                <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '0.5rem' }}>
                  <strong>Date Range:</strong> {dateRangeText}
                </p>
                {event.description && <p className="admin-item-subtitle">{event.description}</p>}
                {event.imageUrl && (
                  <p className="admin-item-content"><strong>Image:</strong> {event.imageUrl.substring(0, 50)}...</p>
                )}
                {event.documentTitle && (
                  <p className="admin-item-content">
                    <strong>Document:</strong>{' '}
                    {event.documentUrl ? (
                      <a href={event.documentUrl} target="_blank" rel="noopener noreferrer">
                        {event.documentTitle}
                      </a>
                    ) : (
                      event.documentTitle
                    )}
                    {event.documentFileName ? ` (${event.documentFileName})` : ''}
                  </p>
                )}
                <div className="admin-item-actions">
                  <button onClick={() => handleEdit(event)} className="btn btn-secondary btn-small">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(event.id!)} className="btn btn-danger btn-small">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
