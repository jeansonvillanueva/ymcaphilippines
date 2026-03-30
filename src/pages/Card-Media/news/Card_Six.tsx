import NewsArticle from "../../../components/NewsArticle";
import { getNewsArticleMeta } from "../../../data/news";

export default function Card_Six() {
  const meta = getNewsArticleMeta('/news/Card_Six');
  return (
    <NewsArticle
      title={meta?.title ?? 'First Onboarding Session for the Newly Elected National Board of Trustees'}
      date={meta?.date ?? 'February 2, 2026'}
      subtitle={meta?.subtitle}
      imageUrl={meta?.imageUrl}
      articlePath="/news/Card_Six"
      layoutVariant="news"
    >
      <p>
      The YMCA of the Philippines successfully conducted its first Onboarding Session for the Newly Elected National Board of Trustees on January 31, 2026
      Facilitated by OIC-NPS Ms. Ianne Christine J. Aquino, the session highlighted the rich legacy of the YMCA through a brief history shared by Mr. Liberato G. Siaron, and deepened understanding of roles and governance with insights from Dra. Ramona UJ Morales.
      Following the onboarding, the National Board of Trustees convened for the 1st National Board Meeting.      </p>
    </NewsArticle>
  );
}
