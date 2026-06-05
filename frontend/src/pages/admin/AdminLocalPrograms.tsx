import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { buildAdminUrl, buildPublicUrl, adminRequestConfig } from '../../hooks/useApi';
import {
  getDefaultPillars,
  getLocalById,
  mergePillarPrograms,
  pillarsToApiPayload,
  type LocalPillarKey,
} from '../../data/locals';
import './AdminLocalPrograms.css';

type PillarForm = {
  key: LocalPillarKey;
  label: string;
  bulletsText: string;
};

const PILLAR_KEYS: LocalPillarKey[] = ['community', 'work', 'planet', 'world'];

const jsonConfig = {
  ...adminRequestConfig,
  headers: { 'Content-Type': 'application/json' },
};

function programsToBulletsText(programs: Array<{ bullets?: string[] }> | undefined): string {
  const lines: string[] = [];
  for (const program of programs ?? []) {
    for (const bullet of program.bullets ?? []) {
      const trimmed = bullet.trim();
      if (trimmed) lines.push(trimmed);
    }
  }
  return lines.join('\n');
}

function pillarsToForm(pillars: ReturnType<typeof mergePillarPrograms>): PillarForm[] {
  const byKey = new Map(pillars.map((p) => [p.key, p]));
  return PILLAR_KEYS.map((key) => {
    const pillar = byKey.get(key) ?? getDefaultPillars().find((p) => p.key === key)!;
    return {
      key,
      label: pillar.label,
      bulletsText: programsToBulletsText(pillar.programs),
    };
  });
}

function formToMergedPillars(pillars: PillarForm[]) {
  return pillars.map((pillar) => ({
    key: pillar.key,
    label: pillar.label,
    color: '#C41E3A',
    programs: [
      {
        bullets: pillar.bulletsText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean),
      },
    ],
  }));
}

function countFormBullets(pillars: PillarForm[]): number {
  return pillars.reduce(
    (sum, p) => sum + p.bulletsText.split('\n').map((l) => l.trim()).filter(Boolean).length,
    0,
  );
}

function isDatabasePillarList(list: unknown[]): boolean {
  return list.some((p) => {
    if (!p || typeof p !== 'object') return false;
    const id = (p as { id?: unknown }).id;
    return typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id));
  });
}

function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'error' in data) {
      const apiError = (data as { error?: string }).error;
      if (typeof apiError === 'string' && apiError.trim()) return apiError;
    }
    if (typeof data === 'string' && data.includes('error')) return data;
    if (error.response?.status === 404) {
      return 'Save endpoint not found. Upload the latest php-api folder (especially index.php) to your server.';
    }
  }
  return 'Failed to save programs. Check that you are logged in and php-api is updated on the server.';
}

function isMemberUpdateResponse(data: Record<string, unknown>): boolean {
  if ('stats' in data || 'requestedStats' in data || 'statsMatchRequest' in data) {
    return true;
  }
  const message = typeof data.message === 'string' ? data.message.toLowerCase() : '';
  if (message.includes('local updated') && !Array.isArray(data.pillars)) {
    return true;
  }
  return 'corporate' in data && !Array.isArray(data.pillars);
}

function extractPillarsFromResponse(data: unknown): unknown[] | null {
  if (!data || typeof data !== 'object') return null;
  const record = data as Record<string, unknown>;
  if (Array.isArray(record.pillars)) return record.pillars;
  return null;
}

function parseApiResponse(data: unknown): {
  pillars?: unknown[];
  savedBulletCount?: number;
  sentBulletCount?: number;
  error?: string;
  message?: string;
} {
  let value: unknown = data;
  if (typeof value === 'string') {
    if (value.includes('Fatal error') || value.includes('mysqli_sql_exception')) {
      return {
        error:
          'Server database error while saving programs. Upload the latest php-api/pillars_helper.php, then open /php-api/database-init.php?action=create once.',
      };
    }
    try {
      value = JSON.parse(value);
    } catch {
      return {};
    }
  }
  if (!value || typeof value !== 'object') {
    return {};
  }
  const record = value as Record<string, unknown>;
  if (Array.isArray(record.pillars)) {
    return record as {
      pillars?: unknown[];
      savedBulletCount?: number;
      sentBulletCount?: number;
      error?: string;
      message?: string;
    };
  }
  if (record.data && typeof record.data === 'object') {
    return parseApiResponse(record.data);
  }
  return record as {
    pillars?: unknown[];
    savedBulletCount?: number;
    sentBulletCount?: number;
    error?: string;
    message?: string;
  };
}

