import { useEffect, useMemo, useState } from 'react';
import { LOCALS_BY_ID, getLocalsAggregateStats } from '../data/locals';

type ImpactStat = {
  key: string;
  label: string;
  value: number;
  suffix?: string;
};

function formatValue(n: number) {
  return new Intl.NumberFormat('en-PH').format(n);
}

function ImpactStats() {
  const aggregate = useMemo(() => getLocalsAggregateStats(), []);
  const ymcaCount = useMemo(() => Object.keys(LOCALS_BY_ID).length, []);

  const stats: ImpactStat[] = useMemo(
    () => [
      { key: 'ymcas', label: 'YMCAs Across the Philippines', value: ymcaCount },
      { key: 'members', label: 'Total Members', value: aggregate.total },
      { key: 'programs', label: 'Community Programs', value: 50 },
      { key: 'partners', label: 'Partners & Donors', value: 250 },
      { key: 'volunteers', label: 'Volunteers', value: 2000, suffix: '+' },
      { key: 'employees', label: 'Employees', value: 150, suffix: '+' },
    ],
    [ymcaCount, aggregate.total],
  );

  const [animated, setAnimated] = useState<number[]>(() => stats.map(() => 0));

  useEffect(() => {
    let rafId: number | null = null;
    const start = performance.now();
    const duration = 4000;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setAnimated(stats.map((s) => Math.floor(s.value * progress)));
      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [stats]);

  return (
    <section id="made-our-impact" className="page-section page-section--gray">
      <div className="page-section__inner">
        <div className="section-header reveal">
          <h2 className="section-header__title">Made Our Impact</h2>
          <div className="section-header__line" aria-hidden />
        </div>
        <div className="impact-stats__grid reveal reveal-delay-1">
          {stats.map((stat, idx) => (
            <article key={stat.key} className="impact-stats__card">
              <div className="impact-stats__value">
                {formatValue(animated[idx])}
                {stat.suffix ?? ''}
              </div>
              <p className="impact-stats__label">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactStats;
