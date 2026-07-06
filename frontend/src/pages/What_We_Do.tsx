import { useEffect, useMemo, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useLoadingScreen } from '../hooks/useLoadingScreen';
import { useNews, useCalendarEvents } from '../hooks/useApi';
import ActivityCalendar, { type CalendarEvent } from '../components/ActivityCalendar';
import Card from '../components/Card';
import SubjectHeader from '../components/SubjectHeader';
import { NEWS_FEATURED_IMAGE, type NewsCategory } from '../data/news';
import '../styles/design-system.css';
import './What_We_Do.css';
import { Link } from 'react-router-dom';
import { compareNewsDatesDesc } from '../utils/newsDate';

const normalizeImageUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/backend/uploads/')) return url;
  if (url.startsWith('/uploads/')) return `/backend${url}`;
  if (url.startsWith('/php-api/uploads/')) return `/backend/${url.substring('/php-api/uploads/'.length)}`;
  return url;
};

const normalizeDocumentUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (typeof window === 'undefined') return url;

  const { origin, pathname } = window.location;
  const sitePrefix = pathname === '/testsite' || pathname.startsWith('/testsite/') ? '/testsite' : '';

  if (url.startsWith('/')) {
    if (sitePrefix && !url.startsWith(sitePrefix) && url.startsWith('/php-api/')) {
      return `${origin}${sitePrefix}${url}`;
    }
    return `${origin}${url}`;
  }

  return url;
};

type ApiCalendarEvent = CalendarEvent & {
  id?: number;
  imageUrl?: string;
};

function toCalendarDetailsEvent(event: ApiCalendarEvent): CalendarEvent {
  return {
    title: event.title || '',
    date: event.date || event.startDate,
    startDate: event.startDate,
    endDate: event.endDate,
    description: event.description,
    image: normalizeImageUrl(event.imageUrl || event.image),
    documentTitle: event.documentTitle,
    documentUrl: event.documentUrl,
    documentFileName: event.documentFileName,
  };
}

