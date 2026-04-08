import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';

interface Local {
  id: string;
  name: string;
  established?: string;
  facebookUrl?: string;
  heroImageUrl?: string;
  logoImageUrl?: string;
  corporate: number;
  nonCorporate: number;
  youth: number;
  others: number;
  totalMembersAsOf?: string;
}

export default function AdminLocals() {
  const [locals, setLocals] = useState<Local[]>([]);
  const [selectedLocal, setSelectedLocal] = useState<string | null>(null);
  const [form, setForm] = useState<Local>({
    id: '',
    name: '',
    established: '',
    facebookUrl: '',
    heroImageUrl: '',
    logoImageUrl: '',
    corporate: 0,
    nonCorporate: 0,
    youth: 0,
    others: 0,
    totalMembersAsOf: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${ADMIN_API_URL}/locals`;

  useEffect(() => {
    fetchLocals();
  }, []);

  const fetchLocals = async () => {
    try {
      const response = await axios.get(API_URL);
      setLocals(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locals:', error);
      setMessage({ type: 'error', text: 'Failed to load locals' });
      setLoading(false);
    }
  };

  const handleSelectLocal = async (localId: string) => {
    setSelectedLocal(localId);
    try {
      const response = await axios.get(`${API_URL}/${localId}`);
      setForm(response.data);
    } catch (error) {
      console.error('Error fetching local:', error);
      setMessage({ type: 'error', text: 'Failed to load local details' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocal) {
      setMessage({ type: 'error', text: 'Please select a local first' });
      return;
    }

    try {
      await axios.put(`${API_URL}/${selectedLocal}`, form);
      setMessage({ type: 'success', text: 'Local updated successfully' });
      fetchLocals();
    } catch (error) {
      console.error('Error saving local:', error);
      setMessage({ type: 'error', text: 'Failed to save local' });
    }
  };

  if (loading) return <div className="loading">Loading locals...</div>;

  const localOptions = [
    { id: 'manila', name: 'YMCA of Manila' },
    { id: 'makati', name: 'YMCA of Makati' },
    { id: 'quezon_city', name: 'YMCA of Quezon City' },
    { id: 'manila_downtown', name: 'Manila Downtown YMCA' },
    { id: 'baguio', name: 'YMCA of the City of Baguio' },
    { id: 'tuguegarao', name: 'City of Tuguegarao YMCA' },
    { id: 'pangasinan', name: 'YMCA of Pangasinan' },
    { id: 'nueva_ecija', name: 'YMCA of Nueva Ecija' },
    { id: 'los_banos', name: 'YMCA of Los Baños' },
    { id: 'san_pablo', name: 'YMCA of San Pablo' },
    { id: 'nueva_caceres', name: 'YMCA of Nueva Caceres' },
    { id: 'albay', name: 'YMCA of Albay' },
    { id: 'cebu', name: 'YMCA of Cebu' },
    { id: 'leyte', name: 'YMCA of Leyte' },
    { id: 'negros_occidental', name: 'YMCA of Negros Occidental' },
    { id: 'negros_oriental', name: 'YMCA of Negros Oriental' },
    { id: 'davao', name: 'YMCA of Davao' },
    { id: 'cagayan_de_oro', name: 'YMCA Cagayan de Oro' },
  ];

  return (
    <div className="admin-section">
      <h2>Manage Find Your YMCA (Local Pages)</h2>
      <p className="admin-section-description">
        Update member counts (Corporate, Non-Corporate, Youth, Others) and other information for each local YMCA.
      </p>

      {message && (
        <div className={`${message.type}-message`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label>Select Local YMCA:</label>
        <select
          value={selectedLocal || ''}
          onChange={(e) => handleSelectLocal(e.target.value)}
          style={{ gridColumn: '1 / -1' }}
        >
          <option value="">-- Choose a Local --</option>
          {localOptions.map((local) => (
            <option key={local.id} value={local.id}>
              {local.name}
            </option>
          ))}
        </select>
      </div>

      {selectedLocal && (
        <form className="admin-form expanded" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Local Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Established Year</label>
            <input
              type="text"
              name="established"
              placeholder="e.g., 1985"
              value={form.established || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Facebook URL</label>
            <input
              type="text"
              name="facebookUrl"
              placeholder="https://facebook.com/..."
              value={form.facebookUrl || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Hero Image URL</label>
            <input
              type="text"
              name="heroImageUrl"
              placeholder="https://..."
              value={form.heroImageUrl || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Logo Image URL</label>
            <input
              type="text"
              name="logoImageUrl"
              placeholder="https://..."
              value={form.logoImageUrl || ''}
              onChange={handleChange}
            />
          </div>

          <h4 style={{ gridColumn: '1 / -1', marginTop: '1.5rem', marginBottom: '1rem' }}>Member Statistics</h4>

          <div className="form-group">
            <label>Corporate Members</label>
            <input
              type="number"
              name="corporate"
              value={form.corporate}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Non-Corporate Members</label>
            <input
              type="number"
              name="nonCorporate"
              value={form.nonCorporate}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Youth Members</label>
            <input
              type="number"
              name="youth"
              value={form.youth}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Other Members</label>
            <input
              type="number"
              name="others"
              value={form.others}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>As of Date</label>
            <input
              type="text"
              name="totalMembersAsOf"
              placeholder="e.g., December 2025"
              value={form.totalMembersAsOf || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary">
              Update Local Information
            </button>
          </div>

          <div className="stats-preview" style={{ gridColumn: '1 / -1', marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '6px' }}>
            <h5>Member Summary</h5>
            <p><strong>Corporate:</strong> {form.corporate}</p>
            <p><strong>Non-Corporate:</strong> {form.nonCorporate}</p>
            <p><strong>Youth:</strong> {form.youth}</p>
            <p><strong>Others:</strong> {form.others}</p>
            <p><strong>Total:</strong> {form.corporate + form.nonCorporate + form.youth + form.others}</p>
          </div>
        </form>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>All Locals Overview</h3>
        <table className="admin-list-table">
          <thead>
            <tr>
              <th>Local YMCA</th>
              <th>Corporate</th>
              <th>Non-Corporate</th>
              <th>Youth</th>
              <th>Others</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {locals.map((local) => (
              <tr key={local.id} onClick={() => handleSelectLocal(local.id)} style={{ cursor: 'pointer' }}>
                <td>{local.name}</td>
                <td>{local.corporate}</td>
                <td>{local.nonCorporate}</td>
                <td>{local.youth}</td>
                <td>{local.others}</td>
                <td><strong>{local.corporate + local.nonCorporate + local.youth + local.others}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
