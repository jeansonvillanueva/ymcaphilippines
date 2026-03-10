import React from 'react';
import Partner from '../components/Partners';
import { Link } from 'react-router-dom';

function Get_Involved () {
    return (
        <div className = "container">
            <div className="card mt -4">
                <div className="card-body">
                    <h2>Get Involved</h2>
                    <p>The YMCA of the Philippines are dedicated to the growth of all persons in spirit, mind and body, and to their sense of responsibility to each other and the global community.</p>

                    <div className="right-section">
                        <button className="btn-search">
                        <Link to="/donate" className="btn-donate">Donate</Link>
                        </button>
                    </div>

                    <div className="right-section">
                        <button className="btn-search">
                        <Link to="./Contact_Us" className="btn-Contact_Us">Volunteer</Link>
                        </button>
                    </div>
                </div>
            </div>

            <Partner />
        </div>
    );
}

export default Get_Involved;