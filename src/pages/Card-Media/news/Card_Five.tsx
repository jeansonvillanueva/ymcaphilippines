import NewsArticle from "../../../components/NewsArticle";
import { getNewsArticleMeta } from "../../../data/news";

export default function Card_Five() {
  const meta = getNewsArticleMeta('/news/Card_Five');
  return (
    <NewsArticle
      title={meta?.title ?? 'YMCA of the Philippines Installation and Induction 2026'}
      date={meta?.date ?? 'February 2, 2026'}
      subtitle={meta?.subtitle}
      imageUrl={meta?.imageUrl}
      articlePath="/news/Card_Five"
      layoutVariant="news"
    >
      <p>
      The YMCA of the Philippines successfully conducted the Installation and Induction Ceremony for the Term 2026, marking another milestone in the organization’s continuing mission of service and leadership.
      Present during the occasion were distinguished guests and key personalities, including:
      - Mr. Robin Carlo Reyes, Political Affairs Officer at the House of Representatives and the Department of Tourism, Culture and Arts, representing Ms. Cristal Bagatsing, and serving as the Chief Inducting Officer
      - Atty. James Ceasar A. Ventura, First Inducting Officer
      - Atty. Evelyn S. Amiling, Second Inducting Officer
      - Mr. Francis Dave G. Abellano, Third Inducting Officer
      - Ms. Jenny Ortiz Bolivar, Fourth Inducting Officer
      During the ceremony, Mr. Robin Carlo Reyes delivered the message of Ms. Cristal Bagatsing, which emphasized the importance of leadership and highlighted the role of the Manila City Government in fostering service, accountability, and community development.
      During the ceremony, the Constitutional Bodies and APD Officers were formally inducted, signifying their dedication to advancing the values and vision of the YMCA movement.
      📷 See more pictures at: https://bit.ly/3Zczac1      </p>
    </NewsArticle>
  );
}
