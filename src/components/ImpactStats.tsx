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

  const stats: ImpactStat[] = [
    { key: 'ymcas', label: 'YMCAs Across the Philippines', value: ymcaCount },
    { key: 'members', label: 'Total Members', value: aggregate.total },
    { key: 'programs', label: 'Community Programs', value: 50 },
    { key: 'partners', label: 'Partners & Donors', value: 250 },
    { key: 'volunteers', label: 'Volunteers', value: 2000, suffix: '+' },
    { key: 'employees', label: 'Employees', value: 150, suffix: '+' },
  ];

  const [animated, setAnimated] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const start = performance.now();
    const duration = 4000;
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setAnimated(stats.map((s) => Math.floor(s.value * progress)));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, []);

  return (
    <section id="made-our-impact" className="page-section page-section--gray">
      <div className="page-section__inner">
        <h2 className="impact-stats__title reveal">Made Our Impact</h2>
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
