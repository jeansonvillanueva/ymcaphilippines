import React from 'react';
import { Link } from 'react-router-dom';

function About_Y() {
    return (
        <>
        <h1>About Y Philippines</h1>
        <p>We, the Young Men's Christian par Association in the Philippines, are committed in advocating and working for the viability of the movement and empowerment of people ear through coordinated programs that will 100 promote peace sustainability of life. with justice and</p>

        <h2>Vision</h2>
        <p>To be dynamic Christ-centered ecumenical movement committed to the holistic development of community towards the fulfillment of God's reign on Earth</p>

        <h2>Mission</h2>
        <p>We, the Young Men's Christian Association in the Philippines are committed in advocating and working for the viability of the movement and empowerment of people through coordinated programs that will promote peace with justice ad sustainability of life</p>

        <h2>Our Values</h2>

        <li className="dropdown">
            <span className="region-title">Inclusiveness</span>
            <ul className="dropdown-menu">
                <li><Link to="#">We create welcoming places and programs where everyone feels they belong.</Link></li>
            </ul>
        </li>

        <li className="dropdown">
            <span className="region-title">Integrity</span>
            <ul className="dropdown-menu">
                <li><Link to="#">We create welcoming places and programs where everyone feels they belong.</Link></li>
            </ul>
        </li>
        <li className="dropdown">
            <span className="region-title">Kindness</span>
            <ul className="dropdown-menu">
                <li><Link to="#">We create welcoming places and programs where everyone feels they belong.</Link></li>
            </ul>
        </li>
        <li className="dropdown">
            <span className="region-title">Optimism</span>
            <ul className="dropdown-menu">
                <li><Link to="#">We create welcoming places and programs where everyone feels they belong.</Link></li>
            </ul>
        </li>
        <li className="dropdown">
            <span className="region-title">Respect</span>
            <ul className="dropdown-menu">
                <li><Link to="#">We create welcoming places and programs where everyone feels they belong.</Link></li>
            </ul>
        </li>
        <li className="dropdown">
            <span className="region-title">Well-being</span>
            <ul className="dropdown-menu">
                <li><Link to="#">We create welcoming places and programs where everyone feels they belong.</Link></li>
            </ul>
        </li>

        <h2>HistorY</h2>

        <h2>Meet Our FamilY</h2>
        <h3>YMCA OF THE PHILIPPINES 
        ORGANIZATIONAL CHAR</h3>

        


        </>
    );
}

export default About_Y;