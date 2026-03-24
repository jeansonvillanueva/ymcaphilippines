import type { LocalYMCAConfig } from '../../../../components/NewsArticle';

const leyteLogo = new URL(
  '../../../../assets/images/local_Y/Leyte/Leyte_Logo.png',
  import.meta.url,
).href;

export const LEYTE_YMCA: LocalYMCAConfig = {
  name: 'YMCA of Leyte',
  logoSrc: leyteLogo,
  socialLinks: {
    facebook: 'https://www.facebook.com/ymcaofleyte',
    // Add local Instagram / X when available
  },
};

