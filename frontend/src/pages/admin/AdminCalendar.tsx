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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date.trim()) {
      setMessage({ type: 'error', text: 'Title and date are required' });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setMessage({ type: 'success', text: 'Event updated successfully' });
      } else {
        await axios.post(API_URL, form);
        setMessage({ type: 'success', text: 'Event added successfully' });
      }
      setForm({ title: '', date: '', description: '', imageUrl: '' });
      setEditingId(null);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      setMessage({ type: 'error', text: 'Failed to save event' });
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
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Event details and description..."
            value={form.description || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Image URL (for event photo/banner)</label>
          <input
            type="text"
            name="imageUrl"
            placeholder="https://..."
            value={form.imageUrl || ''}
            onChange={handleChange}
          />
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
