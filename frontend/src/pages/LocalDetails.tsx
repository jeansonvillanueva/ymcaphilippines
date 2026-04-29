import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLocalById } from '../hooks/useApi';
import { getDefaultPillars, getLocalById, resolveLocalHeroImage, type LocalPillarKey, type LocalConfig } from '../data/locals';
import SubjectHeader from '../components/SubjectHeader';
import FacilitiesSlideshow from '../components/FacilitiesSlideshow';
import pillarCommunityWellbeing from '../assets/images/pillars/community_wellbeing.png';
import pillarMeaningWork from '../assets/images/pillars/meaning_work.png';
import pillarSustainablePlanet from '../assets/images/pillars/sustainable_planet.png';
import pillarJustWorld from '../assets/images/pillars/just_world.png';

const normalizeImageUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/testsite/') || url.startsWith('/testsite/backend/uploads/')) return url;
  if (url.startsWith('/backend/uploads/')) return url;
  if (url.startsWith('/uploads/')) return `/testsite/backend${url}`;
  if (url.startsWith('/php-api/uploads/')) return `/testsite/backend/${url.substring('/php-api/uploads/'.length)}`;
  return url;
};
import '../styles/design-system.css';
import './LocalDetails.css';

function formatNumber(n: number) {
  return new Intl.NumberFormat('en-PH').format(n);
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
  const { local: apiLocal } = useLocalById(localId ?? '');
  const [activePillar, setActivePillar] = useState<LocalPillarKey | null>(null);

  const normalizedLocal = useMemo<LocalConfig | null>(() => {
    if (apiLocal) {
      return {
        id: apiLocal.id,
        name: apiLocal.name,
        established: apiLocal.established,
        facebookUrl: apiLocal.facebookUrl,
        instagramUrl: apiLocal.instagramUrl,
        twitterUrl: apiLocal.twitterUrl,
        heroImageUrl: apiLocal.heroImageUrl,
        logoImageUrl: apiLocal.logoImageUrl,
        stats: {
          corporate: Number(apiLocal.corporate) || 0,
          nonCorporate: Number(apiLocal.nonCorporate) || 0,
          youth: Number(apiLocal.youth) || 0,
          others: Number(apiLocal.others) || 0,
          totalMembersAsOf: apiLocal.totalMembersAsOf || '',
        },
        pillars: Array.isArray(apiLocal.pillars)
          ? apiLocal.pillars.map((pillar: any) => ({
              ...pillar,
              programs: Array.isArray(pillar.programs) ? pillar.programs : [],
            }))
          : [],
      };
    }

    return localId ? getLocalById(localId) : null;
  }, [apiLocal, localId]);

  const local = normalizedLocal;
  const pillars = useMemo(() => {
    const base = getDefaultPillars();
    if (!local) return base;
    const overrides = new Map((local.pillars ?? []).map((p) => [p.key, p]));
    return base.map((p) => overrides.get(p.key) ?? p);
  }, [local]);

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
              <Link to="/find-ymca#find-ymca" className="local-details__backLink">
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
            <Link to="/find-ymca#find-ymca" className="local-details__backLink">
              Back to Find Your YMCA
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

