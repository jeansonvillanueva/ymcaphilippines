import React, { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import '../styles/design-system.css';
import './Home.css';
import orlandoImage from '../assets/images/staff/orland_ocarreon.png'
import christineImage from '../assets/images/staff/ianne_aquino.png'
import cyrilImage from '../assets/images/staff/cyril_morris.png'
import maricelImage from '../assets/images/staff/maricel_taguba.png'
import angleImage from '../assets/images/staff/angel_barros.png'
import edzinaImage from '../assets/images/staff/edzina_bedes.png'
import marlonImage from '../assets/images/staff/marlon_mendoza.png'
import christopherImage from '../assets/images/staff/christopher_annang.png'
import armandoImage from '../assets/images/staff/armando_tan.png'


import presidentKeh from '../assets/images/president/Keh.png';
import presidentYang from '../assets/images/president/Yang.png';
import pillarCommunityWellbeing from '../assets/images/pillars/community_wellbeing.png';
import pillarMeaningWork from '../assets/images/pillars/meaning_work.png';
import pillarSustainablePlanet from '../assets/images/pillars/sustainable_planet.png';
import pillarJustWorld from '../assets/images/pillars/just_world.png';
import SubjectHeader from '../components/SubjectHeader';
import OrgChartCard from '../components/OrgChartCard';
import Partners from '../components/Partners';

import vision from '../assets/images/partners/vision_2030.png';

type HeroSlide = {
  image: string;
  heading: string;
  subheading: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80',
    heading: 'Helping Filipino youth improve their lives.',
    subheading:
      'From Luzon to Mindanao, YMCA programs support young people in spirit, mind and body.',
  },
  {
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1600&q=80',
    heading: 'Safe spaces to grow and belong.',
    subheading:
      'Our clubs and camps give every child a welcoming place to learn, play and lead.',
  },
  {
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80',
    heading: 'Communities stronger together.',
    subheading:
      'Volunteers, staff and partners working side by side to build a better future.',
  },
];


type OrgProfile = {
  name: string;
  position: string;
  imageUrl?: string | null;
};

type OrgDepartment = {
  key: string;
  label: string;
  members: OrgProfile[];
};

const OIC_NATIONAL_GENERAL_SECRETARY: OrgProfile = {
  name: 'Orlando F. Carreon',
  position: 'OIC – National General Secretary',
  imageUrl: orlandoImage,
};

const ORG_DEPARTMENTS: OrgDepartment[] = [
  {
    key: 'program',
    label: 'Program Department',
    members: [
      {
        name: 'Ianne Christine J. Aquino',
        position: 'OIC – Secretary for Programs',
        imageUrl: christineImage,
      },
      {
        name: 'Cyril James S. Morris',
        position: 'Program Assistance',
        imageUrl: cyrilImage,
      },
    ],
  },
  {
    key: 'accounting',
    label: 'Accounting Department',
    members: [
      {
        name: 'Angel Karen B. Barros',
        position: 'Accounting Clerk',
        imageUrl: angleImage,
      },
      {
        name: 'Maricel M. Taguba',
        position: 'Cashier',
        imageUrl: maricelImage,
      },
    ],
  },
  {
    key: 'administration',
    label: 'Administration Department',
    members: [
      {
        name: 'Edzina T. Bedes',
        position: 'Technical Support / Office Secretary',
        imageUrl: edzinaImage,
      },
      {
        name: 'Marlon Mendoza',
        position: 'Maintenance',
        imageUrl: marlonImage,
      },
      {
        name: 'Armando G. Tan',
        position: 'Janitor',
        imageUrl: armandoImage,
      },
    ],
  },
  {
    key: 'parking',
    label: 'Parking Staff',
    members: [
      {
        name: 'Christopher A. Annang',
        position: 'Parking Attendant',
        imageUrl: christopherImage,
      },
    ],
  },
];

