import '../styles/design-system.css';
import './developer.css';
import developerPhoto from '../assets/images/staff/developerPic.png';

export default function Developer() {
  return (
    <div className="developer-page">
      <section className="developer-banner">
        <div className="developer-banner__content">
          <h1>About the Developer</h1>
          <p>
            Jeanson H. Villanueva is an undergraduate student pursuing a Bachelor of Science in Information Technology at the Pamantasan ng Lungsod ng Maynila. He was born in Manila City, and has a strong passion for advancing his skills in programming, database management, networking, and other IT-related fields.
          </p>
        </div>
        <div className="developer-banner__image">
          <img src={developerPhoto} alt="Developer portrait" />
        </div>
      </section>

      <section className="developer-details">
        <p>
          His professional experience includes serving under the Special Program for Employment of Students (SPES) at the Public Employment Service Office (PESO) in Manila, as well as working as a crew member at McDonald’s Rizal Recto. During his third year, Jeanson demonstrated leadership and technical expertise by leading and contributing to the development of the Alerto MNL application, a digital crime reporting system designed to enhance faster and more efficient responses from law enforcement agencies.
        </p>
        <p>
          He also contributed as a co-developer, documenter, system tester, and data analyst in a financial management project utilizing OCR (Optical Character Recognition) technology for digitizing data from scanned receipts, Meta Prophet for forecasting future spending, Isolation Forest for anomaly detection, and Natural Language Generation (NLG) for producing human-readable insights.
        </p>
        <p>
          Currently, he is completing his On-the-Job Training at the YMCA of the Philippines. Throughout his academic journey, Jeanson has consistently demonstrated dedication to continuous learning, professional growth, and excellence in the field of information technology.
        </p>
      </section>
    </div>
  );
}

