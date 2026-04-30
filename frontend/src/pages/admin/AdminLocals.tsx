import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';
import { LOCALS_BY_ID, getLocalById, mergeLocalRecords } from '../../data/locals';
import AdminFacilities from './AdminFacilities';

interface LocalProgram {
  id?: number | string;
  title?: string;
  bullets?: string[];
  sequenceOrder?: number;
}

interface LocalPillar {
  id: number | string;
  localId: string;
  key: string;
  label: string;
  color?: string;
  programs?: LocalProgram[];
}

interface Local {
  id: string;
  name: string;
  established?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  heroImageUrl?: string;
  logoImageUrl?: string;
  corporate: number;
  nonCorporate: number;
  youth: number;
  others: number;
  totalMembersAsOf?: string;
  pillars?: LocalPillar[];
}

type UploadField = 'heroImageUrl' | 'logoImageUrl';

const normalizeImageUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const apiBasePath = new URL(ADMIN_API_URL).pathname.replace(/\/admin$/, '');
  const siteBasePath = apiBasePath.replace(/\/php-api$/, '');
  if (url.startsWith(apiBasePath)) return url;
  if (url.startsWith('/backend/uploads/')) return url;
  if (url.startsWith('/uploads/')) return `${siteBasePath}/backend${url}`;
  if (url.startsWith('/php-api/uploads/')) {
    return `${siteBasePath}/backend/${url.substring('/php-api/uploads/'.length)}`;
  }

  return url;
};

