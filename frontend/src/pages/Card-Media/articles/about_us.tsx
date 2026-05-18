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
    details: 'Every young person has the ability to contribute to improving their own health and the health of the communities in which they live. Through YMCA programmes, young people care for their physical, spiritual and mental health.',
  },
  {
    id: 'employment',
    title: 'Employment',
    imageUrl: employment,
    details: 'Young people are valuable economic participants and have a right to contribute to the world development and wellbeing. Through YMCA programmes, young people address issues relating to youth employment and economic empowerment.',
  },
  {
    id: 'environment',
    title: 'Environment',
    imageUrl: environment,
    details: 'Every young person has the ability to contribute to reducing environmental degradation and its consequences. Through YMCA programmes, young people coordinate sustainable practices and advocating on issues relating to the environment and climate change.',
  },
  {
    id: 'youth',
    title: 'Youth Engagement',
    imageUrl: youth,
    details: 'By providing empowering programs and services, safe places to be with their peers and the chance to express themselves, we are working together with youth to move the obstacles in their way to greater things. With mentorship, encouragement and mutual problem solving, we can support youth as they develop into the role models and leaders our communities need.',
  },
  {
    id: 'community',
    title: 'Community Initiatives',
    imageUrl: community,
    details: 'A vibrant, healthy community offers opportunities for everyone. At the YMCA, that often means stepping forward with a new program or service to address specific and unique needs in the communities we serve. It may also mean reaching out, beyond our walls, to deliver programs where they are needed most.',
  },
  {
    id: 'global',
    title: 'Global Initiatives',
    imageUrl: global,
    details: 'The YMCA of the Philippines is only part of the YMCA story. In fact, the YMCA is a global network with YMCAs in 119 countries all over the world! While the YMCA looks a bit different from country to country, were all united by our passion to improve the lives of the people, particularly young people, in our communities.',
  },
];

export default function About_Us() {
  const [flippedId, setFlippedId] = useState<string | null>(null);

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
            const isFlipped = flippedId === card.id;
            return (
              <article
                key={card.id}
                className={`about-us-article__card ${isFlipped ? 'is-flipped' : ''}`}
              >
                <div className="about-us-article__cardInner">
                  {/* Front of card */}
                  <button
                    type="button"
                    className="about-us-article__cardFront"
                    onClick={() => setFlippedId(card.id)}
                    aria-label={`Click to view ${card.title} details`}
                  >
                    <img src={card.imageUrl} alt={card.title} />
                    <span>{card.title}</span>
                  </button>

                  {/* Back of card */}
                  <div className="about-us-article__cardBack">
                    <button
                      type="button"
                      className="about-us-article__cardBackBtn"
                      onClick={() => setFlippedId(null)}
                      aria-label={`Click to close ${card.title} details`}
                    >
                      ×
                    </button>
                    <div className="about-us-article__cardBackContent">
                      <h3>{card.title}</h3>
                      <p>{card.details}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}