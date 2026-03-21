import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { getRelatedNews } from '../data/news';
import '../styles/design-system.css';
import './NewsArticle.css';

export type LocalYMCAConfig = {
  name: string;
  logoSrc: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    x?: string;
  };
};

export interface NewsArticleProps {
  title: string;
  date?: string;
  subtitle?: string;
  /** @deprecated Prefer `heroImageUrls`; kept for existing call sites */
  imageUrl?: string | null;
  /** Rotating header images (15s interval when more than one) */
  heroImageUrls?: string[];
  localYMCA?: LocalYMCAConfig;
  /** Official site or Facebook page shown in sidebar */
  websiteUrl?: string;
  /** Current route path for “More Like This” */
  articlePath?: string;
  layoutVariant?: 'news' | 'article';
  children: ReactNode;
}

const HERO_INTERVAL_MS = 15_000;

export default function NewsArticle({
  title,
  date,
  subtitle,
  imageUrl,
  heroImageUrls,
  localYMCA,
  websiteUrl,
  articlePath,
  layoutVariant = 'news',
  children,
}: NewsArticleProps) {
  const ref = useScrollReveal<HTMLDivElement>();
  const slides = useMemo(() => {
    const fromProp = heroImageUrls?.filter(Boolean) as string[] | undefined;
    if (fromProp && fromProp.length) return fromProp;
    if (imageUrl) return [imageUrl];
    return [];
  }, [heroImageUrls, imageUrl]);

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    setHeroIndex(0);
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % slides.length);
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const related = useMemo(() => {
    if (!articlePath) return [];
    return getRelatedNews(articlePath, 3);
  }, [articlePath]);

  const rootClass =
    layoutVariant === 'article'
      ? 'news-article-page news-article-page--article'
      : 'news-article-page news-article-page--news';

  const articleInner = (
    <>
      {slides.length > 0 ? (
        <div className="news-article-hero" aria-label="Article header images">
          {slides.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={
                i === heroIndex
                  ? 'news-article-hero__slide news-article-hero__slide--active'
                  : 'news-article-hero__slide'
              }
              style={{ backgroundImage: `url(${src})` }}
              aria-hidden={i !== heroIndex}
            />
          ))}
          {slides.length > 1 ? (
            <div className="news-article-hero__dots" role="tablist" aria-label="Header images">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === heroIndex ? 'news-article-hero__dot news-article-hero__dot--active' : 'news-article-hero__dot'}
                  aria-label={`Show image ${i + 1}`}
                  aria-selected={i === heroIndex}
                  onClick={() => setHeroIndex(i)}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <h1 className="news-article__title reveal">{title}</h1>
      {subtitle ? <p className="news-article__subtitle reveal reveal-delay-1">{subtitle}</p> : null}
      {date ? <p className="news-article__date reveal reveal-delay-1">{date}</p> : null}
      <div className="news-article__body reveal reveal-delay-3">{children}</div>
    </>
  );

  return (
    <article className={rootClass} ref={ref}>
      <section className="page-section page-section--white">
        <div className="page-section__inner">
          {localYMCA ? (
            <div className="news-article-layout">
              <aside className="news-article-sidebar" aria-label="Article sidebar">
                <div className="news-article-sidebar__brand">
                  <img src={localYMCA.logoSrc} alt={`${localYMCA.name} logo`} className="news-article-sidebar__logo" />
                  <div className="news-article-sidebar__name">{localYMCA.name}</div>
                </div>

                {websiteUrl ? (
                  <a className="news-article-sidebar__website" href={websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit website
                  </a>
                ) : null}

                {localYMCA.socialLinks?.facebook || localYMCA.socialLinks?.instagram || localYMCA.socialLinks?.x ? (
                  <div className="news-article-sidebar__social" aria-label="Social media links">
                    {localYMCA.socialLinks.facebook ? (
                      <a
                        href={localYMCA.socialLinks.facebook}
                        className="news-article-social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        title="Facebook"
                      >
                        <FaFacebookF />
                      </a>
                    ) : null}
                    {localYMCA.socialLinks.instagram ? (
                      <a
                        href={localYMCA.socialLinks.instagram}
                        className="news-article-social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        title="Instagram"
                      >
                        <FaInstagram />
                      </a>
                    ) : null}
                    {localYMCA.socialLinks.x ? (
                      <a
                        href={localYMCA.socialLinks.x}
                        className="news-article-social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X"
                        title="X"
                      >
                        <FaTwitter />
                      </a>
                    ) : null}
                  </div>
                ) : null}

                {related.length > 0 ? (
                  <div className="news-article-more">
                    <div className="news-article-more__title">More Like This</div>
                    <ul className="news-article-more__list">
                      {related.map((item) => (
                        <li key={item.path}>
                          <Link to={item.path} className="news-article-more__link">
                            <div className="news-article-more__thumb" aria-hidden>
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt="" />
                              ) : null}
                            </div>
                            <div className="news-article-more__meta">
                              <div className="news-article-more__itemTitle">{item.title}</div>
                              {item.date ? <div className="news-article-more__itemDate">{item.date}</div> : null}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </aside>

              <div className="news-article-main" aria-label="Article content">
                {articleInner}
              </div>
            </div>
          ) : (
            <div className="news-article-main news-article-main--solo" aria-label="Article content">
              {articleInner}
              {related.length > 0 ? (
                <div className="news-article-more news-article-more--inline reveal reveal-delay-3">
                  <div className="news-article-more__title">More Like This</div>
                  <ul className="news-article-more__list news-article-more__list--horizontal">
                    {related.map((item) => (
                      <li key={item.path}>
                        <Link to={item.path} className="news-article-more__link">
                          <div className="news-article-more__thumb" aria-hidden>
                            {item.imageUrl ? <img src={item.imageUrl} alt="" /> : null}
                          </div>
                          <div className="news-article-more__meta">
                            <div className="news-article-more__itemTitle">{item.title}</div>
                            {item.date ? <div className="news-article-more__itemDate">{item.date}</div> : null}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
