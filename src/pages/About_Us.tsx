import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import '../styles/design-system.css';
import './About_Us.css';
import orlandoImage from '../assets/images/staff/orland_ocarreon.png';
import christineImage from '../assets/images/staff/ianne_aquino.png';
import cyrilImage from '../assets/images/staff/cyril_morris.png';
import maricelImage from '../assets/images/staff/maricel_taguba.png';
import angleImage from '../assets/images/staff/angel_barros.png';
import edzinaImage from '../assets/images/staff/edzina_bedes.png';
import marlonImage from '../assets/images/staff/marlon_mendoza.png';
import christopherImage from '../assets/images/staff/christopher_annang.png';
import armandoImage from '../assets/images/staff/armando_tan.png';

import presidentKeh from '../assets/images/president/Keh.png';
import presidentYang from '../assets/images/president/Yang.png';
import pillarCommunityWellbeing from '../assets/images/pillars/community_wellbeing.png';
import pillarMeaningWork from '../assets/images/pillars/meaning_work.png';
import pillarSustainablePlanet from '../assets/images/pillars/sustainable_planet.png';
import pillarJustWorld from '../assets/images/pillars/just_world.png';
import SubjectHeader from '../components/SubjectHeader';
import OrgChartCard from '../components/OrgChartCard';
import Partners from '../components/Partners';
import aboutLeadImage from '../assets/images/About_Us/YMCA-Fun-Run.webp';
import ymcaLogo from '../assets/images/logo.webp';

// ------------------ TYPES ------------------
type OrgProfile = {
  name: string;
  position: string;
  imageUrl?: string | null;
};

type OrgChildNormal = OrgProfile;
type OrgChildGroup = {
  group: string;
  members: OrgProfile[];
};
type OrgChild = OrgChildNormal | OrgChildGroup;

type OrgBranch = {
  name?: string;
  position?: string;
  title?: string;
  imageUrl?: string | null;
  children?: OrgChild[];
};

type OrgStructure = {
  head: OrgProfile;
  branches: OrgBranch[];
};

// ------------------ DATA ------------------
const ORG_STRUCTURE: OrgStructure = {
  head: {
    name: 'Orlando F. Carreon',
    position: 'OIC – National General Secretary',
    imageUrl: orlandoImage,
  },
  branches: [
    {
      title: 'Secretary for Finance',
      imageUrl: null,
      children: [
        { name: 'Maricel M. Taguba', position: 'Cashier', imageUrl: maricelImage },
        { name: 'Angel Karen B. Barros', position: 'Accounting Clerk', imageUrl: angleImage },
      ],
    },
    {
      name: 'Ianne Christine J. Aquino',
      position: 'OIC – National Program Secretary',
      imageUrl: christineImage,
      children: [
        { name: 'Cyril James S. Morris', position: 'Program Assistant', imageUrl: cyrilImage },
      ],
    },
    {
      title: 'Secretary for Member Association',
      imageUrl: null,
      children: [{ name: '', position: 'Member Association Assistant', imageUrl: null }],
    },
    {
      title: 'Secretary for Operation',
      imageUrl: null,
      children: [
        {
          group: 'Line 1',
          members: [
            { name: 'Edzina T. Bedes', position: 'Office Secretary', imageUrl: edzinaImage },
            { name: 'Marlon G. Mendoza', position: 'Maintenance', imageUrl: marlonImage },
            { name: 'Christopher A. Annang', position: 'Parking Attendant', imageUrl: christopherImage },
          ],
        },
        {
          group: 'Line 2',
          members: [
            { name: 'Armando G. Tan', position: 'Janitor / Utility', imageUrl: armandoImage },
            { name: '', position: 'Administrative Assistant', imageUrl: null },
            { name: '', position: 'IT Support Staff', imageUrl: null },
            { name: '', position: 'Watchman', imageUrl: null },
          ],
        },
      ],
    },
  ],
};

