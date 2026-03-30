import { useMemo, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ActivityCalendar, { type CalendarEvent } from '../components/ActivityCalendar';
import Card from './Card-Media/Card';
import SubjectHeader from '../components/SubjectHeader';
import { LATEST_NEWS, NEWS_FEATURED_IMAGE, type NewsCategory } from '../data/news';
import { CALENDAR_EVENT_RECORDS } from '../data/calendarEvents';
import '../styles/design-system.css';
import './What_We_Do.css';
import { Link } from 'react-router-dom';
const CARDS_PER_PAGE = 3;

function extractYear(date?: string) {
  if (!date) return null;
  const match = date.match(/\b(19|20)\d{2}\b/);
  return match?.[0] ?? null;
}

function ymdToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const WhatWeDo: React.FC = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  const today = ymdToday();
  const initialEvent = CALENDAR_EVENT_RECORDS.find((e) => e.date === today) ?? null;
  const [selected, setSelected] = useState<CalendarEvent | null>(initialEvent);
  const [currentPage, setCurrentPage] = useState(0);

  type CategoryFilter = 'All' | NewsCategory;
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [topic, setTopic] = useState<string>('All');
  const [archiveYear, setArchiveYear] = useState<string>('All');

  const categoryOptions: CategoryFilter[] = ['All', 'News', 'Articles', 'Features'];

  const topicOptions = useMemo(() => {
    const unique = new Set(LATEST_NEWS.map((a) => a.topic).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, []);

  const archiveOptions = useMemo(() => {
    const years = new Set<string>();
    for (const a of LATEST_NEWS) {
      const y = extractYear(a.date);
      if (y) years.add(y);
    }
    const derived = Array.from(years).sort((a, b) => Number(a) - Number(b));
    // Prefer the requested order when both exist.
    if (derived.includes('2025') && derived.includes('2026')) return ['2025', '2026'];
    return derived;
  }, []);

  const filteredItems = useMemo(() => {
    return LATEST_NEWS.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      if (topic !== 'All' && item.topic !== topic) return false;
      if (archiveYear !== 'All') {
        const y = extractYear(item.date);
        if (!y || y !== archiveYear) return false;
      }
      return true;
    });
  }, [archiveYear, category, topic]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / CARDS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);
  const start = safeCurrentPage * CARDS_PER_PAGE;
  const visibleItems = filteredItems.slice(start, start + CARDS_PER_PAGE);

  const featuredItem = LATEST_NEWS[0];

  const selectedDate = selected?.date ?? null;
  const formattedDate = useMemo(() => {
    if (!selectedDate) return null;
    try {
      return new Date(selectedDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className="what-we-do-page" ref={ref}>
      {/* Featured + Latest News */}
      <section id="latest-news" className="page-section page-section--white latest-news-section">
        <div className="page-section__inner">
          {/* Featured / latest showcase — first screen */}
          <div className="latest-news-featured reveal reveal-delay-1">
            <img
              src={featuredItem?.imageUrl ?? NEWS_FEATURED_IMAGE}
              alt="Latest news featured"
              className="latest-news-featured__image"
            />
            <div className="latest-news-featured__overlay" />
            <div className="latest-news-featured__content">
              <div className="latest-news-featured__kicker">Featured</div>
              <h2 className="latest-news-featured__title">{featuredItem?.title ?? 'Latest News'}</h2>
              {featuredItem?.date ? (
                <div className="latest-news-featured__meta">{featuredItem.date}</div>
              ) : null}
              <Link to={featuredItem?.path ?? '/'} className="latest-news-featured__cta">
                Read Featured
              </Link>
            </div>
          </div>

          {/* All latest news — below the fold */}
          <div className="latest-news-archive">
          <SubjectHeader text="Y Latest News" className="reveal" />

          <div className="latest-news-layout">
            {/* LEFT: sticky filters */}
            <aside className="latest-news-filters" aria-label="News filters">
              <div className="latest-news-filter-group">
                <label className="latest-news-filter-label" htmlFor="filter-category">
                  Category
                </label>
                <select
                  id="filter-category"
                  className="latest-news-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryFilter)}
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="latest-news-filter-group">
                <label className="latest-news-filter-label" htmlFor="filter-topic">
                  Topic
                </label>
                <select
                  id="filter-topic"
                  className="latest-news-select"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="All">All</option>
                  {topicOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="latest-news-filter-group">
                <label className="latest-news-filter-label" htmlFor="filter-archive">
                  Archive
                </label>
                <select
                  id="filter-archive"
                  className="latest-news-select"
                  value={archiveYear}
                  onChange={(e) => setArchiveYear(e.target.value)}
                >
                  <option value="All">All</option>
                  {archiveOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </aside>

            {/* RIGHT: results */}
            <div className="latest-news-results">
              <div className="latest-news-grid reveal reveal-delay-1">
                {visibleItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="latest-news-card-link"
                    aria-label={`Open article: ${item.title}`}
                  >
                    <Card
                      title={item.title}
                      subtitle={item.date}
                      imageUrl={item.imageUrl}
                      tag={item.category === 'Articles' ? 'Article' : item.category === 'Features' ? 'Feature' : 'News'}
                      description={item.subtitle ?? item.topic}
                      variant={item.category === 'Articles' ? 'article' : 'news'}
                    >
                      <span className="latest-news-card-cta">Read More</span>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="latest-news-nav-controls reveal reveal-delay-2">
                <button
                  type="button"
                  className="latest-news-nav-arrow"
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  aria-label="Previous page"
                >
                  ←
                </button>

                <div className="latest-news-nav-dots" role="tablist" aria-label="News pages">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`latest-news-nav-dot ${i === currentPage ? 'latest-news-nav-dot--active' : ''}`}
                      onClick={() => setCurrentPage(i)}
                      aria-label={`Page ${i + 1}`}
                      aria-selected={i === currentPage}
                      role="tab"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="latest-news-nav-arrow"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  aria-label="Next page"
                >
                  →
                </button>
              </div>

              <div className="latest-news-submit-wrap">
                <Link to="/Article" className="ymca-update-submit">
                  Submit Your YMCA Update
                </Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section id="calendar" className="page-section page-section--white calendar-section">
        <div className="page-section__inner">
          <SubjectHeader text="Calendar of Activities" as="h1" className="reveal" />

          <div className="calendar-layout reveal reveal-delay-1">
            {/* LEFT: event information */}
            <aside className="calendar-details" aria-label="Event information">
              <div className="calendar-details__card">
                {!selected ? (
                  <>
                    <div className="calendar-details__hint">Click an event on the calendar.</div>
                    <div className="calendar-details__placeholder" />
                    <p className="calendar-details__text">
                      Event details will appear here when you select an activity.
                    </p>
                  </>
                ) : (
                  <>
                    {selected.date === ymdToday() ? (
                      <div className="calendar-details__todayBadge">Today&apos;s event</div>
                    ) : null}
                    <h2 className="calendar-details__title">{selected.title}</h2>
                    {formattedDate && <div className="calendar-details__date">{formattedDate}</div>}

                    {/* Image above description */}
                    {selected.image && (
                      <div className="calendar-details__image-wrap">
                        <img src={selected.image} alt={selected.title} className="calendar-details__image" />
                      </div>
                    )}

                    <p className="calendar-details__text">
                      {selected.description ?? 'No description available for this event.'}
                    </p>
                  </>
                )}
              </div>
            </aside>

            {/* RIGHT: calendar */}
            <div className="calendar-board" aria-label="Calendar">
              <ActivityCalendar onEventClick={(e) => setSelected(e)} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeDo;