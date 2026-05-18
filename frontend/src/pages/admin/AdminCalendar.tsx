import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';

interface CalendarEvent {
  id?: number;
  title: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  imageUrl?: string;
}

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [form, setForm] = useState<CalendarEvent>({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${ADMIN_API_URL}/calendar`;

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
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
        console.log(`[UPDATE] Sending PUT request to: ${API_URL}/${editingId}`);
        console.log('[UPDATE] Waiting for response...');
        const response = await axios.put(`${API_URL}/${editingId}`, formData);
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
        const response = await axios.post(API_URL, formData);
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
      setForm({ title: '', startDate: '', endDate: '', description: '', imageUrl: '' });
      setImageFile(null);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage({ type: 'success', text: 'Event deleted successfully' });
        fetchEvents();
        if (editingId === id) {
          setForm({ title: '', startDate: '', endDate: '', description: '', imageUrl: '' });
          setImageFile(null);
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
              <img src={form.imageUrl} alt="Event preview" style={{ maxWidth: '100%', marginTop: '0.75rem' }} />
            </div>
          ) : null}
        </div>

        <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Event' : 'Add Event'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({ title: '', startDate: '', endDate: '', description: '', imageUrl: '' });
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
