import NewsArticle from '../../../components/NewsArticle';
import { getNewsArticleMeta } from '../../../data/news';
import { MANILA_YMCA } from '../articles/Manila_YMCA/local';

export default function Card_Eight() {
  const meta = getNewsArticleMeta('/news/Card_Eight');
  return (
    <NewsArticle
      title={meta?.title ?? 'YMCA Career Development Program'}
      subtitle={meta?.subtitle}
      imageUrl={meta?.imageUrl}
      date={meta?.date}
      articlePath="/news/Card_Eight"
      layoutVariant="article"
      localYMCA={MANILA_YMCA}
      websiteUrl="https://www.facebook.com/YmcaOfManilaOfficial"
    >
      <p>By: Michelle R. Maala, YMCA of Leyte, Inc.</p>
      <p>
        <b>MANILA</b> - The YMCA of Manila, headed by President Antonio C. Keh, paid a courtesy visit to Dr. Nerissa
        Roxas-Lomeda, OIC Schools Division Superintendent of the Division Office of Manila, to discuss collaborative
        programs that will help empower and support students in Manila schools. This collaboration aims to develop and
        support meaningful programs that will benefit the youth of Manila, particularly in promoting holistic
        development, leadership, and well-being in schools. Together, we look forward to creating opportunities that
        nurture character and growth among our young learners. #YMCAofManila #servingtheyouth #StrongerTogether
        #EducationForAll #ManilaYouth
      </p>
    </NewsArticle>
  );
}