// ------------------ COMPONENT ------------------
function About_Us() {
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const [pillarsHover, setPillarsHover] = useState(false);
  const [pillarsActiveSlide, setPillarsActiveSlide] = useState(0);
  const [activePillarIndex, setActivePillarIndex] = useState(0);

  const PILLARS = [
    {
      key: 'community-wellbeing',
      label: 'Community Wellbeing',
      icon: pillarCommunityWellbeing,
      detailSlides: [
        {
          title: 'Core Belief',
          body: <p>The YMCA believes that every person should have the means to grow and thrive in body, mind and spirit while taking care of their individual and collective wellbeing.</p>,
        },
        {
          title: 'Our Pledge',
          body: <p>By 2030 the YMCA will co-create, provide and advocate for high-quality, relevant and sustainable health and wellbeing solutions to young people and communities worldwide.</p>,
        },
        {
          title: 'Strategic Goals',
          body: (
            <ul className="pillars-detail__list">
              <li><strong>Our YMCAs:</strong> The YMCA Movement will review and develop relevant policies and practices so that its staff and volunteers at all levels work in a culture where individual, organisational and community wellbeing is a fundamental priority.</li>
              <li><strong>Our Communities:</strong> By 2030 the YMCA strengthens and expands safe, inclusive spaces at all levels, empowering every person we serve to care for their physical, spiritual and mental health, and the broader wellbeing and resilience of their families and communities.</li>
              <li><strong>Our World:</strong> The YMCA effectively champions improved policies and practices for keeping children and young people safe from harm, abuse and neglect at local, national and global levels.</li>
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
        { title: 'Core Belief', body: <p>The YMCA Movement believes that all young people deserve the right to learn, engage in flexible, dignified and meaningful work, and build sustainable livelihoods.</p> },
        { title: 'Our Pledge', body: <p>The YMCA commits to creating, expanding and advocating meaningful, just and equitable education, training, employment and entrepreneurship opportunities in the transition to the new economies.</p> },
        { title: 'Strategic Goals', body: (
          <ul className="pillars-detail__list">
            <li>Our YMCAs: The YMCA will review and develop its policies and practices to become a Movement where all its employees benefit from decent, meaningful, dignified and equitable work, as well as lifelong learning opportunities.</li>
            <li>Our Communities: By 2030, the YMCA Movement creates, strengthens and scales sustainable education, upskilling, employment and entrepreneurship opportunities for young people and communities worldwide, with a focus on increasing their readiness for the Future of Work.</li>
            <li>Our World: The YMCA amplifies the voices of young people and communities and advocates policies to ensure decent, flexible, meaningful and equitable access to employment, entrepreneurship and training opportunities.</li>
          </ul>
        )},
      ],
    },
    {
      key: 'sustainable-planet',
      label: 'Sustainable Planet',
      icon: pillarSustainablePlanet,
      detailSlides: [
        { title: 'Core Belief', body: <p>The YMCA believes that we should all commit and take action for the protection and regeneration of our Planet, preparing for a Just Transition to a world where humans live in full harmony with Nature.</p> },
        { title: 'Our Pledge', body: <p>The YMCA commits to become a Greener Movement, an active youth voice on climate justice and champion of youth-led sustainability solutions.</p> },
        { title: 'Strategic Goals', body: (
          <ul className="pillars-detail__list">
            <li>Our YMCAs: The YMCA will take steps towards becoming a climate-neutral* Movement, building a roadmap that will allow all YMCAs to make measurable and meaningful progress in their policies and practices based on local realities.</li>
            <li>Our Communities: The YMCA Movement inspires its members, staff, volunteers and community stakeholders to practice and champion environmental responsibility while also integrating climate education components for young people and communities in its programmes worldwide.</li>
            <li>Our World: The YMCA will champion global solutions and policies to support a Just Transition to a Green Economy, making sure that no one is left behind as we work together towards the regeneration and protection of our Planet.</li>
          </ul>
        )},
      ],
    },
    {
      key: 'just-world',
      label: 'Just World',
      icon: pillarJustWorld,
      detailSlides: [
        { title: 'Core Belief', body: <p>The YMCA believes in the power of young people and communities to promote and advance justice, peace, equity and human rights for all.</p> },
        { title: 'Our Pledge', body: <p>The YMCA will become a global voice in the fight against systemic discrimination, inequity, injustice and racism in all its forms, amplifying the voices of young people and communities where it is active to ensure that everyone’s voice is heard.</p> },
        { title: 'Strategic Goals', body: (
          <ul className="pillars-detail__list">
            <li>Our YMCAs: By 2030, the YMCA commits to adapt its policies, practices and programmes to become a truly equitable, diverse and inclusive Movement in the fight against all types of discrimination.</li>
            <li>Our Communities: The YMCA will empower young people to become peace builders and transformative activists, leaders and advocates for diversity, equity, inclusion and social change.</li>
            <li>Our World: The YMCA will amplify the voices of young people and communities worldwide to ensure that all people, including vulnerable and marginalised communities, are treated with dignity and their voice is heard and acted upon.</li>
          </ul>
        )},
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

  return (
    <div ref={sectionRef} className="who-is-y-page">
      {/* About Us Section */}
      <section id="about-us" className="page-section page-section--white">
        <div className="page-section__inner">
          <SubjectHeader text="About Us" className="reveal" />
          <p className="about-us__subtitle reveal">
            The YMCA is a nonprofit organization that has been helping Filipino youth improve their lives since the first YMCA opened in Manila in 1911. YMCA programs are offered at more than 21 locations across the Philippines and help people become healthier in spirit, mind and body. Learn more about our mission, vision and the core values that guide us each and every day.
          </p>

          <div className="about-us-top reveal reveal-delay-1">
            <img src={aboutLeadImage} alt="YMCA community event" className="about-us-top__image" />
            <div className="about-us-top__content">
              <h3>Building stronger communities, one local YMCA at a time.</h3>
              <p>Learn more about our core initiatives in health, youth engagement, employment, environment, community initiatives, and global collaboration.</p>
              <Link to="/about-us/highlights" className="about-us-top__cta">Explore About Us Highlights</Link>
            </div>
          </div>
        </div>
      </section>

      {/* VISION, MISSION, PILLARS */}
      <section id="vmv-section" className="page-section page-section--white">
        <div className="page-section__inner reveal">
          {/* ... PILLARS JSX remains unchanged ... */}
        </div>
      </section>

      {/* HISTORY, ORG CHART, Partners */}
      {/* ... keep existing JSX for history, org chart, partners as is ... */}

    </div>
  );
}

export default About_Us;