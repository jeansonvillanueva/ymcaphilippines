import type { LocalYMCAConfig } from '../../../../components/NewsArticle';

const manilaLogo = new URL(
  '../../../../assets/images/local_Y/Manila/Manila_Logo.png',
  import.meta.url,
).href;

export const MANILA_YMCA: LocalYMCAConfig = {
  name: 'YMCA of Manila',
  logoSrc: manilaLogo,
  socialLinks: {
    facebook: 'https://www.facebook.com/YmcaOfManilaOfficial',
    // Add local Instagram / X when available
  },
};

