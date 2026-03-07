import './Footer.css'
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import logo from '../assets/images/logo.webp'; // Replace with your YMCA logo

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LEFT SIDE */}
        <div className="footer-left">
            <img src={logo} alt="YMCA Logo" className="footer-logo" />
            <div>
                <h3>Find us</h3>

                <div className="footer-item">
                <FaMapMarkerAlt className="footer-icon" />
                <p>
                    350 Antonio Villegas St,<br/>
                    Ermita, Manila, 1000<br/>
                    Metro Manila.
                </p>
                </div>

            </div>
        </div>


        {/* CENTER */}
        <div className="footer-center">

          <h3>Get in touch</h3>

          <div className="footer-item">
            <FaPhoneAlt className="footer-icon" />
            <p>02)8528-0557 / (02)8711-9012</p>
          </div>

          <div className="footer-item">
            <FaEnvelope className="footer-icon" />
            <p>
              ymcaphilippines@yahoo.com<br/>
              admin@ymca.ph
            </p>
          </div>

        </div>


        {/* RIGHT */}
        <div className="footer-right">

          <a href="https://www.facebook.com/ymcaphilippines1911" target="_blank"><FaFacebookF /></a>
          <a href="https://www.instagram.com/ymcaphilippines/" target="_blank"><FaInstagram /></a>
          <a href="https://x.com/YMCAPhilippines" target="_blank"><FaTwitter /></a>

        </div>

      </div>


      {/* COPYRIGHT */}
      <div className="footer-bottom">
        Copyright © 2026 YMCA of the Philippines | Powered by YMCA of the Philippines
      </div>

    </footer>
  )
}