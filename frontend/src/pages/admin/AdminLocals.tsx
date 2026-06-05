import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { ADMIN_API_URL, adminRequestConfig, buildAdminUrl } from '../../hooks/useApi';
import {
  LOCALS_BY_ID,
  countAllProgramBullets,
  getLocalById,
  mergeLocalRecords,
  mergePillarPrograms,
  pillarsToApiPayload,
} from '../../data/locals';
import AdminFacilities from './AdminFacilities';
import AdminLocalPrograms from './AdminLocalPrograms';
import { useAdminEditingLabel, type AdminEditingItemChange } from './useAdminEditingLabel';

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
  embeddedMapUrl?: string;
  corporate: number;
  nonCorporate: number;
  youth: number;
  others: number;
  totalMembersAsOf?: string;
  pillars?: LocalPillar[];
}

type UploadField = 'heroImageUrl';

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

type Props = {
  onEditingItemChange?: AdminEditingItemChange;
};

export default function AdminLocals({ onEditingItemChange }: Props) {
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
    embeddedMapUrl: '',
    corporate: 0,
    nonCorporate: 0,
    youth: 0,
    others: 0,
    totalMembersAsOf: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewLocal, setIsNewLocal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [importingPrograms, setImportingPrograms] = useState(false);
  const programsSectionRef = useRef<HTMLDivElement>(null);

  const totalProgramBullets = countAllProgramBullets();

  useAdminEditingLabel(onEditingItemChange, selectedLocal !== null, form.name);

  const fetchLocals = useCallback(async () => {
    try {
      const response = await axios.get(buildAdminUrl('/locals'), adminRequestConfig);
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

  const countLocalProgramBullets = (localId: string) => {
    const staticLocal = getLocalById(localId);
    const pillars = mergePillarPrograms(staticLocal?.pillars);
    let total = 0;
    for (const pillar of pillars) {
      for (const program of pillar.programs ?? []) {
        total += program.bullets?.length ?? 0;
      }
    }
    return total;
  };

  const handleSelectLocal = async (localId: string) => {
    setSelectedLocal(localId);
    const staticLocal = LOCALS_BY_ID[localId] ?? getLocalById(localId);
    try {
      const response = await axios.get(buildAdminUrl(`/locals/${localId}`), adminRequestConfig);
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
      window.setTimeout(() => {
        programsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
          window.setTimeout(() => {
            programsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
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
      window.setTimeout(() => {
        programsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
      const response = await axios.post(
        `${buildAdminUrl(`/locals/${selectedLocal}/upload`)}?field=${field}`,
        formData,
        adminRequestConfig,
      );
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleImportAllPrograms = async () => {
    if (!window.confirm('Import default pillar programs for every local YMCA into the database?')) {
      return;
    }

    setImportingPrograms(true);
    setMessage(null);
    let saved = 0;
    let failed = 0;

    for (const staticLocal of Object.values(LOCALS_BY_ID)) {
      try {
        const merged = mergePillarPrograms(staticLocal.pillars);
        await axios.put(
          buildAdminUrl(`/locals/${staticLocal.id}/pillar-programs`),
          { name: staticLocal.name, pillars: pillarsToApiPayload(merged) },
          { ...adminRequestConfig, headers: { 'Content-Type': 'application/json' } },
        );
        saved++;
      } catch (error) {
        console.error(`Failed to import programs for ${staticLocal.id}:`, error);
        failed++;
      }
    }

    setImportingPrograms(false);
    if (failed === 0) {
      setMessage({ type: 'success', text: `Imported programs for ${saved} local YMCAs.` });
    } else {
      setMessage({
        type: 'error',
        text: `Imported ${saved} locals; ${failed} failed. Ensure each local exists in the database (save member info first).`,
      });
    }
  };

  const buildMemberStatsPayload = () => ({
    id: form.id || selectedLocal!,
    name: form.name,
    established: form.established ?? '',
    facebookUrl: form.facebookUrl ?? '',
    instagramUrl: form.instagramUrl ?? '',
    twitterUrl: form.twitterUrl ?? '',
    heroImageUrl: form.heroImageUrl ?? '',
    logoImageUrl: form.logoImageUrl ?? '',
    embeddedMapUrl: form.embeddedMapUrl ?? '',
    corporate: Number(form.corporate) || 0,
    nonCorporate: Number(form.nonCorporate) || 0,
    youth: Number(form.youth) || 0,
    others: Number(form.others) || 0,
    totalMembersAsOf: form.totalMembersAsOf ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocal) {
      setMessage({ type: 'error', text: 'Please select a local first' });
      return;
    }

    const payload = buildMemberStatsPayload();
    const jsonConfig = {
      ...adminRequestConfig,
      headers: { 'Content-Type': 'application/json' },
    };

    const creating = isNewLocal;

    try {
      let response;
      if (creating) {
        response = await axios.post(buildAdminUrl('/locals'), payload, jsonConfig);
        setMessage({ type: 'success', text: 'Local created successfully' });
      } else {
        const updateUrl = buildAdminUrl(`/locals/${selectedLocal}`);
        try {
          response = await axios.post(updateUrl, payload, jsonConfig);
        } catch (postError) {
          if (axios.isAxiosError(postError) && postError.response?.status === 404) {
            response = await axios.put(updateUrl, payload, jsonConfig);
          } else {
            throw postError;
          }
        }
        const body = response.data as {
          warning?: string;
          statsMatchRequest?: boolean;
          stats?: {
            corporate?: number;
            nonCorporate?: number;
            youth?: number;
            others?: number;
            totalMembersAsOf?: string;
          };
          local?: Local;
        };
        const warning = typeof body?.warning === 'string' ? body.warning : null;
        const statsMatch = body?.statsMatchRequest === true;
        const requestedCorporate = Number(payload.corporate) || 0;
        const savedCorporate = Number(body?.stats?.corporate ?? body?.local?.corporate);
        const statsPersisted =
          statsMatch ||
          (Number.isFinite(savedCorporate) && savedCorporate === requestedCorporate);

        if (warning && !statsMatch) {
          setMessage({
            type: 'error',
            text: `${warning} Upload the latest php-api (index.php and admin_locals_update.php) if this persists.`,
          });
        } else if (warning && statsMatch) {
          setMessage({ type: 'success', text: warning });
        } else if (!statsPersisted) {
          setMessage({
            type: 'error',
            text:
              'Save did not persist member statistics. Upload the latest php-api folder to your server, then try again.',
          });
        } else {
          setMessage({
            type: 'success',
            text: 'Local updated successfully. Public pages will show these member counts after refresh.',
          });
        }

        const savedRecord = body?.local ?? null;
        if (savedRecord) {
          const staticLocal = LOCALS_BY_ID[selectedLocal] ?? getLocalById(selectedLocal);
          const merged = staticLocal
            ? mergeLocalRecords(staticLocal, savedRecord)
            : savedRecord;
          setForm({
            ...merged,
            corporate: Number(merged.corporate) || 0,
            nonCorporate: Number(merged.nonCorporate) || 0,
            youth: Number(merged.youth) || 0,
            others: Number(merged.others) || 0,
          });
        }
      }
      setIsNewLocal(false);
      await fetchLocals();
      if (!creating && !response.data?.local) {
        try {
          const detail = await axios.get(buildAdminUrl(`/locals/${selectedLocal}`), adminRequestConfig);
          const backendLocal = detail.data as Local;
          const staticLocal = LOCALS_BY_ID[selectedLocal] ?? getLocalById(selectedLocal);
          const merged = staticLocal
            ? mergeLocalRecords(staticLocal, backendLocal)
            : backendLocal;
          setForm({
            ...merged,
            corporate: Number(merged.corporate) || 0,
            nonCorporate: Number(merged.nonCorporate) || 0,
            youth: Number(merged.youth) || 0,
            others: Number(merged.others) || 0,
          });
        } catch {
          // fetchLocals already refreshed the table
        }
      }
    } catch (error) {
      console.error('Error saving local:', error);
      let text = 'Failed to save local';
      if (axios.isAxiosError(error)) {
        const apiError = (error.response?.data as { error?: string })?.error;
        if (apiError) text = apiError;
        else if (error.response?.status === 404) {
          text = 'Local not found in database. Save again to create it, or check that php-api is deployed.';
        }
      }
      setMessage({ type: 'error', text });
    }
  };

  if (loading) return <div className="loading">Loading locals...</div>;

  return (
    <div className="admin-section">
      <h2>Manage Find Your YMCA (Local Pages)</h2>
      <p className="admin-section-description">
        Click a local YMCA in the table below to edit its <strong>Programs Implemented</strong> (4 pillars) and member
        information. Home page <strong>Community Programs</strong> shows the total count across all locals (
        {totalProgramBullets.toLocaleString('en-PH')} from site data until saved to the database).
      </p>

      <div className="admin-locals-toolbar">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleImportAllPrograms}
          disabled={importingPrograms}
        >
          {importingPrograms ? 'Importing programs…' : 'Import all default programs to database'}
        </button>
      </div>

      {message && (
        <div className={`${message.type}-message`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <div className="form-group admin-locals-search">
        <label>Search Local YMCA</label>
        <input
          type="text"
          placeholder="Search by local name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-locals-table-wrap">
        <h3 className="admin-locals-table-title">Select a local YMCA to edit programs</h3>
        <table className="admin-list-table">
          <thead>
            <tr>
              <th>Local YMCA</th>
              <th>Programs</th>
              <th>Corporate</th>
              <th>Non-Corporate</th>
              <th>Youth</th>
              <th>Others</th>
              <th>Total Members</th>
            </tr>
          </thead>
          <tbody>
            {locals
              .filter((local) => local.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((local) => {
                const corp = Number(local.corporate) || 0;
                const nonCorp = Number(local.nonCorporate) || 0;
                const youth = Number(local.youth) || 0;
                const others = Number(local.others) || 0;
                const total = corp + nonCorp + youth + others;
                const programCount = countLocalProgramBullets(local.id);
                const isSelected = selectedLocal === local.id;
                return (
                  <tr
                    key={local.id}
                    className={isSelected ? 'admin-list-table__row--selected' : ''}
                    onClick={() => handleSelectLocal(local.id)}
                  >
                    <td>
                      {local.name}
                      {isSelected ? <span className="admin-locals-editing-badge">Editing</span> : null}
                    </td>
                    <td>{programCount}</td>
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

      {!selectedLocal && (
        <p className="admin-locals-pick-hint">
          ↑ Click any row above to open the 4 pillar program editors (Community Wellbeing, Meaningful Work, Sustainable
          Planet, Just World).
        </p>
      )}

      {selectedLocal && (
        <>
          <div className="admin-locals-selected-banner">
            <strong>Editing:</strong> {form.name || selectedLocal}
          </div>

          <div ref={programsSectionRef}>
            <AdminLocalPrograms localId={selectedLocal} localName={form.name} />
          </div>

          <h3 className="admin-locals-member-heading">Member information &amp; page settings</h3>
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
            <label>Embedded Map Link</label>
            <textarea
              name="embeddedMapUrl"
              placeholder="Paste Google Maps embed URL or full iframe embed code"
              value={form.embeddedMapUrl || ''}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%', resize: 'vertical' }}
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
            <p><strong>Corporate:</strong> {Number(form.corporate) || 0}</p>
            <p><strong>Non-Corporate:</strong> {Number(form.nonCorporate) || 0}</p>
            <p><strong>Youth:</strong> {Number(form.youth) || 0}</p>
            <p><strong>Others:</strong> {Number(form.others) || 0}</p>
            <p><strong>Total:</strong> {(Number(form.corporate) || 0) + (Number(form.nonCorporate) || 0) + (Number(form.youth) || 0) + (Number(form.others) || 0)}</p>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
            <AdminFacilities localId={selectedLocal} />
          </div>
        </form>
        </>
      )}
    </div>
  );
}
