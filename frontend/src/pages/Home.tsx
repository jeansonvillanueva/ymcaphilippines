import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import '../styles/design-system.css';
import './Home.css';
import Partners from '../components/Partners';
import vision from '../assets/images/partners/vision_2030.png';
import VideoShowcase, { type VideoItem } from '../components/VideoShowcase';
import ImpactStats from '../components/ImpactStats';
import EventVenueRental from '../components/EventVenueRental';
import eventVenueImage1 from '../assets/images/rent/event1.jpg';
import eventVenueImage2 from '../assets/images/rent/event2.jpg';
import { LATEST_NEWS } from '../data/news';

type HeroSlide = {
  image: string;
  heading: string;
  subheading: string;
  path: string;
};

const YOUTUBE_VIDEOS: VideoItem[] = [
  {
    id: 'vision2030',
    title: 'YMCA Vision 2030',
    description: 'Global impact stories from the YMCA movement.',
    embedUrl: 'https://www.youtube.com/embed/KfGMl7ov2x8?si=qNnH4FVdON86cXLa',
  },
  {
    id: 'promotion',
    title: 'YMCA Promotion',
    description: 'Discover the impact of YMCA programs worldwide.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/DtnLgLoiYjw?si=nXyG6ENcBuu_ZmG4',
  },
  {
    id: 'program',
    title: 'YMCA 2025 Program',
    description: 'Explore the future of YMCA initiatives.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/g7D2GX2XfGw?si=J84hvIk2igPOoWGA',
  },
  {
    id: 'YWCA_Motion',
    title: 'YWCA Motion',
    description: 'YWCA Greeting from the President of YWCA of the Philippines.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/-KO_7ahfJaY?si=aLqpPop0kLQYZN8X',
  }
];

function parseNewsDate(date?: string) {
  if (!date) return Number.MIN_SAFE_INTEGER;
  const parsed = Date.parse(date);
  if (!Number.isNaN(parsed)) return parsed;
  const year = date.match(/\b(19|20)\d{2}\b/)?.[0];
  if (year) return new Date(`${year}-01-01`).getTime();
  return Number.MIN_SAFE_INTEGER;
}

function Home() {
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = useMemo<HeroSlide[]>(() => {
    const latest = [...LATEST_NEWS]
      .sort((a, b) => parseNewsDate(b.date) - parseNewsDate(a.date))
      .slice(0, 3);

    return latest.map((item) => ({
      image: item.imageUrl ?? '',
      heading: item.title,
      subheading: item.subtitle ?? item.date ?? 'Latest YMCA update',
      path: item.path,
    }));
  }, []);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // change slide every 5s
  
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div ref={sectionRef} className="who-is-y-page">

      {/* Hero slider */}
      <section className="home-hero">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.heading}
            className={
              index === activeSlide
                ? 'home-hero__slide home-hero__slide--active'
                : 'home-hero__slide'
            }
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={index !== activeSlide}
          >
            <div className="home-hero__overlay" />
            <div className="home-hero__content">
              <h1 className="home-hero__title">{slide.heading}</h1>
              <p className="home-hero__subtitle">{slide.subheading}</p>
              <div className="home-hero__cta-row">
                <Link to={slide.path} className="home-hero__cta">Read more</Link>
              </div>
            </div>
          </div>
        ))}

        <div className="home-hero__dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={
                index === activeSlide
                  ? 'home-hero__dot home-hero__dot--active'
                  : 'home-hero__dot'
              }
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <VideoShowcase id="videosHome" heading="YMCA Videos" videos={YOUTUBE_VIDEOS} />

      <EventVenueRental images={[eventVenueImage1, eventVenueImage2]} />

            {/* Vision 2030 */}
        <section id="vision_2030" className="page-section page-section--gold">
        <div className="page-section__inner">
          <div className="vision-2030__layout reveal">
            <div>
              <h2 className="vision-2030__title">
              <a href="https://www.ymca.int/what-we-do/vision-2030/" target="_blank" rel="noopener noreferrer">
                  <img src={vision} alt="Vision 2030" />
                </a>
                <br />
                Global impact, lives changed
              </h2>
              <p className="vision-2030__body">
                Experience the inspiring stories of YMCAs worldwide—from supporting refugees and
                empowering young people, to fostering mental health and sustainability. In 2024, we
                made a series of films showcasing real impact across the four Pillars of YMCA Vision
                2030. We screened them at the Accelerator Summit in Mombasa, and you can see them
                all on the Pillar pages of this website, and on our World YMCA YouTube site.
              </p>
            </div>
            <div className="vision-2030__video-wrap">
              <iframe src="https://www.youtube.com/embed/KfGMl7ov2x8?si=qNnH4FVdON86cXLa" title="YMCA Vision 2030" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      </section>

      <ImpactStats />

      {/* Partners */}
      <section className="partners-section">
        <div className="page-section__inner reveal">
          <Partners />
        </div>
      </section>
    </div>
  );
}

export default Home;
