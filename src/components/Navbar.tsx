import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/logo.webp'; // Replace with your YMCA logo

function Navbar() {
  return (
    <nav className="navbar-custom">
      <div className="blue-section">
        <img src={logo} alt="YMCA Logo" className="navbar-logo" />
        <span className="navbar-title">Young Men’s Christian Association of the Philippines</span>
        
        <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li className="dropdown"><Link to="/about">Who is Y</Link>
          <ul className="dropdown-menu">
            <li><Link to="/mission">Mission</Link></li>
            <li><Link to="/vision">Vision</Link></li>
            <li><Link to="/core-values">Core Values</Link></li>
            <li><Link to="/history">History</Link></li>
            <li><Link to="/meet-family">Meet Our Family</Link></li>
          </ul>
        </li>
        <li><Link to="/calendar">Calendar of Activities</Link></li>
        <li><Link to="/media">Media</Link></li>
        <li><Link to="/find-ymca">Find Your YMCA</Link></li>
        
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/donate">Donate</Link></li>
      </ul>
      </div>

      

      <div className="right-section">
        <Link to="/get-involved" className="btn-get-involved">GET INVOLVED</Link>
        <button className="btn-search">🔍</button>
      </div>
    </nav>
  );
}

export default Navbar;