import NewsArticle from "../../../components/NewsArticle";
import { getNewsArticleMeta } from "../../../data/news";

export default function Card_Four() {
  const meta = getNewsArticleMeta('/news/Card_Four');
  return (
    <NewsArticle
      title={meta?.title ?? 'The Installation and Induction Ceremonies of the YMCA of Baguio for the term 2026–2027.'}
      date={meta?.date ?? 'February 4, 2026'}
      subtitle={meta?.subtitle}
      imageUrl={meta?.imageUrl}
      articlePath="/news/Card_Four"
      layoutVariant="news"
    >
      <p>
      National President, Engr. Antonio C. Keh, is serving as the Chief Induction Officer. In his speech, he highlighted the achievements of Baguio through the years, remaining true to the mission of serving the YMCA community.  
      OIC-NGS Mr. Orlando F. Carreon also delivered his message and greetings, emphasizing the strength of the YMCA movement and its mission of faith, integrity, and sustained dedication.  
      Congratulations to YMCA Baguio on this meaningful occasion, as it continues to uphold its legacy of service, leadership, and community impact.      </p>
    </NewsArticle>
  );
}
