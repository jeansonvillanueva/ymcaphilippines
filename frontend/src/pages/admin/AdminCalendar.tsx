import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';

interface CalendarEvent {
  id?: number;
  title: string;
  date: string;
  description?: string;
  imageUrl?: string;
}

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [form, setForm] = useState<CalendarEvent>({
    title: '',
    date: '',
    description: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${ADMIN_API_URL}/calendar`;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_URL);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage({ type: 'error', text: 'Failed to load events' });
      setLoading(false);
    }
  };

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
    if (!form.title.trim() || !form.date.trim()) {
      setMessage({ type: 'error', text: 'Title and date are required' });
      return;
    }

    try {
      // Auto-generate description if not provided
      let description = (form.description || '').trim();
      if (!description) {
        const dateObj = new Date(form.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
        description = `${form.title} to be held on ${formattedDate}. Details to follow.`;
      }

      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('date', form.date);
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (form.imageUrl && !form.imageUrl.startsWith('data:')) {
        formData.append('imageUrl', form.imageUrl);
      }

      console.log('Submitting event data:', {
        title: form.title.trim(),
        date: form.date,
        description: description,
        hasImage: !!imageFile,
        imageUrl: form.imageUrl,
        isEditing: !!editingId
      });
      
      console.log('FormData entries:', Array.from(formData.entries()));

      if (editingId) {
        console.log('Sending PUT request to:', `${API_URL}/${editingId}`);
        await axios.put(`${API_URL}/${editingId}`, formData);
        setMessage({ type: 'success', text: 'Event updated successfully' });
      } else {
        console.log('Sending POST request to:', API_URL);
        await axios.post(API_URL, formData);
        setMessage({ type: 'success', text: 'Event added successfully' });
      }
      setForm({ title: '', date: '', description: '', imageUrl: '' });
      setImageFile(null);
      setEditingId(null);
      fetchEvents();
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
          setForm({ title: '', date: '', description: '', imageUrl: '' });
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

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const sortedDates = Object.keys(eventsByDate).sort().reverse();

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
          <label>Date * (YYYY-MM-DD)</label>
          <input
            type="date"
            name="date"
            value={form.date}
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
                setForm({ title: '', date: '', description: '', imageUrl: '' });
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
      {sortedDates.length === 0 ? (
        <p>No events yet. Add one to get started!</p>
      ) : (
        <div className="events-timeline">
          {sortedDates.map((date) => (
            <div key={date} className="event-date-group">
              <h4 className="event-date-header">{new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</h4>
              <div className="events-for-date">
                {eventsByDate[date].map((event) => (
                  <div key={event.id} className="admin-item">
                    <h5 className="admin-item-title">{event.title}</h5>
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
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
