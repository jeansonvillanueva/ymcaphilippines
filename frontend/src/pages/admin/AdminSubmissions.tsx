import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';

interface FeedbackEntry {
  feedback_id?: number;
  name: string;
  surname: string;
  email: string;
  phone_number?: string;
  message?: string;
  created_at?: string;
}

interface UpdateEntry {
  id?: number;
  name: string;
  local_ymca: string;
  title: string;
  subtitle: string;
  article_link: string;
  email: string;
  message?: string;
  created_at?: string;
}

interface DonationEntry {
  donation_id?: number;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  amount_usd: number;
  currency: string;
  payment_method?: string;
  country?: string;
  address1?: string;
  address2?: string;
  city?: string;
  region?: string;
  zip?: string;
  comments?: string;
  created_at?: string;
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleString();
}

function renderCountLabel(label: string, value: number) {
  return (
    <div style={{ flex: '1', minWidth: '190px', margin: '0.5rem 0', padding: '1rem', borderRadius: '18px', background: '#eef2ff', color: '#1f2937' }}>
      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{label}</p>
      <p style={{ margin: 0, fontSize: '2rem' }}>{value}</p>
    </div>
  );
}

export default function AdminSubmissions() {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [updates, setUpdates] = useState<UpdateEntry[]>([]);
  const [donations, setDonations] = useState<DonationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const [feedbackRes, updatesRes, donationsRes] = await Promise.all([
          axios.get(`${ADMIN_API_URL}/feedback`),
          axios.get(`${ADMIN_API_URL}/submit-updates`),
          axios.get(`${ADMIN_API_URL}/donations`),
        ]);

        setFeedback(feedbackRes.data || []);
        setUpdates(updatesRes.data || []);
        setDonations(donationsRes.data || []);
      } catch (err) {
        console.error('Error loading submission dashboard:', err);
        setError('Unable to load submitted feedback, updates, and donations.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className="loading">Loading admin dashboard submissions...</div>;
  }

  return (
    <div className="admin-section">
      <h2>Admin Dashboard</h2>
      <p className="admin-section-description">
        Review submissions from the Contact Us feedback form, YMCA update submissions, and donation forms.
      </p>

      {error ? (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      ) : null}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        {renderCountLabel('Feedback entries', feedback.length)}
        {renderCountLabel('YMCA updates', updates.length)}
        {renderCountLabel('Donation submissions', donations.length)}
      </div>

      <section style={{ marginBottom: '2rem' }}>
        <h3>Feedback Submissions</h3>
        {feedback.length === 0 ? (
          <p>No feedback submissions yet.</p>
        ) : (
          <table className="admin-list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item) => (
                <tr key={item.feedback_id ?? item.email + item.created_at}>
                  <td>{item.feedback_id ?? '-'}</td>
                  <td>{item.name} {item.surname}</td>
                  <td>{item.email}</td>
                  <td>{item.phone_number || '-'}</td>
                  <td>{item.message || '-'}</td>
                  <td>{formatDate(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3>YMCA Update Submissions</h3>
        {updates.length === 0 ? (
          <p>No YMCA update submissions yet.</p>
        ) : (
          <table className="admin-list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Local YMCA</th>
                <th>Title</th>
                <th>Article URL</th>
                <th>Email</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((item) => (
                <tr key={item.id ?? item.email + item.title}>
                  <td>{item.id ?? '-'}</td>
                  <td>{item.name}</td>
                  <td>{item.local_ymca}</td>
                  <td>{item.title}</td>
                  <td>
                    <a href={item.article_link} target="_blank" rel="noreferrer">
                      View link
                    </a>
                  </td>
                  <td>{item.email}</td>
                  <td>{formatDate(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h3>Donation Submissions</h3>
        {donations.length === 0 ? (
          <p>No donation submissions yet.</p>
        ) : (
          <table className="admin-list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Phone</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((item) => (
                <tr key={item.donation_id ?? item.email + item.created_at}>
                  <td>{item.donation_id ?? '-'}</td>
                  <td>{item.name} {item.surname}</td>
                  <td>{item.email}</td>
                  <td>{item.currency} {Number(item.amount_usd).toFixed(2)}</td>
                  <td>{item.payment_method || '-'}</td>
                  <td>{item.phone || '-'}</td>
                  <td>{formatDate(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
