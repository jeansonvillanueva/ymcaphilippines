import './Footer.css'
import gym from '../assets/images/global-youth-mobilization_logo.png';
import vision from '../assets/images/vision_2030.png';
import Yusa from '../assets/images/YMCA_USA_Logo.png';
import Yworld from '../assets/images/World-YMCA_Logo.jpg';

export default function Partner() {
  return (
    <footer className="partner">
        <h1>Y Partners</h1>
        <div className="partner-container">
            <img src={gym} alt="Global Youth Mbilization Logo" className="footer-logo" />
        </div>
        <div className="partner-container">
            <img src={Yusa} alt="YMCAof the USA" className="footer-logo" />
        </div>
        <div className="partner-container">
            <img src={Yworld} alt="World YMCA" className="footer-logo" />
        </div>
        <div className="partner-container">
            <img src={vision} alt="Vision 2030" className="footer-logo" />
        </div>
    </footer>


  )
}