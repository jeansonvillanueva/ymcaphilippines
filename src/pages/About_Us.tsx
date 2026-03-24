import { useEffect, useState } from 'react';
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

import pillarCommunityWellbeing from '../assets/images/pillars/community_wellbeing.png';
import pillarMeaningWork from '../assets/images/pillars/meaning_work.png';
import pillarSustainablePlanet from '../assets/images/pillars/sustainable_planet.png';
import pillarJustWorld from '../assets/images/pillars/just_world.png';

import SubjectHeader from '../components/SubjectHeader';
import OrgChartCard from '../components/OrgChartCard';
import Partners from '../components/Partners';
import aboutLeadImage from '../assets/images/About_Us/YMCA-Fun-Run.webp';
import ymcaLogo from '../assets/images/logo.webp';

// type OrgProfile = {
//   name: string;
//   position: string;
//   imageUrl?: string | null;
// };

const ORG_STRUCTURE = {
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
      children: [
        { name: 'Vacant', position: 'Member Association Assistant', imageUrl: null },
      ],
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
            { name: 'Vacant', position: 'Administrative Assistant', imageUrl: null },
            { name: 'Vacant', position: 'IT Support Staff', imageUrl: null },
            { name: 'Vacant', position: 'Watchman', imageUrl: null },
          ],
        },
      ],
    },
  ],
};

function AboutUs() {
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const [pillarsHover] = useState(false);
  const [activePillarIndex] = useState(0);
  const [, setPillarsActiveSlide] = useState(0);

  const PILLARS = [
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
      ],
    },
    {
      key: 'meaningful-work',
      label: 'Meaningful Work',
      icon: pillarMeaningWork,
      detailSlides: [
        {
          title: 'Core Belief',
          body: (
            <p>
              The YMCA Movement believes that all young people deserve the right to learn, engage in flexible,
              dignified and meaningful work, and build sustainable livelihoods.
            </p>
          ),
        },
        {
          title: 'Our Pledge',
          body: (
            <p>
              The YMCA commits to creating, expanding and advocating meaningful, just and equitable education,
              training, employment and entrepreneurship opportunities.
            </p>
          ),
        },
      ],
    },
    {
      key: 'sustainable-planet',
      label: 'Sustainable Planet',
      icon: pillarSustainablePlanet,
      detailSlides: [
        {
          title: 'Core Belief',
          body: (
            <p>
              The YMCA believes that we should all commit and take action for the protection and regeneration
              of our Planet.
            </p>
          ),
        },
        {
          title: 'Our Pledge',
          body: (
            <p>
              The YMCA commits to become a Greener Movement, an active youth voice on climate justice.
            </p>
          ),
        },
      ],
    },
    {
      key: 'just-world',
      label: 'Just World',
      icon: pillarJustWorld,
      detailSlides: [
        {
          title: 'Core Belief',
          body: (
            <p>
              The YMCA believes in the power of young people and communities to promote and advance justice,
              peace, equity and human rights for all.
            </p>
          ),
        },
        {
          title: 'Our Pledge',
          body: (
            <p>
              The YMCA will become a global voice in the fight against systemic discrimination, inequity,
              injustice and racism in all its forms.
            </p>
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

  return (
    <div ref={sectionRef} className="who-is-y-page">
      {/* ABOUT US */}
      <section id="about-us" className="page-section page-section--white">
        <div className="page-section__inner">
          <SubjectHeader text="About Us" className="reveal" />
          <p className="about-us__subtitle reveal">
            The YMCA is a nonprofit organization that has been helping Filipino youth improve their lives since 1911.
          </p>

          <div className="about-us-top reveal reveal-delay-1">
            <img src={aboutLeadImage} alt="YMCA community event" className="about-us-top__image" />
            <div className="about-us-top__content">
              <h3>Building stronger communities, one local YMCA at a time.</h3>
              <p>
                Learn more about our core initiatives in health, youth engagement, employment, environment, and global collaboration.
              </p>
              <Link to="/about-us/highlights" className="about-us-top__cta">
                Explore About Us Highlights
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ORG CHART */}
      <section id="meet-family" className="page-section page-section--white">
        <div className="page-section__inner">
          <SubjectHeader text="Meet Our Family" className="reveal" />
          <p className="meet-family__subtitle reveal">YMCA of the Philippines Organizational Chart</p>

          <div className="org-tree">
            <div className="org-tree__head">
              <OrgChartCard {...ORG_STRUCTURE.head} />
            </div>

            <div className="org-tree__branches">
              {ORG_STRUCTURE.branches.map((branch, i) => (
                <div key={i} className="org-tree__branch">
                  <OrgChartCard
                    name={branch.name || branch.title || 'Vacant'}
                    position={branch.position || 'Vacant'}
                    imageUrl={branch.imageUrl || ymcaLogo}
                  />

                  <div className="org-tree__children">
                    {branch.children?.map((child: any, idx: number) => {
                      if (child.members) {
                        return (
                          <div key={idx} className="org-tree__subgroup">
                            {child.members.map((m: any, j: number) => (
                              <OrgChartCard
                                key={j}
                                name={m.name || 'Vacant'}
                                position={m.position || 'Vacant'}
                                imageUrl={m.imageUrl || ymcaLogo}
                              />
                            ))}
                          </div>
                        );
                      }

                      return (
                        <OrgChartCard
                          key={idx}
                          name={child.name || 'Vacant'}
                          position={child.position || 'Vacant'}
                          imageUrl={child.imageUrl || ymcaLogo}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners-section" className="partners-section">
        <div className="page-section__inner reveal">
          <Partners />
        </div>
      </section>
    </div>
  );
}

export default AboutUs;