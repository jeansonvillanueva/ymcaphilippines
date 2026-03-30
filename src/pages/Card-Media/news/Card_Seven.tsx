import NewsArticle from "../../../components/NewsArticle";
import { getNewsArticleMeta } from "../../../data/news";

export default function Card_Seven() {
  const meta = getNewsArticleMeta('/news/Card_Seven');
  return (
    <NewsArticle
      title={meta?.title ?? 'Asia Pacific YMCA Movement Strengthening Committee Meeting'}
      date={meta?.date ?? 'January 27, 2026'}
      subtitle={meta?.subtitle}
      imageUrl={meta?.imageUrl}
      articlePath="/news/Card_Seven"
      layoutVariant="news"
    >
      <p>
      The YMCA of the Philippines hosted the APAY Movement Strengthening Committee meeting to address current issues within the region and strengthen collaborative efforts across Asia and the Pacific.
      The meeting was led by APAY Vice President Dra. Ramona UJ Morales and APAY General Secretary Mr. Nam Boo Won, together with:
      - Ms. Tina Miranda, APAY MS Secretary
      - Mr. David Lua, YMCA Singapore
      - Ms. Utako Sugino, National Council of YMCAs Japan
      - Mr. Benjamin Yi, Chuncheon YMCA Korea
      - Mr. Baik Hyung Ki, Chuncheon YMCA Korea
      Also present were National President Engr. Antonio C. Keh, OIC-NGS Mr. Orlando F. Carreon, YMCA Manila, Deputy Director General Ms. Sheena S. Awatin, President of YMCA Makati, Mr. Tomas C. Banguis, Jr., and YMCA Makati General Secretary Ms. Ma. Magda Dana.      </p>
    </NewsArticle>
  );
}