function findCalendarEvent(events: ApiCalendarEvent[], hint: CalendarEvent & { id?: number }) {
  if (hint.id != null) {
    const byId = events.find((event) => event.id === hint.id);
    if (byId) return byId;
  }

  return events.find((event) => {
    if (event.title !== hint.title) return false;
    if (hint.startDate && hint.endDate) {
      return event.startDate === hint.startDate && event.endDate === hint.endDate;
    }
    return event.date === hint.date || event.startDate === hint.date;
  });
}
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
  const { news, loading, error } = useNews();
  const { events: calendarEvents } = useCalendarEvents();
  
  // Show loading screen while fetching news
  useLoadingScreen(loading);
  
  // Sort news by date field chronologically (latest first), not by creation order
  const newsItems = useMemo(() => {
    return [...news].sort((a, b) => compareNewsDatesDesc(a.date, b.date));
  }, [news]);

  const initialEvent = useMemo(() => {
    if (!Array.isArray(calendarEvents)) return null;
    // Find event for today - either single date or within date range
    const todayEvent = calendarEvents.find((e) => {
      if (e.date === today) return true; // Old format: exact date match
      if (e.startDate && e.endDate) {
        return today >= e.startDate && today <= e.endDate; // New format: date in range
      }
      return false;
    });
    
    if (!todayEvent) return null;

    return toCalendarDetailsEvent(todayEvent);
  }, [calendarEvents, today]);

  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!Array.isArray(calendarEvents) || calendarEvents.length === 0) return;

    setSelected((current) => {
      if (current) {
        const match = findCalendarEvent(calendarEvents, current);
        return match ? toCalendarDetailsEvent(match) : current;
      }
      return initialEvent;
    });
  }, [calendarEvents, initialEvent]);

  useEffect(() => {
    setCurrentPage(0);
  }, [news]);

  type CategoryFilter = 'All' | NewsCategory;
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [topic, setTopic] = useState<string>('All');
  const [archiveYear, setArchiveYear] = useState<string>('All');

  const categoryOptions: CategoryFilter[] = ['All', 'News', 'Articles', 'Features'];

  const topicOptions = useMemo(() => {
    const unique = new Set(newsItems.map((a) => a.topic).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [newsItems]);

  const archiveOptions = useMemo(() => {
    const years = new Set<string>();
    for (const a of newsItems) {
      const y = extractYear(a.date);
      if (y) years.add(y);
    }
    const derived = Array.from(years).sort((a, b) => Number(a) - Number(b));
    if (derived.includes('2025') && derived.includes('2026')) return ['2025', '2026'];
    return derived;
  }, [newsItems]);

  const filteredItems = useMemo(() => {
    return newsItems.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      if (topic !== 'All' && item.topic !== topic) return false;
      if (archiveYear !== 'All') {
        const y = extractYear(item.date);
        if (!y || y !== archiveYear) return false;
      }
      return true;
    });
  }, [archiveYear, category, topic, newsItems]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / CARDS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);
  const start = safeCurrentPage * CARDS_PER_PAGE;
  const visibleItems = filteredItems.slice(start, start + CARDS_PER_PAGE);

  const featuredItem = !loading ? (newsItems[0] ?? null) : null;

  const selectedDate = selected?.date ?? null;
  const formattedDate = useMemo(() => {
    try {
      // Handle date range (new format)
      if (selected?.startDate && selected?.endDate) {
        const startDate = new Date(selected.startDate);
        const endDate = new Date(selected.endDate);
        
        const startFormatted = startDate.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        
        // If same day, show only once
        if (selected.startDate === selected.endDate) {
          return startFormatted;
        }
        
        const endFormatted = endDate.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        
        return `${startFormatted} - ${endFormatted}`;
      }
      
      // Handle single date (old format)
      if (!selectedDate) return null;
      return new Date(selectedDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return selected?.startDate && selected?.endDate 
        ? `${selected.startDate} - ${selected.endDate}`
        : selectedDate;
    }
  }, [selected, selectedDate]);

  return (
    <div className="what-we-do-page" ref={ref}>
      {/* Featured + Latest News */}
      <section id="latest-news" className="page-section page-section--white latest-news-section">
        <div className="page-section__inner">
          {/* Featured / latest showcase — first screen */}
          <div className="latest-news-featured reveal reveal-delay-1">
            <img
              src={normalizeImageUrl(featuredItem?.imageUrl) || NEWS_FEATURED_IMAGE}
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
          {error && <div className="latest-news-error">{error}</div>}

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
                {loading ? (
                  <p className="latest-news-loading" aria-live="polite">
                    Loading latest news…
                  </p>
                ) : null}
                {!loading &&
                  visibleItems.map((item) => (
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
                    {(selected.date === ymdToday() || (selected.startDate && selected.endDate && ymdToday() >= selected.startDate && ymdToday() <= selected.endDate)) ? (
                      <div className="calendar-details__todayBadge">Today&apos;s event</div>
                    ) : null}
                    <h2 className="calendar-details__title">{selected.title}</h2>
                    {formattedDate && <div className="calendar-details__date">{formattedDate}</div>}

                    {/* Image above description */}
                    {selected.image && (
                      <div className="calendar-details__image-wrap">
                        <img src={normalizeImageUrl(selected.image)} alt={selected.title} className="calendar-details__image" />
                      </div>
                    )}

                    <p className="calendar-details__text">
                      {selected.description ?? 'No description available for this event.'}
                    </p>

                    {selected.documentUrl && (
                      <div className="calendar-details__document">
                        <span className="calendar-details__document-label">Document:</span>{' '}
                        <a
                          href={normalizeDocumentUrl(selected.documentUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="calendar-details__document-link"
                        >
                          {selected.documentTitle || selected.documentFileName || 'View document'}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </aside>

            {/* RIGHT: calendar */}
            <div className="calendar-board" aria-label="Calendar">
              <ActivityCalendar
                onEventClick={(clicked) => {
                  const match = findCalendarEvent(calendarEvents, clicked);
                  setSelected(toCalendarDetailsEvent(match ?? clicked));
                }}
                events={calendarEvents}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeDo;
