import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ADMIN_API_URL } from '../../hooks/useApi';
import { LOCALS_BY_ID, getLocalById, type LocalConfig } from '../../data/locals';

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
  const [localPillars, setLocalPillars] = useState<LocalPillar[]>([]);
  const [deletedProgramIds, setDeletedProgramIds] = useState<number[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewLocal, setIsNewLocal] = useState(false);

  const API_URL = `${ADMIN_API_URL}/locals`;

  const fetchLocals = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      const backendMap = new Map((response.data as Local[]).map((local) => [local.id, local]));
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
      setLocalPillars(merged.pillars || []);
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
          setLocalPillars(merged.pillars || []);
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
        setLocalPillars(merged.pillars || []);
        setIsNewLocal(true);
      } else {
        setLocalPillars([]);
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
      setForm((prev) => ({
        ...prev,
        [field]: response.data.path || prev[field],
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

  const handlePillarChange = (pillarId: number | string, field: keyof LocalPillar, value: string) => {
    setLocalPillars((prev) =>
      prev.map((pillar) =>
        pillar.id === pillarId ? { ...pillar, [field]: value } : pillar,
      ),
    );
  };

  const handleProgramChange = (
    pillarId: number | string,
    programId: number | string,
    field: 'title' | 'bullets',
    value: string,
  ) => {
    setLocalPillars((prev) =>
      prev.map((pillar) => {
        if (pillar.id !== pillarId) return pillar;
        return {
          ...pillar,
          programs: (pillar.programs || []).map((program) =>
            program.id === programId
              ? {
                  ...program,
                  [field]:
                    field === 'bullets'
                      ? value
                          .split('\n')
                          .map((line) => line.trim())
                          .filter(Boolean)
                      : value,
                }
              : program,
          ),
        };
      }),
    );
  };

  const addProgram = (pillarId: number | string) => {
    setLocalPillars((prev) =>
      prev.map((pillar) =>
        pillar.id === pillarId
          ? {
              ...pillar,
              programs: [
                ...(pillar.programs || []),
                {
                  id: `new-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
                  title: '',
                  bullets: [],
                  sequenceOrder: pillar.programs?.length || 0,
                },
              ],
            }
          : pillar,
      ),
    );
  };

  const removeProgram = (pillarId: number | string, programId: number | string) => {
    setLocalPillars((prev) =>
      prev.map((pillar) =>
        pillar.id === pillarId
          ? {
              ...pillar,
              programs: (pillar.programs || []).filter((program) => program.id !== programId),
            }
          : pillar,
      ),
    );

    if (typeof programId === 'number') {
      setDeletedProgramIds((prev) => [...prev, programId]);
    }
  };

  const handleSavePrograms = async () => {
    if (!selectedLocal) {
      setMessage({ type: 'error', text: 'Please select a local first' });
      return;
    }

    try {
      for (const programId of deletedProgramIds) {
        await axios.delete(`${ADMIN_API_URL}/pillar-programs/${programId}`);
      }

      let updatedPillars = [...localPillars];

      for (const pillar of updatedPillars) {
        let pillarId = pillar.id;

        if (typeof pillarId !== 'number') {
          const createPillarResponse = await axios.post(`${ADMIN_API_URL}/pillars`, {
            localId: pillar.localId,
            key: pillar.key,
            label: pillar.label,
            color: pillar.color,
          });
          pillarId = createPillarResponse.data.id;
          pillar.id = pillarId;
          await axios.put(`${ADMIN_API_URL}/pillars/${pillarId}`, {
            key: pillar.key,
            label: pillar.label,
            color: pillar.color,
          });
        }

        for (const [index, program] of (pillar.programs || []).entries()) {
          const payload = {
            title: program.title || '',
            bullets: program.bullets || [],
            sequenceOrder: index,
          };

          if (typeof program.id === 'number') {
            await axios.put(`${ADMIN_API_URL}/pillar-programs/${program.id}`, payload);
          } else {
            await axios.post(`${ADMIN_API_URL}/pillar-programs`, {
              pillarId,
              ...payload,
            });
          }
        }
      }

      setDeletedProgramIds([]);
      setLocalPillars(updatedPillars);
      setMessage({ type: 'success', text: 'Pillar programs saved successfully' });
      handleSelectLocal(selectedLocal);
    } catch (error) {
      console.error('Error saving pillar programs:', error);
      setMessage({ type: 'error', text: 'Failed to save pillar programs' });
    }
  };

  const handleSavePillars = async () => {
    if (!selectedLocal) {
      setMessage({ type: 'error', text: 'Please select a local first' });
      return;
    }

    try {
      await Promise.all(
        localPillars.map((pillar) => {
          if (typeof pillar.id === 'number') {
            return axios.put(`${ADMIN_API_URL}/pillars/${pillar.id}`, {
              key: pillar.key,
              label: pillar.label,
              color: pillar.color,
            });
          }
          return axios.post(`${ADMIN_API_URL}/pillars`, {
            localId: pillar.localId,
            key: pillar.key,
            label: pillar.label,
            color: pillar.color,
          });
        }),
      );
      setMessage({ type: 'success', text: 'Pillars saved successfully' });
      if (selectedLocal) handleSelectLocal(selectedLocal);
    } catch (error) {
      console.error('Error saving pillars:', error);
      setMessage({ type: 'error', text: 'Failed to save pillars' });
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
      if (isNewLocal) {
        await axios.post(API_URL, form);
        setMessage({ type: 'success', text: 'Local created successfully' });
      } else {
        await axios.put(`${API_URL}/${selectedLocal}`, form);
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
                src={form.heroImageUrl}
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
                src={form.logoImageUrl}
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

          <div className="pillars-editor" style={{ gridColumn: '1 / -1', marginTop: '2rem', padding: '1rem', background: '#fff6f0', borderRadius: '6px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Local Pillars</h4>
            {localPillars.length > 0 ? (
              localPillars.map((pillar) => (
                <div key={pillar.id} className="pillar-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label>Pillar Key</label>
                    <input type="text" value={pillar.key} disabled />
                  </div>
                  <div className="form-group">
                    <label>Pillar Label</label>
                    <input
                      type="text"
                      value={pillar.label}
                      onChange={(e) => handlePillarChange(pillar.id, 'label', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pillar Color</label>
                    <input
                      type="color"
                      value={pillar.color || '#000000'}
                      onChange={(e) => handlePillarChange(pillar.id, 'color', e.target.value)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No pillar configuration available for this local.</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <button type="button" onClick={handleSavePillars} className="btn btn-secondary">
                Save Pillars
              </button>
            </div>
          </div>

          <div className="pillar-programs-editor" style={{ gridColumn: '1 / -1', marginTop: '2rem', padding: '1rem', background: '#f0fbff', borderRadius: '6px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Pillar Programs</h4>
            {localPillars.length > 0 ? (
              localPillars.map((pillar) => (
                <div key={pillar.id} style={{ marginBottom: '1.75rem', padding: '1rem', border: '1px solid #dfe6ef', borderRadius: '6px' }}>
                  <h5 style={{ marginBottom: '0.75rem' }}>{pillar.label || pillar.key}</h5>
                  {(pillar.programs && pillar.programs.length > 0) ? (
                    pillar.programs.map((program) => (
                      <div key={program.id} style={{ marginBottom: '1rem', padding: '0.75rem', background: '#ffffff', borderRadius: '6px', border: '1px solid #dce3eb' }}>
                        <div className="form-group">
                          <label>Program Title</label>
                          <input
                            type="text"
                            value={program.title || ''}
                            onChange={(e) => handleProgramChange(pillar.id, program.id ?? '', 'title', e.target.value)}
                          />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                          <label>Program Bullets (one per line)</label>
                          <textarea
                            rows={4}
                            value={(program.bullets || []).join('\n')}
                            onChange={(e) => handleProgramChange(pillar.id, program.id ?? '', 'bullets', e.target.value)}
                            style={{ width: '100%', minHeight: '96px' }}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-tertiary"
                          style={{ marginTop: '0.5rem' }}
                          onClick={() => removeProgram(pillar.id, program.id ?? '')}
                        >
                          Remove Program
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No programs configured for this pillar yet.</p>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => addProgram(pillar.id)}
                  >
                    Add Program
                  </button>
                </div>
              ))
            ) : (
              <p>No pillar configuration available for this local.</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <button type="button" onClick={handleSavePrograms} className="btn btn-secondary">
                Save Pillar Programs
              </button>
            </div>
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
