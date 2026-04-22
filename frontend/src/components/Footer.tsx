import './Footer.css';
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTiktok, FaYoutube } from 'react-icons/fa';
import logo from '../assets/images/logo.webp';
import { Link } from 'react-router-dom';

const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=YMCA+of+the+Philippines+Federation+Office+Manila';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <Link to="/">
            <img src={logo} alt="YMCA Logo" className="navbar-logo" />
          </Link>

          <div>
            <h3>Find us</h3>

            <a className="footer-item footer-item--link" href={MAP_URL} target="_blank" rel="noopener noreferrer">
              <FaMapMarkerAlt className="footer-icon" aria-hidden />
              <span>
                350 Antonio Villegas St,
                <br />
                Ermita, Manila, 1000
                <br />
                Metro Manila.
              </span>
            </a>
          </div>
        </div>

        <div className="footer-center">
          <h3>Get in touch</h3>

          <a className="footer-item footer-item--link" href="tel:+63285280557">
            <FaPhoneAlt className="footer-icon" aria-hidden />
            <span>(02)8528-0557 / (02)8711-9012</span>
          </a>

          <div className="footer-item footer-item--stack">
            <FaEnvelope className="footer-icon" aria-hidden />
            <div className="footer-email-stack">
              <a href="mailto:ymcaphilippines@yahoo.com">ymcaphilippines@yahoo.com</a>
              <a href="mailto:admin@ymca.ph">admin@ymca.ph</a>
            </div>
          </div>
        </div>

        <div className="footer-right" aria-label="Social media">
          <a href="https://www.facebook.com/ymcaphilippines1911" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/ymcaphilippines/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://www.tiktok.com/@ymcaphilippines" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok />
          </a>
          <a href="https://www.youtube.com/@YMCAPHILIPPINES1911" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube />
          </a>
        </div>
      </div>

      <div className="footer-bottom">Copyright © 2026 YMCA of the Philippines</div>
    </footer>
  );
}