function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const [pillarsHover, setPillarsHover] = useState(false);
  const [pillarsActiveSlide, setPillarsActiveSlide] = useState(0);
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [activeOrgDeptIndex, setActiveOrgDeptIndex] = useState(0);
  const orgDeptCount = ORG_DEPARTMENTS.length;

  const PILLARS: {
    key: string;
    label: string;
    icon: string;
    detailSlides: { title: string; body: React.ReactNode }[];
  }[] = [
    {
      key: 'community-wellbeing',
      label: 'Community Wellbeing',
      icon: pillarCommunityWellbeing,
      detailSlides: [
        {
          title: 'Core Belief',
          body: (
            <p>
              The YMCA believes that every person should have the means to grow and thrive in body, mind and
              spirit while taking care of their individual and collective wellbeing.
            </p>
          ),
        },
        {
          title: 'Our Pledge',
          body: (
            <p>
              By 2030 the YMCA will co-create, provide and advocate for high-quality, relevant and sustainable
              health and wellbeing solutions to young people and communities worldwide.
            </p>
          ),
        },
        {
          title: 'Strategic Goals',
          body: (
            <ul className="pillars-detail__list">
              <li>
                <strong>Our YMCAs:</strong> The YMCA Movement will review and develop relevant policies and
                practices so that its staff and volunteers at all levels work in a culture where individual,
                organisational and community wellbeing is a fundamental priority.
              </li>
              <li>
                <strong>Our Communities:</strong> By 2030 the YMCA strengthens and expands safe, inclusive
                spaces at all levels, empowering every person we serve to care for their physical, spiritual and
                mental health, and the broader wellbeing and resilience of their families and communities.
              </li>
              <li>
                <strong>Our World:</strong> The YMCA effectively champions improved policies and practices for
                keeping children and young people safe from harm, abuse and neglect at local, national and
                global levels.
              </li>
            </ul>
          ),
        },
      ],
    },
    {
      key: 'meaningful-work',
      label: 'Meaningful Work',
      icon: pillarMeaningWork,
      detailSlides: [
        { title: 'Core Belief', body: <p>The YMCA Movement
          believes that all young
          people deserve the
          right to learn, engage in
          flexible, dignified and
          meaningful work, and
          build sustainable
          livelihoods.</p> },
        { title: 'Our Pledge', body: <p>The YMCA commits to creating, expanding and advocating meaningful, just and equitable education,
          training, employment and entrepreneurship opportunities in the transition to the new economies.</p> },
        {
          title: 'Strategic Goals',
          body: (
            <ul className="pillars-detail__list">
              <li>Our YMCAs: The YMCA will review and develop its policies and practices to become a Movement
              where all its employees benefit from decent, meaningful, dignified and equitable work, as well as
              lifelong learning opportunities.</li>
              <li>Our Communities: By 2030, the YMCA Movement creates, strengthens and scales sustainable
              education, upskilling, employment and entrepreneurship opportunities for young people and
              communities worldwide, with a focus on increasing their readiness for the Future of Work.</li>
              <li>Our World: The YMCA amplifies the voices of young people and communities and advocates
              policies to ensure decent, flexible, meaningful and equitable access to employment,
              entrepreneurship and training opportunities.</li>
            </ul>
          ),
        },
      ],
    },
    {
      key: 'sustainable-planet',
      label: 'Sustainable Planet',
      icon: pillarSustainablePlanet,
      detailSlides: [
        { title: 'Core Belief', body: <p>The YMCA believes that we
          should all commit and take
          action for the protection and
          regeneration of our Planet,
          preparing for a Just Transition
          to a world where humans live
          in full harmony with Nature.</p> },
        { title: 'Our Pledge', body: <p>The YMCA commits to become a Greener Movement, an active youth voice on climate justice and
          champion of youth-led sustainability solutions.</p> },
        {
          title: 'Strategic Goals',
          body: (
            <ul className="pillars-detail__list">
              <li>Our YMCAs: The YMCA will take steps towards becoming a climate-neutral* Movement, building a
              roadmap that will allow all YMCAs to make measurable and meaningful progress in their policies and
              practices based on local realities.</li>
              <li>Our Communities: The YMCA Movement inspires its members, staff, volunteers and community
              stakeholders to practice and champion environmental responsibility while also integrating
              climate education components for young people and communities in its programmes worldwide.
              </li>
              <li>Our World: The YMCA will champion global solutions and policies to support a Just Transition to a
              Green Economy, making sure that no one is left behind as we work together towards the regeneration
              and protection of our Planet.</li>
            </ul>
          ),
        },
      ],
    },
    {
      key: 'just-world',
      label: 'Just World',
      icon: pillarJustWorld,
      detailSlides: [
        { title: 'Core Belief', body: <p>The YMCA believes in
          the power of young
          people and communities
          to promote and
          advance justice, peace,
          equity and human rights
          for all.</p> },
        { title: 'Our Pledge', body: <p>The YMCA will become a global voice in the fight against systemic discrimination, inequity, injustice
          and racism in all its forms, amplifying the voices of young people and communities where it is active
          to ensure that everyone’s voice is heard.</p> },
        {
          title: 'Strategic Goals',
          body: (
            <ul className="pillars-detail__list">
              <li>Our YMCAs: By 2030, the YMCA commits to adapt its policies, practices and programmes to
              become a truly equitable, diverse and inclusive Movement in the fight against all types of
              discrimination.</li>
              <li>Our Communities: The YMCA will empower young people to become peace builders and
              transformative activists, leaders and advocates for diversity, equity, inclusion and social change.</li>
              <li>Our World: The YMCA will amplify the voices of young people and communities worldwide to
              ensure that all people, including vulnerable and marginalised communities, are treated with dignity
              and their voice is heard and acted upon.</li>
            </ul>
          ),
        },
      ],
    },
  ];

  const activePillar = PILLARS[activePillarIndex];
  const activeSlides = activePillar.detailSlides;

  useEffect(() => {
    if (!pillarsHover) return;
    const id = window.setInterval(() => {
      setPillarsActiveSlide((prev) => (prev + 1) % activeSlides.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, [pillarsHover, activeSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // change slide every 5s
  
    return () => clearInterval(interval);
  }, [HERO_SLIDES.length]);

  useEffect(() => {
    if (orgDeptCount <= 1) return;
    const id = window.setInterval(() => {
      setActiveOrgDeptIndex((prev) => (prev + 1) % orgDeptCount);
    }, 10000);
    return () => window.clearInterval(id);
  }, [orgDeptCount]);

  return (
    <div ref={sectionRef} className="who-is-y-page">

      {/* Hero slider */}
      <section className="home-hero">
        {HERO_SLIDES.map((slide, index) => (
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
                <a href="#about" className="home-hero__cta">
                  Find out more here
                </a>
              </div>
            </div>
          </div>
        ))}

        <div className="home-hero__dots">
          {HERO_SLIDES.map((_, index) => (
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

            {/* Vision 2030 */}
            <section className="page-section page-section--gold">
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
              <iframe
                src="https://www.youtube.com/embed/KfGMl7ov2x8?si=qNnH4FVdON86cXLa"
                title="YMCA Vision 2030"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>


      {/* VISION • MISSION • PILLARS OF IMPACT */}
      <section id="vmv" className="page-section page-section--white">
        <div className="page-section__inner reveal">
          <div className="ymca-vmv">
            <div id="vision" className="ymca-vmv__block reveal">
              <h2 className="ymca-vmv__title">VISION</h2>
              <div className="ymca-vmv__bar">
                <p className="ymca-vmv__kicker">What is our Vision for the world?</p>
                <p className="ymca-vmv__text">
                Our vision is a world where every person lives in harmony with self, with society and with creation.
                </p>
              </div>
            </div>

            <div id="mission" className="ymca-vmv__block reveal reveal-delay-1">
              <h2 className="ymca-vmv__title">MISSION</h2>
              <div className="ymca-vmv__bar">
                <p className="ymca-vmv__kicker">How will we get to our destination?</p>
                <p className="ymca-vmv__text">
                  The YMCA’s mission is to empower young people and communities worldwide to build a just, sustainable, equitable and inclusive world, where every person can thrive in body, mind and spirit.
                </p>
              </div>
            </div>

            <div className="ymca-vmv__block">
              <h2 className="ymca-vmv__title">PILLARS OF IMPACT</h2>

              <div className="pillars-grid" role="list" aria-label="Pillars of Impact">
                {PILLARS.map((pillar, index) => (
                  <button
                    key={pillar.key}
                    type="button"
                    className={`pillar-card ${
                      index === activePillarIndex ? 'pillar-card--active' : ''
                    }`}
                    onClick={() => {
                      setActivePillarIndex(index);
                      setPillarsActiveSlide(0);
                      setPillarsHover(true);
                    }}
                    aria-pressed={index === activePillarIndex}
                  >
                    <div className="pillar-card__icon" aria-hidden>
                      <img
                        className="pillar-card__iconImage"
                        src={pillar.icon}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="pillar-card__label">{pillar.label}</div>
                  </button>
                ))}
              </div>

              <div
                className={`pillars-detail ${pillarsHover ? 'pillars-detail--active' : ''}`}
                onMouseEnter={() => setPillarsHover(true)}
                onMouseLeave={() => setPillarsHover(false)}
                onFocus={() => setPillarsHover(true)}
                onBlur={() => setPillarsHover(false)}
                onClick={() => {
                  if (!pillarsHover) return;
                  setPillarsActiveSlide((prev) => (prev + 1) % activeSlides.length);
                }}
                onKeyDown={(e) => {
                  if (!pillarsHover) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setPillarsActiveSlide((prev) => (prev + 1) % activeSlides.length);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Pillars details (click to next page)"
              >

                <div className="pillars-detail__back" aria-hidden={!pillarsHover}>
                  <div className="pillars-detail__pillartag" aria-hidden>
                    {activePillar.label}
                  </div>

                  <div className="pillars-detail__slides" role="region" aria-label="Pillars details">
                    {activeSlides.map((slide, index) => (
                      <div
                        key={slide.title}
                        className={
                          index === pillarsActiveSlide
                            ? 'pillars-detail__slide pillars-detail__slide--active'
                            : 'pillars-detail__slide'
                        }
                      >
                        <h3 className="pillars-detail__title">{slide.title}</h3>
                        <div className="pillars-detail__body">{slide.body}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pillars-detail__dots" role="tablist" aria-label="Pillars detail pages">
                    {activeSlides.map((slide, index) => (
                      <button
                        key={slide.title}
                        type="button"
                        className={
                          index === pillarsActiveSlide
                            ? 'pillars-detail__dot pillars-detail__dot--active'
                            : 'pillars-detail__dot'
                        }
                        onClick={() => setPillarsActiveSlide(index)}
                        aria-label={`Show ${slide.title}`}
                        aria-selected={index === pillarsActiveSlide}
                        role="tab"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section id="history" className="page-section page-section--white history-section">
        <div className="page-section__inner">
          <div className="history-hero reveal">
            <div className="history-hero__header">
              <div className="history-hero__title">
                Histor<span className="history-hero__y">Y</span>
              </div>
              <div className="history-hero__line" aria-hidden />
            </div>

            <div className="history-hero__panel reveal reveal-delay-1">
              <img
                className="history-hero__president history-hero__president--left"
                src={presidentYang}
                alt="President"
                loading="lazy"
              />
              <img
                className="history-hero__president history-hero__president--right"
                src={presidentKeh}
                alt="President"
                loading="lazy"
              />

              <div className="history-hero__videoFrame">
                <div className="history-hero__videoInner">
                  <iframe
                    src="https://www.youtube.com/embed/fSzM4_k4nIM"
                    title="YMCA History"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORG CHART */}
      <section id="meet-family" className="page-section page-section--white">
        <div className="page-section__inner">
          <SubjectHeader text="Meet Our Family" className="reveal" />

          <p className="meet-family__subtitle reveal">
            YMCA of the Philippines Organizational Chart
          </p>

          <div className="org-chart-meet">
            {/* Static OIC (not part of the department slider) */}
            <div className="org-chart-oic reveal reveal-delay-1">
              <OrgChartCard
                name={OIC_NATIONAL_GENERAL_SECRETARY.name}
                position={OIC_NATIONAL_GENERAL_SECRETARY.position}
                imageUrl={OIC_NATIONAL_GENERAL_SECRETARY.imageUrl}
              />
            </div>

            {/* Department slider */}
            <div className="org-dept-slider reveal reveal-delay-2">
              <div className="org-dept-slider__header">
                <div className="org-dept-slider__kicker">Department</div>
                <h3 className="org-dept-slider__title">{ORG_DEPARTMENTS[activeOrgDeptIndex].label}</h3>
              </div>

              <div className="org-dept-slider__grid" aria-label="Department members">
                {ORG_DEPARTMENTS[activeOrgDeptIndex].members.map((person) => (
                  <OrgChartCard key={person.name} name={person.name} position={person.position} imageUrl={person.imageUrl} />
                ))}
              </div>

              <div className="org-dept-slider__dots" role="tablist" aria-label="Department slides">
                {ORG_DEPARTMENTS.map((dept, index) => (
                  <button
                    key={dept.key}
                    type="button"
                    className={`org-dept-slider-dot ${index === activeOrgDeptIndex ? 'org-dept-slider-dot--active' : ''}`}
                    onClick={() => setActiveOrgDeptIndex(index)}
                    aria-label={`Show ${dept.label}`}
                    aria-selected={index === activeOrgDeptIndex}
                    role="tab"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
