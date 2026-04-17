import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import axios from 'axios';
import { PUBLIC_API_URL } from '../hooks/useApi';
import '../styles/design-system.css';
import './About_Us.css';

import pillarCommunityWellbeing from '../assets/images/pillars/community_wellbeing.png';
import pillarMeaningWork from '../assets/images/pillars/meaning_work.png';
import pillarSustainablePlanet from '../assets/images/pillars/sustainable_planet.png';
import pillarJustWorld from '../assets/images/pillars/just_world.png';

import SubjectHeader from '../components/SubjectHeader';
import OrgChartCard from '../components/OrgChartCard';
import Partners from '../components/Partners';
import aboutLeadImage from '../assets/images/About_Us/YMCA-Fun-Run.webp';
import ymcaLogo from '../assets/images/logo.webp';
import kehPresident from '../assets/images/president/Keh.png';
import yangPresident from '../assets/images/president/Yang.png';
import histoyVideo from '../assets/videos/videoplayback.mp4';

type OrgMember = {
  name: string;
  position: string;
  imageUrl?: string | null;
};

type OrgBranchGroup = {
  group: string;
  members: OrgMember[];
};

type OrgBranchChild = OrgMember | OrgBranchGroup;

type OrgBranch = {
  title?: string;
  name?: string;
  position?: string;
  imageUrl?: string | null;
  children?: OrgBranchChild[];
};

interface StaffData {
  id?: number;
  name: string;
  position: string;
  imageUrl?: string;
  departmentGroup?: string;
  headPosition?: string;
  sequenceOrder?: number;
}

