export type NewsCategory = 'News' | 'Articles' | 'Features';

export type LocalYMCAMeta = {
  name: string;
  logoSrc: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    x?: string;
  };
};

export type NewsArticleMeta = {
  /** Route path that must match `App.tsx` routes. */
  path: `/news/${string}`;
  title: string;
  date?: string;
  subtitle?: string;
  /** Card/article image. Omit/null to use the template placeholder. */
  imageUrl?: string | null;
  category: NewsCategory;
  /** Used by the Topic filter in "Y Latest News". */
  topic: string;
  /** Full article body content */
  body?: string;
  /** Local YMCA information for sidebar */
  localYMCA?: LocalYMCAMeta;
  /** Website URL for sidebar */
  websiteUrl?: string;
};

import card1 from '../assets/images/latest_news/card1.jpg';
import card2 from '../assets/images/latest_news/card2.jpg';
import card3 from '../assets/images/latest_news/card3.jpg';
import card4 from '../assets/images/latest_news/card4.jpg';
import card5 from '../assets/images/latest_news/card5.jpg';
import card6 from '../assets/images/latest_news/card6.jpg';
import card7 from '../assets/images/latest_news/card7.jpg';
import card8 from '../assets/images/latest_news/card7.jpg';
import ymcaLogo from '../assets/images/logo.webp';

export const NEWS_FEATURED_IMAGE = card1;

export const LATEST_NEWS: NewsArticleMeta[] = [
  {
    path: '/news/Card_One',
    title: 'Teachers Training Program',
    date: 'November 6-7, 2026',
    imageUrl: card1,
    category: 'News',
    topic: 'Education',
  },
  {
    path: '/news/Card_Two',
    title: 'Basic Training for Support Staff',
    date: 'September 29 – October 4, 2025',
    imageUrl: card2,
    category: 'News',
    topic: 'Training',
  },
  {
    path: '/news/Card_Three',
    title: '45th Rizal Youth Leadership Training Institute (RYLTI)',
    date: 'November 6-7, 2026',
    subtitle: 'Leadership beyond Limits: Powering Vision 2030 through Youth Actions',
    imageUrl: card3,
    category: 'News',
    topic: 'Youth Leadership',
  },
  { path: '/news/Card_Four', 
    title: 'YMCA National Eco-Heroes Training', 
    imageUrl: card4,
    category: 'News',
    topic: 'Environment',
  },
  { path: '/news/Card_Five', 
    title: 'YMCA & YWCA National Youth Summit', 
    imageUrl: card5,
    category: 'News',
    topic: 'Youth Summit',
  },
  {
    path: '/news/Card_Six',
    title: 'The 53rd National Council Meeting & 113th Anniversary Celebration',
    imageUrl: card6,
    category: 'News',
    topic: 'Leadership',
  },
  {
    path: '/news/Card_Seven',
    title: 'A Transformative Journey: The 7th National Youth Assembly',
    imageUrl: card7,
    category: 'News',
    topic: 'National Youth Assembly',
  },
  {
    path: '/news/Card_Eight',
    title: 'YMCA Career Development Program',
    subtitle: 'Preparing Young Professionals through the YMCA Career Development Program 2024',
    imageUrl: card8,
    category: 'Articles',
    topic: 'Careers',
  },
  {
    path: '/news/Article_One',
    title: 'College Y Club General Assembly & Induction of Officers',
    date: 'March 12, 2026 at 10:59 AM',
    subtitle: 'Leyte – Unity in action, service in spirit.',
    imageUrl: card8,
    category: 'Articles',
    topic: 'Youth Leadership',
    body: '<p>Unity in action, service in spirit of responsibility of turning collective goals into action through teamwork, dedication and the true essence of "bayanihan".</p>\n<p>With the theme "BALAYANING: Tahanan ng mga Layunin, Nagkakaisa-ang Tuparin-sa" the event highlighted the spirit of unity and collaboration among youth leaders. Like a home built together, each member shares the responsibility of turning collective goals into action through teamwork, dedication and the true essence of "bayanihan".</p>\n<p>The induction ceremony marked a new chapter for the officers who have committed themselves to lead with integrity and passion in advancing the mission of the YMCA.</p>\n<p>Congratulations to all newly inducted officers and participating College Y chapters!</p>',
    localYMCA: {
      name: 'YMCA of Manila',
      logoSrc: ymcaLogo,
      socialLinks: {
        facebook: 'https://www.facebook.com/ymcaofmanila',
        instagram: 'https://www.instagram.com/ymcaofmanila',
        x: 'https://twitter.com/ymcaofmanila',
      },
    },
    websiteUrl: 'https://www.ymcaofmanila.org.ph',
  },
  {
    path: '/news/Article_Two',
    title: 'YMCA Career Development Program',
    date: 'March 12, 2026 at 10:59 AM',
    subtitle: 'Leyte – Unity in action, service in spirit.',
    imageUrl: card8,
    category: 'Articles',
    topic: 'Youth Leadership',
  },
];

export function getNewsArticleMeta(path: NewsArticleMeta['path']) {
  return LATEST_NEWS.find((n) => n.path === path) ?? null;
}

export function getRelatedNews(currentPath: string, limit = 3): NewsArticleMeta[] {
  return LATEST_NEWS.filter((n) => n.path !== currentPath).slice(0, limit);
}

