import NewsArticle from "../../../components/NewsArticle";
import { getNewsArticleMeta } from "../../../data/news";

export default function Card_Two() {
  const meta = getNewsArticleMeta('/news/Card_Two');
  return (
    <NewsArticle
      title={meta?.title ?? 'Camp Managers Training'}
      date={meta?.date ?? 'February 20-21, 2026'}
      subtitle={meta?.subtitle}
      imageUrl={meta?.imageUrl}
      articlePath="/news/Card_Two"
      layoutVariant="news"
    >
      <p>
      The YMCA of the Philippines successfully conducted the Camp Managers Training on February 20–21, 2026 at the 7th floor, YMCA Philippines Convention Center, with 13 dedicated participants from 11 local YMCAs equipped with essential knowledge on the fundamentals and best practices of organizing and conducting camps. 
      This two-day session was filled with hands-on activities and workshops, providing participants with practical skills and collaborative experiences to strengthen their leadership in camp management. 
      Present during the training were Mr. Orlando F. Carreon, OIC–National General Secretary, and Ms. Ianne Christine J. Aquino, OIC–National Program Secretary, while the sessions were facilitated by Ms. Rogelyn D. Razon, General Secretary of YMCA Cagayan de Oro, and Mr. Jayson A. Noga, Program Officer of YMCA Albay. 
      The YMCA of the Philippines extends heartfelt gratitude to YMCA USA (The Y), and HP for their generous support in making the Camp Managers Training possible.
      Your support strengthens our mission aligned with Vision 2030 to empower leaders, foster unity, and ensure that every YMCA camp experience inspires growth, service, and community.
      #YMCA #HP #worldymca #ymcausa      </p>
    </NewsArticle>
  );
}