function countBulletsInPillarList(pillars: unknown[]): number {
  let total = 0;
  for (const pillar of pillars) {
    if (!pillar || typeof pillar !== 'object') continue;
    const programs = (pillar as { programs?: unknown[] }).programs ?? [];
    for (const program of programs) {
      if (!program || typeof program !== 'object') continue;
      const bullets = (program as { bullets?: unknown[] }).bullets ?? [];
      total += bullets.filter((b) => String(b).trim() !== '').length;
    }
  }
  return total;
}

async function savePillarPrograms(
  localId: string,
  payload: { name?: string; pillars: ReturnType<typeof pillarsToApiPayload> },
) {
  const url = buildAdminUrl(`/locals/${localId}/pillar-programs`);

  // POST is more reliable than PUT on many PHP/shared hosts.
  try {
    return await axios.post(url, payload, jsonConfig);
  } catch (postError) {
    if (!axios.isAxiosError(postError)) throw postError;
    if (postError.response?.status === 404) {
      return axios.put(url, payload, jsonConfig);
    }
    throw postError;
  }
}

async function reloadPillarsFromServer(localId: string): Promise<{
  pillars: unknown[] | null;
  tablesReady?: boolean;
  localExists?: boolean;
}> {
  const urls = [
    buildAdminUrl(`/locals/${localId}/pillar-programs`),
    buildAdminUrl(`/locals/${localId}`),
    buildPublicUrl(`/locals/${localId}`),
  ];

  for (const url of urls) {
    try {
      const response = await axios.get(url, adminRequestConfig);
      const pillars = extractPillarsFromResponse(response.data);
      if (Array.isArray(pillars)) {
        const body = response.data as { tablesReady?: boolean; localExists?: boolean };
        return {
          pillars,
          tablesReady: body.tablesReady,
          localExists: body.localExists,
        };
      }
    } catch {
      // try next source
    }
  }

  return { pillars: null };
}

type Props = {
  localId: string;
  localName?: string;
};

