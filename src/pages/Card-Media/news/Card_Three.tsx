import NewsArticle from "../../../components/NewsArticle";
import { getNewsArticleMeta } from "../../../data/news";

export default function Card_Three() {
  const meta = getNewsArticleMeta('/news/Card_Three');
  return (
    <NewsArticle
      title={meta?.title ?? 'YMCA of the Philippines Federation Office Staff Planning & Team Building'}
      date={meta?.date ?? 'February 14-17, 2026'}
      subtitle={meta?.subtitle}
      imageUrl={meta?.imageUrl}
      articlePath="/news/Card_Three"
      layoutVariant="news"
    >
      <p>
      From February 14–17, the YMCA Philippines Staff gathered as one in Puerto Galera, Oriental Mindoro for a purposeful series of sessions centered on growth, collaboration, and strategic planning for the year ahead.
      ✅ Staff addressed key issues and mapped out programs to strengthen the YMCA movement nationwide.
      ✅ An evaluation was conducted to assess the needs and capabilities of the staff, ensuring alignment with organizational goals.
      ✅ Sessions highlighted personal and professional development, equipping staff to serve with excellence.
      ✅ Sharing circles and team-building activities fostered deeper relationships, unity, and teamwork among colleagues.
      Through planning, evaluation, and team building, we reaffirm our mission to inspire growth and uphold the values of spirit, mind, and body.      </p>
    </NewsArticle>
  );
}