export default function AdminLocals() {
  const [locals, setLocals] = useState<Local[]>([]);
  const [selectedLocal, setSelectedLocal] = useState<string | null>(null);
  const [form, setForm] = useState<Local>({
    id: '',
    name: '',
    established: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
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
  const [isNewLocal, setIsNewLocal] = useState(false);

  const API_URL = `${ADMIN_API_URL}/locals`;

  const fetchLocals = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      const rawData = response.data;
      const localsArray = Array.isArray(rawData)
        ? rawData
        : rawData?.locals || rawData?.data || [];

      if (!Array.isArray(localsArray)) {
        console.error('Unexpected locals response shape:', rawData);
        throw new Error('Invalid locals payload');
      }

      const backendMap = new Map((localsArray as Local[]).map((local) => [local.id, local]));
      const mergedLocals = Object.values(LOCALS_BY_ID).map((staticLocal) =>
        mergeLocalRecords(staticLocal, backendMap.get(staticLocal.id) ?? null),
      );
      setLocals(mergedLocals);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locals:', error);
      setMessage({ type: 'error', text: 'Failed to load locals' });
      const staticLocals = Object.values(LOCALS_BY_ID).map((staticLocal) => mergeLocalRecords(staticLocal));
      setLocals(staticLocals);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocals();
  }, [fetchLocals]);

  const handleSelectLocal = async (localId: string) => {
    setSelectedLocal(localId);
    const staticLocal = LOCALS_BY_ID[localId] ?? getLocalById(localId);
    try {
      const response = await axios.get(`${API_URL}/${localId}`);
      const backendLocal = response.data as Local;
      const merged = staticLocal ? mergeLocalRecords(staticLocal, backendLocal) : backendLocal;
      setForm({
        ...merged,
        corporate: Number(merged.corporate) || 0,
        nonCorporate: Number(merged.nonCorporate) || 0,
        youth: Number(merged.youth) || 0,
        others: Number(merged.others) || 0,
      });
      setIsNewLocal(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        if (staticLocal) {
          const merged = mergeLocalRecords(staticLocal);
          setForm({
            ...merged,
            corporate: Number(merged.corporate) || 0,
            nonCorporate: Number(merged.nonCorporate) || 0,
            youth: Number(merged.youth) || 0,
            others: Number(merged.others) || 0,
          });
          setMessage({ type: 'success', text: 'Loaded default values from local data. Save to create this local record.' });
          setIsNewLocal(true);
          return;
        }
      }
      console.error('Error fetching local:', error);
      setMessage({ type: 'error', text: 'Failed to load local details' });
      if (staticLocal) {
        const merged = mergeLocalRecords(staticLocal);
        setForm({
          ...merged,
          corporate: Number(merged.corporate) || 0,
          nonCorporate: Number(merged.nonCorporate) || 0,
          youth: Number(merged.youth) || 0,
          others: Number(merged.others) || 0,
        });
        setIsNewLocal(true);
      }
    }
  };

  const uploadLocalImage = async (file: File, field: UploadField) => {
    if (!selectedLocal) {
      setMessage({ type: 'error', text: 'Select a local before uploading an image.' });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${API_URL}/${selectedLocal}/upload?field=${field}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const normalizedPath = normalizeImageUrl(response.data.path || '');
      setForm((prev) => ({
        ...prev,
        [field]: normalizedPath || prev[field],
      }));
      setMessage({ type: 'success', text: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Image upload failed' });
    }
  };

  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadLocalImage(file, 'heroImageUrl');
    }
  };

  const handleLogoImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadLocalImage(file, 'logoImageUrl');
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
      // Convert form object to FormData to ensure proper transmission
      const formData = new FormData();
      (Object.keys(form) as (keyof Local)[]).forEach(key => {
        const value = form[key];
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      console.log('Sending form data keys:', Object.keys(form));
      console.log('Sending form data:', form);

      if (isNewLocal) {
        await axios.post(API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ type: 'success', text: 'Local created successfully' });
      } else {
        await axios.put(`${API_URL}/${selectedLocal}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage({ type: 'success', text: 'Local updated successfully' });
      }
      setIsNewLocal(false);
      fetchLocals();
    } catch (error) {
      console.error('Error saving local:', error);
      setMessage({ type: 'error', text: 'Failed to save local' });
    }
  };

  if (loading) return <div className="loading">Loading locals...</div>;

  const localOptions = locals.map((local) => ({ id: local.id, name: local.name }));

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
            <label>Instagram URL</label>
            <input
              type="text"
              name="instagramUrl"
              placeholder="https://instagram.com/..."
              value={form.instagramUrl || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Twitter/X URL</label>
            <input
              type="text"
              name="twitterUrl"
              placeholder="https://twitter.com/..."
              value={form.twitterUrl || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Hero Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroImageChange}
            />
            {form.heroImageUrl && (
              <img
                src={normalizeImageUrl(form.heroImageUrl)}
                alt="Current hero"
                style={{ marginTop: '0.75rem', width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '6px' }}
              />
            )}
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Logo Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoImageChange}
            />
            {form.logoImageUrl && (
              <img
                src={normalizeImageUrl(form.logoImageUrl)}
                alt="Current logo"
                style={{ marginTop: '0.75rem', width: '120px', height: 'auto', objectFit: 'contain', borderRadius: '6px' }}
              />
            )}
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
            <p><strong>Corporate:</strong> {Number(form.corporate) || 0}</p>
            <p><strong>Non-Corporate:</strong> {Number(form.nonCorporate) || 0}</p>
            <p><strong>Youth:</strong> {Number(form.youth) || 0}</p>
            <p><strong>Others:</strong> {Number(form.others) || 0}</p>
            <p><strong>Total:</strong> {(Number(form.corporate) || 0) + (Number(form.nonCorporate) || 0) + (Number(form.youth) || 0) + (Number(form.others) || 0)}</p>
          </div>

          {/* Facilities Management Section */}
          <div style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
            <AdminFacilities localId={selectedLocal} />
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
            {locals.map((local) => {
              const corp = Number(local.corporate) || 0;
              const nonCorp = Number(local.nonCorporate) || 0;
              const youth = Number(local.youth) || 0;
              const others = Number(local.others) || 0;
              const total = corp + nonCorp + youth + others;
              return (
                <tr key={local.id} onClick={() => handleSelectLocal(local.id)} style={{ cursor: 'pointer' }}>
                  <td>{local.name}</td>
                  <td>{corp}</td>
                  <td>{nonCorp}</td>
                  <td>{youth}</td>
                  <td>{others}</td>
                  <td><strong>{total}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
