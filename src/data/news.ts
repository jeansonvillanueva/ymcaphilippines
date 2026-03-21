export type NewsCategory = 'News' | 'Articles' | 'Features';

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
};

import card1 from '../assets/images/latest_news/card1.jpg';
import card2 from '../assets/images/latest_news/card2.jpg';
import card3 from '../assets/images/latest_news/card3.jpg';
import card4 from '../assets/images/latest_news/card4.jpg';
import card5 from '../assets/images/latest_news/card5.jpg';
import card6 from '../assets/images/latest_news/card6.jpg';
import card7 from '../assets/images/latest_news/card7.jpg';
import card8 from '../assets/images/latest_news/card7.jpg';

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
];

export function getNewsArticleMeta(path: NewsArticleMeta['path']) {
  return LATEST_NEWS.find((n) => n.path === path) ?? null;
}

export function getRelatedNews(currentPath: string, limit = 3): NewsArticleMeta[] {
  return LATEST_NEWS.filter((n) => n.path !== currentPath).slice(0, limit);
}

