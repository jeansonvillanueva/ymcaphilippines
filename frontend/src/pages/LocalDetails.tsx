import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLoadingScreen } from '../hooks/useLoadingScreen';
import { useLocalById } from '../hooks/useApi';
import {
  getLocalById,
  mergePillarPrograms,
  resolveLocalHeroImage,
  type LocalPillarKey,
  type LocalConfig,
} from '../data/locals';
import SubjectHeader from '../components/SubjectHeader';
import FacilitiesSlideshow from '../components/FacilitiesSlideshow';
import pillarCommunityWellbeing from '../assets/images/pillars/community_wellbeing.png';
import pillarMeaningWork from '../assets/images/pillars/meaning_work.png';
import pillarSustainablePlanet from '../assets/images/pillars/sustainable_planet.png';
import pillarJustWorld from '../assets/images/pillars/just_world.png';

const normalizeImageUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/backend/uploads/')) return url;
  if (url.startsWith('/uploads/')) return `/backend${url}`;
  if (url.startsWith('/php-api/uploads/')) return `/backend/${url.substring('/php-api/uploads/'.length)}`;
  return url;
};
import '../styles/design-system.css';
import './LocalDetails.css';

function formatNumber(n: number) {
  return new Intl.NumberFormat('en-PH').format(n);
}

function resolveEmbeddedMapSrc(value?: string | null): string {
  if (!value) return '';
  const trimmed = value.trim();
  const iframeSrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch?.[1]) {
    return iframeSrcMatch[1];
  }
  return trimmed;
}

const PILLAR_ICONS: Record<LocalPillarKey, string> = {
  community: pillarCommunityWellbeing,
  work: pillarMeaningWork,
  planet: pillarSustainablePlanet,
  world: pillarJustWorld,
};

