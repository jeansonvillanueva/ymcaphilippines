import React from 'react';
import './Find_Your_YMCA.css';
import { Link } from 'react-router-dom';

function Find_Your_YMCA() {
  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-body">
          <h1>Find your YMCA</h1>

          <p>Each YMCA Member Association is unique in size, geographic reach and the programs and services they offer, but they are united in their commitment to fostering a sense of belonging to advance the health and wellbeing of individuals, families and communities. Collectively, these YMCA support over 8,500 people annually achieving better health at over 22 locations across the philippines.

            To find a YMCA location near you, visit the website of the local YMCA for your area.</p>

          <ul className="region-list">

            <li className="dropdown">
              <span className="region-title">North Luzon Region</span>
              <ul className="dropdown-menu">
                <li><Link to="#">YMCA of the City of Baguio</Link></li>
                <li><Link to="#">City of Tuguegarao YMCA</Link></li>
                <li><Link to="#">YMCA of Nueva Ecija</Link></li>
                <li><Link to="#">YMCA of Pangasinan</Link></li>
                <li><Link to="#">YMCA of Central Pangasinan</Link></li>
              </ul>
            </li>

            <li className="dropdown">
              <span className="region-title">Manila Bay Region</span>
              <ul className="dropdown-menu">
                <li><Link to="#">YMCA of Makati</Link></li>
                <li><Link to="#">Manila Downtown YMCA</Link></li>
                <li><Link to="#">YMCA of Manila</Link></li>
                <li><Link to="#">YMCA of Quezon City</Link></li>
              </ul>
            </li>

            <li className="dropdown">
              <span className="region-title">South Luzon Region</span>
              <ul className="dropdown-menu">
                <li><Link to="#">YMCA of Albay</Link></li>
                <li><Link to="#">YMCA of Los Baños</Link></li>
                <li><Link to="#">YMCA of Nueva Caceres</Link></li>
                <li><Link to="#">YMCA of San Pablo</Link></li>
              </ul>
            </li>

            <li className="dropdown">
              <span className="region-title">Visayas Region</span>
              <ul className="dropdown-menu">
                <li><Link to="#">YMCA of Cebu</Link></li>
                <li><Link to="#">YMCA of Leyte</Link></li>
                <li><Link to="#">YMCA of Negros Occidental</Link></li>
                <li><Link to="#">YMCA of Negros Oriental</Link></li>
                <li><Link to="#">City of Ormoc YMCA</Link></li>
                <li><Link to="#">YMCA of San Carlos City</Link></li>
              </ul>
            </li>

            <li className="dropdown">
              <span className="region-title">Mindanao Region</span>
              <ul className="dropdown-menu">
                <li><Link to="#">YMCA of Davao</Link></li>
                <li><Link to="#">Cagayan de Oro YMCA</Link></li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
}

export default Find_Your_YMCA;