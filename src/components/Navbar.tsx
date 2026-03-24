import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/logo.webp';
import { searchSite, type SearchResult } from '../data/searchIndex';

function groupLabel(t: SearchResult['type']) {
  if (t === 'news') return 'News';
  if (t === 'event') return 'Events';
  return 'Pages';
}

function Navbar() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchPanelRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => searchSite(query, 16), [query]);

  useEffect(() => {
    if (isSearchOpen) {
      window.setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!isSearchOpen) return;
      const el = searchPanelRef.current;
      if (el && !el.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isSearchOpen]);

  const goResult = (r: SearchResult) => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
    navigate(r.path);
  };

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const first = searchSite(query, 1)[0];
    if (first) goResult(first);
    else searchInputRef.current?.blur();
  };

  return (
    <nav className="navbar-custom">
      <div className="navbar-bar">
        <div className="blue-section">
          <div className="navbar-brand">
            <Link
              to="/"
              onClick={() => {
                setIsSearchOpen(false);
                setIsMenuOpen(false);
              }}
            >
              <img src={logo} alt="YMCA Logo" className="navbar-logo" />
            </Link>
          </div>

          <button
            type="button"
            className="btn-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            ☰
          </button>

          <ul
            className={isMenuOpen ? 'navbar-menu navbar-menu--open' : 'navbar-menu'}
            aria-label="Primary navigation"
          >
            <li className="nav-dropdown">
              <NavLink
                to="/"
                onClick={() => {
                  setIsSearchOpen(false);
                  setIsMenuOpen(false);
                }}
                className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              >
                The Y
              </NavLink>
              <ul className="nav-dropdown-menu" aria-label="Home submenu">
                <li>
                  <Link to="/#vision_2030" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>Vision 2030</Link>
                </li>
                <li>
                  <Link to="/#made-our-impact" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>Made Our Impact</Link>
                </li>
              </ul>
            </li>

            <li className="nav-dropdown">
              <NavLink
                to="/calendar"
                onClick={() => {
                  setIsSearchOpen(false);
                  setIsMenuOpen(false);
                }}
                className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              >
                What We Do
              </NavLink>

              <ul className="nav-dropdown-menu" aria-label="What We Do submenu">
                <li>
                  <Link to="/calendar#latest-news" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>
                    Latest News
                  </Link>
                </li>

                <li>
                  <Link to="/calendar#calendar" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>
                    Calendar of Activities
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-dropdown">
              <NavLink
                to="/find-ymca"
                onClick={() => {
                  setIsSearchOpen(false);
                  setIsMenuOpen(false);
                }}
                className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              >
                Where We Are
              </NavLink>

              <ul className="nav-dropdown-menu" aria-label="Where We Are submenu">
                <li>
                  <Link to="/find-ymca#find-ymca" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>
                    Find Your YMCA
                  </Link>
                </li>

                <li>
                  <Link to="/find-ymca#contact-us" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-dropdown">
              <NavLink
                to="/about-us"
                onClick={() => {
                  setIsSearchOpen(false);
                  setIsMenuOpen(false);
                }}
                className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}
              >
               About Us
              </NavLink>

              <ul className="nav-dropdown-menu" aria-label="About Us submenu">
                <li>
                  <Link to="/about-us#vmv-section" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>
                    Vision, Mission and Pillars of Impact
                  </Link>
                </li>

                <li>
                  <Link to="/about-us#history-section" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>
                   History
                  </Link>
                </li>
                <li>
                  <Link to="/about-us#meet-family" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>
                    Meet Our Family
                  </Link>
                </li>
                <li>
                  <Link to="/about-us/highlights" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>
                    About Us Highlights
                  </Link>
                </li>
                <li>
                  <Link to="/about-us#partners-section" onClick={() => { setIsSearchOpen(false); setIsMenuOpen(false); }}>
                    Partners
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="right-section">
          <Link to="/get-involved" className="btn-get-involved" onClick={() => setIsSearchOpen(false)}>
            Support
          </Link>
          <button
            type="button"
            className="btn-search"
            aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            aria-expanded={isSearchOpen}
            onClick={() => setIsSearchOpen((v) => !v)}
          >
            🔍
          </button>
        </div>
      </div>

      <div
        ref={searchPanelRef}
        className={
          isSearchOpen
            ? results.length && query.trim()
              ? 'navbar-search navbar-search--open navbar-search--tall'
              : 'navbar-search navbar-search--open'
            : 'navbar-search'
        }
      >
        <div className="navbar-search__inner">
          <form className="navbar-search__form" onSubmit={onSubmitSearch}>
            <input
              ref={searchInputRef}
              className="navbar-search__input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news, pages, and events…"
              aria-label="Search"
              autoComplete="off"
            />
            <button type="submit" className="navbar-search__submit">
              Search
            </button>
          </form>

          {query.trim() && results.length > 0 ? (
            <div className="navbar-search__results" role="listbox" aria-label="Search results">
              {(['news', 'page', 'event'] as const).map((type) => {
                const group = results.filter((r) => r.type === type);
                if (!group.length) return null;
                return (
                  <div key={type} className="navbar-search__group">
                    <div className="navbar-search__groupLabel">{groupLabel(type)}</div>
                    <ul className="navbar-search__hits">
                      {group.map((r) => (
                        <li key={`${r.type}-${r.path}-${r.title}`}>
                          <button type="button" className="navbar-search__hit" onClick={() => goResult(r)}>
                            <span className="navbar-search__hitTitle">{r.title}</span>
                            {r.subtitle ? <span className="navbar-search__hitSub">{r.subtitle}</span> : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="navbar-search__empty">No matches. Try another keyword.</div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
