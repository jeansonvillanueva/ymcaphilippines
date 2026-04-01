import '../styles/design-system.css';
import gym from '../assets/images/partners/global-youth-mobilization_logo.png';
import vision from '../assets/images/partners/vision_2030.png';
import Yusa from '../assets/images/partners/YMCA_USA_Logo.png';
import Yworld from '../assets/images/partners/World-YMCA_Logo.png';
import SubjectHeader from './SubjectHeader';
import asiaPacificRegion from '../assets/images/partners/Asia_Pacific_Logo.jpg';

export default function Partners() {
  return (
    <div className="partners-block">
      <SubjectHeader text="Y Partners" />
      <div className="partners-grid">
      <a href="https://globalyouthmobilization.org" target="_blank" rel="noopener noreferrer">
          <img src={gym} alt="Global Youth Mobilization" />
        </a>

        <a href="https://www.ymca.org" target="_blank" rel="noopener noreferrer">
          <img src={Yusa} alt="YMCA of the USA" />
        </a>

        <a href="https://www.ymca.int" target="_blank" rel="noopener noreferrer">
          <img src={Yworld} alt="World YMCA" />
        </a>

        <a href="https://www.asiapacificymca.org/joomla/" target="_blank" rel="noopener noreferrer">
          <img src={asiaPacificRegion} alt="Asia Pacific Region" />
        </a>

        <a href="https://www.ymca.int/what-we-do/vision-2030/" target="_blank" rel="noopener noreferrer">
          <img src={vision} alt="Vision 2030" />
        </a>
      </div>
    </div>
  );
}