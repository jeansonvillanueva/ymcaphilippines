import { useState } from 'react';
import './about_us.css';
import youth from '../../../assets/images/About_Us/youth_engagement_img.webp';
import employment from '../../../assets/images/About_Us/employment_img.webp';
import environment from '../../../assets/images/About_Us/environment_img.webp';
import community from '../../../assets/images/About_Us/community_initiatives_img.webp';
import global from '../../../assets/images/About_Us/global_initiatives_img.webp';
import health from '../../../assets/images/About_Us/play.webp';

type AboutCard = {
  id: string;
  title: string;
  imageUrl: string;
  details: string;
};

const ABOUT_CARDS: AboutCard[] = [
  {
    id: 'health',
    title: 'Health',
    imageUrl: health,
    details: 'We build healthy habits through sports, recreation, and safe wellness spaces for all ages.',
  },
  {
    id: 'employment',
    title: 'Employment',
    imageUrl: employment,
    details: 'We support career readiness through training, mentoring, and opportunities for meaningful work.',
  },
  {
    id: 'environment',
    title: 'Environment',
    imageUrl: environment,
    details: 'We empower communities to care for nature through local sustainability and climate initiatives.',
  },
  {
    id: 'youth',
    title: 'Youth Engagement',
    imageUrl: youth,
    details: 'We equip young people with leadership skills, service opportunities, and spaces to belong.',
  },
  {
    id: 'community',
    title: 'Community Initiatives',
    imageUrl: community,
    details: 'We partner with families and local groups to deliver practical support where it matters most.',
  },
  {
    id: 'global',
    title: 'Global Initiatives',
    imageUrl: global,
    details: 'We connect with the worldwide YMCA movement to scale impact and exchange best practices.',
  },
];

export default function About_Us() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="about-us-article page-section page-section--white">
      <div className="page-section__inner">
        <p className="about-us-article__intro">
          At the YMCA, we create opportunities for people to improve their lives and their communities.
          Through empowering young people, improving individual and community well-being, and inspiring
          action, we create meaningful change across the country.
        </p>

        <p className="about-us-article__intro">
          The Y welcomes everyone. Our programs and services are wide-ranging: helping kids realize
          their potential, preparing teens for college and career, supporting families, and improving
          overall well-being in spirit, mind, and body.
        </p>

        <div className="about-us-article__grid">
          {ABOUT_CARDS.map((card) => {
            const expanded = expandedId === card.id;
            return (
              <article key={card.id} className="about-us-article__card">
                <button
                  type="button"
                  className="about-us-article__cardBtn"
                  onClick={() => setExpandedId(expanded ? null : card.id)}
                  aria-expanded={expanded}
                >
                  <img src={card.imageUrl} alt={card.title} />
                  <span>{card.title}</span>
                </button>
                {expanded ? <p className="about-us-article__details">{card.details}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