export default function AdminLocalPrograms({ localId, localName }: Props) {
  const [pillars, setPillars] = useState<PillarForm[]>(() => pillarsToForm(getDefaultPillars()));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const applyPillarsFromApi = useCallback((backendPillars: unknown) => {
    const list = Array.isArray(backendPillars) ? backendPillars : [];
    const staticLocal = getLocalById(localId);

    // When database pillars exist, do not merge static defaults back in.
    const merged = isDatabasePillarList(list)
      ? mergePillarPrograms([], list)
      : mergePillarPrograms(staticLocal?.pillars, list);

    setPillars(pillarsToForm(merged));
  }, [localId]);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    const staticLocal = getLocalById(localId);
    const staticPillars = mergePillarPrograms(staticLocal?.pillars);

    try {
      const reloaded = await reloadPillarsFromServer(localId);
      if (reloaded.pillars) {
        applyPillarsFromApi(reloaded.pillars);
      } else {
        throw new Error('No pillars in response');
      }
    } catch {
      setPillars(pillarsToForm(staticPillars));
    } finally {
      setLoading(false);
    }
  }, [applyPillarsFromApi, localId]);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const handleBulletsChange = (key: LocalPillarKey, value: string) => {
    setPillars((prev) => prev.map((p) => (p.key === key ? { ...p, bulletsText: value } : p)));
  };

  const handleImportDefaults = () => {
    const staticLocal = getLocalById(localId);
    const merged = mergePillarPrograms(staticLocal?.pillars, []);
    setPillars(pillarsToForm(merged));
    setMessage({
      type: 'success',
      text: 'Loaded default programs from site data. Click Save programs to store them in the database.',
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const sentCount = countFormBullets(pillars);
    const firstLine = pillars[0]?.bulletsText.split('\n').map((l) => l.trim()).filter(Boolean)[0] ?? '';

    try {
      const payload = {
        name: localName || localId,
        pillars: pillarsToApiPayload(formToMergedPillars(pillars)),
      };

      const response = await savePillarPrograms(localId, payload);
      let parsed = parseApiResponse(response.data);

      if (
        response.data &&
        typeof response.data === 'object' &&
        isMemberUpdateResponse(response.data as Record<string, unknown>)
      ) {
        throw new Error(
          'Save request reached the member-info endpoint instead of pillar-programs. Upload php-api/index.php, pillars_helper.php, and admin_locals_pillar_programs_save.php to your server.',
        );
      }

      const responseMessage =
        typeof parsed.message === 'string' ? parsed.message.toLowerCase() : '';
      if (responseMessage.includes('local updated') && !Array.isArray(parsed.pillars)) {
        throw new Error(
          'Server handled program save as a member-info update. Upload the latest php-api/index.php (pillar-programs routing) to your server.',
        );
      }

      if (parsed.error) {
        throw new Error(parsed.error);
      }

      let savedPillars = Array.isArray(parsed.pillars) ? parsed.pillars : null;
      let savedCount = Number(parsed.savedBulletCount ?? 0);

      if (!savedPillars || savedCount === 0) {
        const reloaded = await reloadPillarsFromServer(localId);
        if (reloaded.pillars) {
          savedPillars = reloaded.pillars;
          savedCount = countBulletsInPillarList(savedPillars);
        }
        if (reloaded.tablesReady === false) {
          throw new Error(
            'Program tables are missing in the database. Open https://ymca.ph/php-api/database-init.php?action=create (or /testsite/php-api/... on staging) once, then save again.',
          );
        }
      }

      if (!savedPillars && savedCount > 0) {
        setMessage({
          type: 'success',
          text: `Saved ${savedCount} program(s). Reload the page to confirm they appear.`,
        });
        return;
      }

      if (!savedPillars) {
        const keys =
          response.data && typeof response.data === 'object'
            ? Object.keys(response.data as object).join(', ')
            : typeof response.data;
        const hint =
          parsed.message && !String(parsed.message).toLowerCase().includes('pillar')
            ? ` Server replied: "${parsed.message}".`
            : '';
        throw new Error(
          `Program save did not return pillar data (response keys: ${keys}).${hint} Upload php-api/index.php, pillars_helper.php, admin_locals_pillar_programs_save.php, admin_locals_pillar_programs_get.php, and run database-init.php?action=create.`,
        );
      }

      savedCount = Number(parsed.savedBulletCount ?? countBulletsInPillarList(savedPillars));
      if (sentCount > 0 && savedCount === 0) {
        throw new Error(
          'Save failed: no programs were stored in the database. Upload the latest php-api files or ask your host to enable the local_programs_bullets table.',
        );
      }

      applyPillarsFromApi(savedPillars);

      const reloadedCommunity = pillarsToForm(
        mergePillarPrograms([], savedPillars as Parameters<typeof mergePillarPrograms>[1]),
      )
        .find((p) => p.key === 'community')?.bulletsText ?? '';
      const reloadedHasFirstLine = !firstLine || reloadedCommunity.includes(firstLine);

      if (sentCount > 0 && !reloadedHasFirstLine) {
        throw new Error(
          'Save did not stick — the server returned different data than you entered. Upload the latest php-api folder and try again.',
        );
      }

      setMessage({
        type: 'success',
        text: `Saved ${savedCount} program(s) to the database. Public local pages will show these changes.`,
      });
    } catch (error) {
      console.error('Error saving pillar programs:', error);
      setMessage({ type: 'error', text: getApiErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="admin-local-programs__loading">Loading pillar programs…</p>;
  }

  return (
    <section className="admin-local-programs">
      <div className="admin-local-programs__header">
        <div>
          <h3>Programs Implemented — 4 Pillars</h3>
          <p className="admin-local-programs__hint">
            These bullet points appear on the public &quot;Programs implemented&quot; panel when visitors
            click each pillar for <strong>{localName || localId}</strong>. Enter <strong>one program per line</strong> in
            each box below, then click <strong>Save programs</strong>.
          </p>
        </div>
        <div className="admin-local-programs__actions">
          <button type="button" className="btn btn-secondary" onClick={handleImportDefaults}>
            Load defaults
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save programs'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`${message.type}-message admin-local-programs__message`}>{message.text}</div>
      )}

      <div className="admin-local-programs__grid">
        {pillars.map((pillar) => (
          <div key={pillar.key} className="admin-local-programs__pillar">
            <label htmlFor={`pillar-bullets-${pillar.key}`}>{pillar.label}</label>
            <textarea
              id={`pillar-bullets-${pillar.key}`}
              rows={8}
              value={pillar.bulletsText}
              onChange={(e) => handleBulletsChange(pillar.key, e.target.value)}
              placeholder={'One program per line\ne.g. YMCA Parking Renovation'}
            />
            <span className="admin-local-programs__count">
              {pillar.bulletsText.split('\n').map((l) => l.trim()).filter(Boolean).length} program(s)
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
