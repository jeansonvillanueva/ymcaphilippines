import NewsArticle from '../../../../components/NewsArticle';
import { MANILA_YMCA } from './local';

export default function Manila_Article_One() {
  return (
    <NewsArticle
      title="College Y Club General Assembly & Induction of Officers"
      date="March 12, 2026 at 10:59 AM"
      subtitle="Manila – Unity in action, service in spirit."
      localYMCA={MANILA_YMCA}
    >
      <p>
        The College Y Club General Assembly &amp; Induction of Officers was successfully held on February 21,
        2026 at the YMCA of Manila and Rizal Park, gathering College Y’ers from different universities for a
        meaningful day of leadership, fellowship, and shared purpose.
      </p>
      <p>
        With the theme “BALA/Y/ANIHAN: Tahanan ng mga Layunin, Nagkakaisang Tutuparin,” the event highlighted
        the spirit of unity and collaboration among youth leaders.
      </p>
      <p>
        The induction ceremony marked a new chapter for the officers who have committed themselves to lead with
        integrity and passion in advancing the mission of the YMCA. Congratulations to all newly inducted
        officers and participating College Y’ers.
      </p>
    </NewsArticle>
  );
}