function AboutUs() {
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const [selectedPillarKey, setSelectedPillarKey] = useState('');
  const [detailSlideIndex, setDetailSlideIndex] = useState(0);
  const [isPillarFlipped, setIsPillarFlipped] = useState(false);
  const [orgStructure, setOrgStructure] = useState<{ head: OrgMember; branches: OrgBranch[] } | null>(null);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [staffError, setStaffError] = useState<string | null>(null);

  // Fetch staff data on mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${PUBLIC_API_URL}/staff`);
        const staffList: StaffData[] = response.data;

        if (!staffList || staffList.length === 0) {
          setStaffError('No staff data available');
          setOrgStructure(null);
          setLoadingStaff(false);
          return;
        }

        // Build org structure from API data
        // Group by department
        const byDept: Record<string, StaffData[]> = {};
        staffList.forEach((staff) => {
          const dept = staff.departmentGroup || 'Other';
          if (!byDept[dept]) byDept[dept] = [];
          byDept[dept].push(staff);
        });

        // Sort each department by headPosition first, then by sequenceOrder
        Object.keys(byDept).forEach((dept) => {
          byDept[dept].sort((a, b) => {
            // Staff with headPosition come first
            const aHasHead = a.headPosition && a.headPosition.trim() ? 1 : 0;
            const bHasHead = b.headPosition && b.headPosition.trim() ? 1 : 0;
            if (aHasHead !== bHasHead) {
              return bHasHead - aHasHead; // Head positions first
            }
            // Then sort by sequence order
            return (a.sequenceOrder || 0) - (b.sequenceOrder || 0);
          });
        });

        // Define secretary positions and their corresponding departments
        const secretaryMappings: Record<string, string> = {
          'Secretary for Finance': 'SECRETARY FOR FINANCE',
          'National Program Secretary': 'NATIONAL PROGRAM SECRETARY',
          'Secretary for Member Association': 'SECRETARY FOR MEMBER ASSOCIATION',
          'Secretary for Operation': 'SECRETARY FOR OPERATION'
        };

        // Find head (OIC – National General Secretary)
        const head = staffList.find(
          (s) => s.departmentGroup === 'National General Secretary'
        ) || staffList[0];

        const branches: OrgBranch[] = Object.entries(byDept).map(([dept, members]) => {
          // Don't include the head in branches
          if (dept === 'National General Secretary') {
            return null as any;
          }

          // Prepare children array
          const children: OrgMember[] = members.map((member) => ({
            name: member.name,
            position: member.position,
            imageUrl: member.imageUrl || null,
          }));

          // Check if this department should have a secretary position
          const secretaryPosition = secretaryMappings[dept];
          if (secretaryPosition) {
            // Find if there's already a secretary assigned to this department
            const existingSecretary = members.find((m) => {
              const memberHeadPosition = (m.headPosition || '').trim().toLowerCase();
              const targetHeadPosition = secretaryPosition.trim().toLowerCase();
              return memberHeadPosition === targetHeadPosition;
            });

            if (!existingSecretary) {
              // Add vacant secretary position at the top only when no secretary record exists
              children.unshift({
                name: 'Vacant',
                position: secretaryPosition,
                imageUrl: ymcaLogo,
              });
            }
          }

          return {
            title: dept,
            imageUrl: null,
            children,
          };
        }).filter((branch) => branch !== null) as OrgBranch[];

        setOrgStructure({
          head: {
            name: head?.name || 'Staff',
            position: head?.position || 'Position',
            imageUrl: head?.imageUrl || null,
          },
          branches,
        });
        setStaffError(null);
      } catch (error) {
        console.error('Error fetching staff:', error);
        // Load fallback org structure when API is unavailable
        const fallbackOrgStructure = {
          head: {
            name: 'OIC – National General Secretary',
            position: 'Leadership',
            imageUrl: ymcaLogo,
          },
          branches: [
            {
              title: 'Secretary for Finance',
              imageUrl: null,
              children: [
                { name: 'Vacant', position: 'SECRETARY FOR FINANCE', imageUrl: ymcaLogo },
              ],
            },
            {
              title: 'National Program Secretary',
              imageUrl: null,
              children: [
                { name: 'Vacant', position: 'NATIONAL PROGRAM SECRETARY', imageUrl: ymcaLogo },
              ],
            },
            {
              title: 'Secretary for Member Association',
              imageUrl: null,
              children: [
                { name: 'Vacant', position: 'SECRETARY FOR MEMBER ASSOCIATION', imageUrl: ymcaLogo },
              ],
            },
            {
              title: 'Secretary for Operation',
              imageUrl: null,
              children: [
                { name: 'Vacant', position: 'SECRETARY FOR OPERATION', imageUrl: ymcaLogo },
              ],
            },
          ],
        };
        setOrgStructure(fallbackOrgStructure);
        setStaffError(null);
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchStaff();
  }, []);

  const handlePillarSelect = (pillarKey: string) => {
    setSelectedPillarKey(pillarKey);
    setDetailSlideIndex(0);
    setIsPillarFlipped(true);
  };

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
              The YMCA will co-create, provide and advocate for high-quality, relevant and sustainable
              health and wellbeing solutions to young people and communities worldwide.
            </p>
          ),
        },
        {
          title: 'Strategic Goals',
          body: (
            <div>
              <p><strong>(1) Our YMCAs:</strong> The YMCA Movement will review and develop relevant policies and practices so that its staff and volunteers at all levels work in a culture where individual, organisational and community wellbeing is a fundamental priority.</p>
              <p><strong>(2) Our Communities:</strong> By 2030 the YMCA strengthens and expands safe, inclusive spaces at all levels, empowering every person we serve to care for their physical, spiritual and mental health, and the broader wellbeing and resilience of their families and communities.</p>
              <p><strong>(3) Our World:</strong> The YMCA effectively champions improved policies and practices for keeping children and young people safe from harm, abuse and neglect at local, national and global levels.</p>
            </div>
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
              The YMCA Movement
              believes that all young
              people deserve the
              right to learn, engage in
              flexible, dignified and
              meaningful work, and
              build sustainable
              livelihoods
            </p>
          ),
        },
        {
          title: 'Our Pledge',
          body: (
            <p>
              The YMCA commits to creating, expanding and advocating meaningful, just and equitable education,
              training, employment and entrepreneurship opportunities in the transition to the new economies.
            </p>
          ),
        },
        {
          title: 'Strategic Goals',
          body: (
            <div>
              <p><strong>(1) Our YMCAs:</strong> The YMCA will review and develop its policies and practices to become a Movement where all its employees benefit from decent, meaningful, dignified and equitable work, as well as lifelong learning opportunities.</p>
              <p><strong>(2) Our Communities:</strong> By 2030, the YMCA Movement creates, strengthens and scales sustainable education, upskilling, employment and entrepreneurship opportunities for young people and communities worldwide, with a focus on increasing their readiness for the Future of Work.</p>
              <p><strong>(3) Our World:</strong> The YMCA amplifies the voices of young people and communities and advocates policies to ensure decent, flexible, meaningful and equitable access to employment, entrepreneurship and training opportunities.</p>
            </div>
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
              The YMCA believes that we
              should all commit and take
              action for the protection and
              regeneration of our Planet,
              preparing for a Just Transition
              to a world where humans live
              in full harmony with Nature.
            </p>
          ),
        },
        {
          title: 'Our Pledge',
          body: (
            <p>
              The YMCA commits to become a Greener Movement, an active youth voice on climate justice and
              champion of youth-led sustainability solutions.
            </p>
          ),
        },
        {
          title: 'Strategic Goals',
          body: (
            <div>
              <p><strong>(1) Our YMCAs:</strong> The YMCA will take steps towards becoming a climate-neutral* Movement, building a roadmap that will allow all YMCAs to make measurable and meaningful progress in their policies and practices based on local realities</p>
              <p><strong>(2) Our Communities:</strong> The YMCA Movement inspires its members, staff, volunteers and community stakeholders to practice and champion environmental responsibility while also integrating climate education components for young people and communities in its programmes worldwide.</p>
              <p><strong>(3) Our World:</strong>  The YMCA will champion global solutions and policies to support a Just Transition to Green Economy, making sure that no one is left behind as we work together towards the regeneration and protection of our Plane</p>
            </div>
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
              The YMCA believes in the power of young people and communities to promote and advance justice, peace, equity and human rights for all.
            </p>
          ),
        },
        {
          title: 'Our Pledge',
          body: (
            <p>
              The YMCA will become a global voice in the fight against systemic discrimination, inequity, injustice and racism in all its forms, amplifying the voices of young people and communities where it is active to ensure that everyone’s voice is heard.
            </p>
          ),
        },
        {
          title: 'Strategic Goals',
          body: (
            <div>
              <p><strong>(1) Our YMCAs:</strong>By 2030, the YMCA commits to adapt its policies, practices and programmes to become a truly equitable, diverse and inclusive Movement in the fight against all types of discrimination.</p>
              <p><strong>(2) Our Communities:</strong> The YMCA will empower young people to become peace builders and transformative activists, leaders and advocates for diversity, equity, inclusion and social change</p>
              <p><strong>(3) Our World:</strong>  The YMCA will amplify the voices of young people and communities worldwide to ensure that all people, including vulnerable and marginalised communities, are treated with dignity and their voice is heard and acted upon</p>
            </div>
          ),
        },
      ],
    },
  ];

  const selectedPillar = PILLARS.find((pillar) => pillar.key === selectedPillarKey) || null;

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

      {/* Vision / Mission / Pillars of Impact */}
      <section id="vision-mission-pillars" className="page-section page-section--white">
        <div className="page-section__inner">
          <div className="ymca-vmv">
            <div className="ymca-vmv__block">
              <h2 className="ymca-vmv__title">VISION</h2>
              <div className="ymca-vmv__bar">
                <p className="ymca-vmv__kicker">What is our Vision for the world?</p>
                <p className="ymca-vmv__text">
                  Our vision is a world where every person lives in harmony with self, with society and with creation.
                </p>
              </div>
            </div>

            <div className="ymca-vmv__block">
              <h2 className="ymca-vmv__title">MISSION</h2>
              <div className="ymca-vmv__bar">
                <p className="ymca-vmv__kicker">How will we get to our destination?</p>
                <p className="ymca-vmv__text">
                  The YMCA’s mission is to empower young people and communities worldwide to build a just,
                  sustainable, equitable and inclusive world, where every person can thrive in body, mind and spirit.
                </p>
              </div>
            </div>

            <div className="ymca-vmv__block">
              <h2 className="ymca-vmv__title">PILLARS OF IMPACT</h2>
              <div className="pillars-grid">
                {PILLARS.map((pillar) => {
                  const isActive = pillar.key === selectedPillarKey;
                  return (
                    <button
                      key={pillar.key}
                      type="button"
                      className={`pillar-card ${isActive ? 'pillar-card--active' : ''}`}
                      onClick={() => handlePillarSelect(pillar.key)}
                      aria-label={`Show ${pillar.label} details`}
                    >
                      <span className="pillar-card__icon">
                        <img src={pillar.icon} alt="" className="pillar-card__iconImage" />
                      </span>
                      <span className="pillar-card__label">{pillar.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className={`pillars-detail ${isPillarFlipped ? 'pillars-detail--active' : ''}`}>
                <div className="pillars-detail__front">
                  <span className="pillars-detail__pillartag">Pillars of Impact</span>
                  <h3 className="pillars-detail__title">Click a pillar card to flip</h3>
                  <p className="pillars-detail__body">
                    Explore Core Belief, Our Pledge and Strategic Goals for each pillar using the slider navigation.
                  </p>
                </div>
                <div className="pillars-detail__back">
                  {selectedPillar ? (
                    <>
                      <div className="pillars-detail__slides">
                        {selectedPillar.detailSlides.map((slide, idx) => (
                          <article
                            key={`${selectedPillar.key}-${slide.title}`}
                            className={`pillars-detail__slide ${idx === detailSlideIndex ? 'pillars-detail__slide--active' : ''}`}
                          >
                            <span className="pillars-detail__pillartag">{selectedPillar.label}</span>
                            <h3 className="pillars-detail__title">{slide.title}</h3>
                            <div className="pillars-detail__body">{slide.body}</div>
                          </article>
                        ))}
                      </div>
                      <div className="pillars-detail__nav">
                        <button
                          type="button"
                          className="pillars-detail__navButton"
                          onClick={() => setDetailSlideIndex((prev) => Math.max(0, prev - 1))}
                          disabled={detailSlideIndex === 0}
                        >
                          Previous
                        </button>
                        <span className="pillars-detail__navStatus">
                          {detailSlideIndex + 1} / {selectedPillar.detailSlides.length}
                        </span>
                        <button
                          type="button"
                          className="pillars-detail__navButton"
                          onClick={() => setDetailSlideIndex((prev) => Math.min(selectedPillar.detailSlides.length - 1, prev + 1))}
                          disabled={detailSlideIndex === selectedPillar.detailSlides.length - 1}
                        >
                          Next
                        </button>
                      </div>
                      <div className="pillars-detail__dots">
                        {selectedPillar.detailSlides.map((_, idx) => (
                          <button
                            key={`${selectedPillar.key}-dot-${idx}`}
                            type="button"
                            className={`pillars-detail__dot ${idx === detailSlideIndex ? 'pillars-detail__dot--active' : ''}`}
                            onClick={() => setDetailSlideIndex(idx)}
                            aria-label={`Show ${selectedPillar.detailSlides[idx]?.title} content`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <p>
                      Select a pillar to see Core Belief, Our Pledge, and Strategic Goals.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HistoY */}
      <section id="history" className="page-section histoy-section">
        <div className="page-section__inner">
          <SubjectHeader text="HistorY" className="reveal" />
          <p className="histoy__subtitle reveal">Since arriving in the Philippines in 1899 and formally incorporating in 1911, we have spent over a century at the forefront of community development. From pioneering the country's first Physical Education classes and the first Filipino Boy Scouts troop, we have grown into a nationwide network of local branches. Today, our enduring legacy of nation-building and holistic youth empowerment continues to thrive across the country. </p>

          <div className="histoy-grid reveal reveal-delay-1">
            <figure className="histoy-card histoy-card--right">
              <img src={yangPresident} alt="YMCA President Yang" />
              <figcaption>Teodoro R.Yang</figcaption>
            </figure>

            <div className="histoy-video-wrap">
              <video className="histoy-video" controls preload="metadata">
                <source src={histoyVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <figure className="histoy-card histoy-card--left">
              <img src={kehPresident} alt="YMCA President Keh" />
              <figcaption>Engr. Antonio C. Keh</figcaption>
            </figure>

          </div>
        </div>
      </section>

      {/* ORG CHART */}
      <section id="meet-family" className="page-section page-section--white">
        <div className="page-section__inner">
          <SubjectHeader text="Meet Our Family" className="reveal" />
          <p className="meet-family__subtitle reveal">YMCA of the Philippines Organizational Chart</p>

          {loadingStaff ? (
            <div className="loading">Loading staff members...</div>
          ) : staffError || !orgStructure ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
              <p>{staffError || 'No staff data available'}</p>
            </div>
          ) : (
            <div className="org-tree">
              <div className="org-tree__head">
                <OrgChartCard {...orgStructure.head} />
              </div>

              <div className="org-tree__branches">
                {orgStructure.branches.map((branch, i) => (
                  <div key={i} className="org-tree__branch">
                    <div className="org-tree__children">
                      {branch.children?.map((child: OrgBranchChild, idx: number) => {
                        if ('members' in child && Array.isArray(child.members)) {
                          return (
                            <div key={idx} className="org-tree__subgroup">
                              {child.members.map((m, j) => (
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
                            name={(child as OrgMember).name || 'Vacant'}
                            position={(child as OrgMember).position || 'Vacant'}
                            imageUrl={(child as OrgMember).imageUrl || ymcaLogo}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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