export default function LocalDetails() {
  const ref = useScrollReveal<HTMLDivElement>();
  const { localId } = useParams();
  const { local: apiLocal, loading } = useLocalById(localId ?? '');
  const [activePillar, setActivePillar] = useState<LocalPillarKey | null>(null);

  // Show loading screen while fetching local data
  useLoadingScreen(loading);

  const staticLocal = useMemo(() => (localId ? getLocalById(localId) : null), [localId]);

  const normalizedLocal = useMemo<LocalConfig | null>(() => {
    if (!staticLocal && !apiLocal) return null;

    const base: LocalConfig = staticLocal ?? {
      id: apiLocal.id,
      name: apiLocal.name,
      pillars: [],
    };

    const mergedPillars = mergePillarPrograms(
      base.pillars,
      Array.isArray(apiLocal?.pillars) ? apiLocal.pillars : null,
    );

    return {
      id: apiLocal?.id ?? base.id,
      name: apiLocal?.name ?? base.name,
      established: apiLocal?.established ?? base.established,
      facebookUrl: apiLocal?.facebookUrl ?? base.facebookUrl,
      instagramUrl: apiLocal?.instagramUrl ?? base.instagramUrl,
      twitterUrl: apiLocal?.twitterUrl ?? base.twitterUrl,
      heroImageUrl: apiLocal?.heroImageUrl ?? base.heroImageUrl,
      logoImageUrl: apiLocal?.logoImageUrl ?? base.logoImageUrl,
      embeddedMapUrl:
        apiLocal && 'embeddedMapUrl' in apiLocal
          ? (apiLocal.embeddedMapUrl ?? '')
          : (base.embeddedMapUrl ?? ''),
      stats: apiLocal
        ? {
            corporate: Number(apiLocal.corporate ?? 0) || 0,
            nonCorporate: Number(apiLocal.nonCorporate ?? 0) || 0,
            youth: Number(apiLocal.youth ?? 0) || 0,
            others: Number(apiLocal.others ?? 0) || 0,
            totalMembersAsOf: apiLocal.totalMembersAsOf ?? '',
          }
        : {
            corporate: Number(base.stats?.corporate ?? 0) || 0,
            nonCorporate: Number(base.stats?.nonCorporate ?? 0) || 0,
            youth: Number(base.stats?.youth ?? 0) || 0,
            others: Number(base.stats?.others ?? 0) || 0,
            totalMembersAsOf: base.stats?.totalMembersAsOf ?? '',
          },
      pillars: mergedPillars,
    };
  }, [apiLocal, staticLocal]);

  const local = normalizedLocal;
  const pillars = Array.isArray(local?.pillars) ? local.pillars : [];

  const activePrograms = useMemo(() => {
    if (!activePillar) return null;
    const found = pillars.find((p) => p.key === activePillar);
    if (!found) return null;
    if (!found.programs?.length) return null; // hide rectangle if no programs
    return found;
  }, [activePillar, pillars]);

  if (!local) {
    return (
      <div className="local-details-page" ref={ref}>
        <section className="page-section page-section--white">
          <div className="page-section__inner reveal">
            <SubjectHeader text="Local YMCA" className="reveal" />
            <div className="local-details__missing">
              <p className="local-details__missingTitle">Local not found.</p>
              <p className="local-details__missingBody">
                This local doesn’t have a details page configured yet.
              </p>
              <Link to="/where-we-are#find-your-ymca" className="local-details__backLink">
                Back to Find Your YMCA
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const totalMembers =
    (local.stats?.corporate ?? 0) +
    (local.stats?.nonCorporate ?? 0) +
    (local.stats?.youth ?? 0) +
    (local.stats?.others ?? 0);

  const heroBackground = resolveLocalHeroImage(local);

  return (
    <div className="local-details-page" ref={ref}>
      <section
        className="local-details-hero"
        style={heroBackground ? { backgroundImage: `url(${heroBackground})` } : undefined}
      >
        <div className="local-details-hero__overlay" />

        <div className="local-details-hero__inner reveal">
          <div className="local-details-hero__logoRow">
            {local.facebookUrl ? (
              <a
                className="local-details-hero__logoLink"
                href={local.facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${local.name} Facebook page`}
              >
                {local.logoImageUrl ? (
                  <img className="local-details-hero__logo" src={normalizeImageUrl(local.logoImageUrl)} alt={`${local.name} logo`} />
                ) : (
                  <div className="local-details-hero__logoFallback" aria-hidden />
                )}
              </a>
            ) : (
              <>
                {local.logoImageUrl ? (
                  <img className="local-details-hero__logo" src={normalizeImageUrl(local.logoImageUrl)} alt={`${local.name} logo`} />
                ) : (
                  <div className="local-details-hero__logoFallback" aria-hidden />
                )}
              </>
            )}
          </div>

          <div className="local-details-hero__titleRow">
            <h1 className="local-details-hero__title">{local.name}</h1>
            {local.established ? (
              <div className="local-details-hero__sub">
                Established in {local.established}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="page-section page-section--white">
        <div className="page-section__inner reveal">
          <div className="local-details-card">
            {local.stats ? (
              <>
                {resolveEmbeddedMapSrc(local.embeddedMapUrl) ? (
                  <div className="local-details-map">
                    <iframe
                      src={resolveEmbeddedMapSrc(local.embeddedMapUrl)}
                      title={`${local.name} map`}
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : null}
                <div className="local-details-stats">
                  <div className="local-details-stats__row">
                    <div className="local-details-stats__label">Corporate</div>
                    <div className="local-details-stats__value">{formatNumber(local.stats.corporate)}</div>
                  </div>
                  <div className="local-details-stats__row">
                    <div className="local-details-stats__label">Non-Corporate</div>
                    <div className="local-details-stats__value">{formatNumber(local.stats.nonCorporate ?? 0)}</div>
                  </div>

                  <div className="local-details-stats__row">
                    <div className="local-details-stats__label">Youth</div>
                    <div className="local-details-stats__value">{formatNumber(local.stats.youth)}</div>
                  </div>
                  <div className="local-details-stats__row">
                    <div className="local-details-stats__label">Others</div>
                    <div className="local-details-stats__value">{formatNumber(local.stats.others ?? 0)}</div>
                  </div>
                </div>

                <div className="local-details-total">
                  <div className="local-details-total__label">Total Members as of {local.stats.totalMembersAsOf}</div>
                  <div className="local-details-total__value">{formatNumber(totalMembers)}</div>
                </div>
              </>
            ) : (
              <div className="local-details-emptyStats">
                Stats will be added here soon.
              </div>
            )}

            {/* Facilities Slideshow */}
            <FacilitiesSlideshow localId={localId || ''} />

            <div className="local-details-pillars">
              {pillars.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={
                    activePillar === p.key
                      ? 'local-details-pillar local-details-pillar--active'
                      : 'local-details-pillar'
                  }
                  onClick={() => {
                    setActivePillar((prev) => (prev === p.key ? null : p.key));
                  }}
                  aria-pressed={activePillar === p.key}
                >
                  <div className="local-details-pillar__icon" aria-hidden>
                    <img className="local-details-pillar__iconImage" src={PILLAR_ICONS[p.key]} alt="" />
                  </div>
                  <div className="local-details-pillar__label">{p.label}</div>
                </button>
              ))}
            </div>

            {activePrograms ? (
              <div className="local-details-programs" role="region" aria-label="Programs implemented">
                <div className="local-details-programs__header">
                  <div className="local-details-programs__title">
                    Programs implemented
                  </div>
                  <button
                    type="button"
                    className="local-details-programs__close"
                    onClick={() => setActivePillar(null)}
                    aria-label="Close programs"
                  >
                    ✕
                  </button>
                </div>
                <ul className="local-details-programs__list">
                  {activePrograms.programs.map((prog, idx) => (
                    <li key={prog.title ?? prog.bullets?.[0] ?? String(idx)} className="local-details-programs__item">
                      {prog.title ? (
                        <div className="local-details-programs__itemTitle">{prog.title}</div>
                      ) : null}
                      {prog.bullets?.length ? (
                        <ul className="local-details-programs__bullets">
                          {prog.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="local-details-footerActions reveal reveal-delay-2">
            <Link to="/where-we-are#find-your-ymca" className="local-details__backLink">
              Back to Find Your YMCA
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

