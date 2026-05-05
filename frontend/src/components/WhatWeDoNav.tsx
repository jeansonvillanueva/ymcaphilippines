import { useState } from 'react';

interface NavigationLink {
  id: string;
  label: string;
  icon: string;
}

const SECTIONS: NavigationLink[] = [
  { id: 'latest-news', label: 'Latest News', icon: '📄' },
  { id: 'calendar', label: 'Calendar of Activities', icon: '📅' },
  { id: 'documents', label: 'Documents', icon: '📁' },
];

export default function WhatWeDoNav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (sectionId: string) => {
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="what-we-do-nav">
      <style>{`
        .what-we-do-nav {
          position: relative;
          margin-bottom: 1rem;
        }

        .what-we-do-nav__button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, var(--ymca-navy) 0%, #1a2d5c 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .what-we-do-nav__button:hover {
          background: linear-gradient(135deg, #1a2d5c 0%, #0f1a3a 100%);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .what-we-do-nav__button:active {
          transform: scale(0.98);
        }

        .what-we-do-nav__icon {
          font-size: 1.1rem;
        }

        .what-we-do-nav__arrow {
          font-size: 0.8rem;
          transition: transform 0.3s;
        }

        .what-we-do-nav__button.open .what-we-do-nav__arrow {
          transform: rotate(180deg);
        }

        .what-we-do-nav__menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          margin-top: 0.5rem;
          min-width: 240px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          z-index: 1000;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .what-we-do-nav__menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 0.95rem;
          color: var(--ymca-text);
          transition: background-color 0.2s;
        }

        .what-we-do-nav__menu-item:hover {
          background-color: #f5f5f5;
        }

        .what-we-do-nav__menu-item:active {
          background-color: #ececec;
        }

        .what-we-do-nav__menu-item-icon {
          font-size: 1.1rem;
          width: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .what-we-do-nav__menu-item-label {
          flex: 1;
          font-weight: 500;
        }

        .what-we-do-nav__overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }

        @media (max-width: 640px) {
          .what-we-do-nav__button {
            padding: 0.625rem 1rem;
            font-size: 0.9rem;
          }

          .what-we-do-nav__menu {
            min-width: 200px;
          }

          .what-we-do-nav__menu-item {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <button
        className={`what-we-do-nav__button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Jump to section"
        aria-expanded={isOpen}
      >
        <span className="what-we-do-nav__icon">📍</span>
        <span>Jump to Section</span>
        <span className="what-we-do-nav__arrow">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="what-we-do-nav__overlay"
            onClick={() => setIsOpen(false)}
          />
          <div className="what-we-do-nav__menu">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                className="what-we-do-nav__menu-item"
                onClick={() => handleNavigate(section.id)}
              >
                <span className="what-we-do-nav__menu-item-icon">{section.icon}</span>
                <span className="what-we-do-nav__menu-item-label">{section.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
