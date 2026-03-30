import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Partners from '../components/Partners';
import '../styles/design-system.css';
import './Get_Involved.css';


function Get_Involved() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div className="get-involved-page" ref={ref}>
      <section className="page-section page-section--white">
        <div className="page-section__inner">
          <h1 className="get-involved-title reveal">Get Involved</h1>
          <p className="get-involved-lead reveal reveal-delay-1">
            The YMCA of the Philippines are dedicated to the growth of all persons in{' '}
            <span className="get-involved-lead__accent">spirit</span>,{' '}
            <span className="get-involved-lead__accent">mind</span> and{' '}
            <span className="get-involved-lead__accent">body</span>, and to their sense of
            responsibility to each other and the global community.
          </p>

          <div className="get-involved-ctas reveal reveal-delay-2" aria-label="Get involved actions">
            {/* Volunteer LEFT */}
            <Link to="/find-ymca" className="get-involved-cta get-involved-cta--left">
              VOLUNTEER
            </Link>
            {/* Donate RIGHT */}
            <Link to="/donate" className="get-involved-cta get-involved-cta--right">
              DONATE
            </Link>
          </div>
        </div>
      </section>

      <section className="partners-section">
        <div className="page-section__inner reveal">
          <Partners />
        </div>
      </section>
    </div>
  );
}

export default Get_Involved;