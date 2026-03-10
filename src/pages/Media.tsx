import React from 'react';
import LatestNews from './Card-Media/Latest_News';

function Media() {
    return (
        <div className = "container">
            <div className="card mt -4">
                <div className="card-body">
                    <h2>Media Page</h2>
                    <p>This is the media page of the website</p>
                </div>
            </div>

            <LatestNews />
        </div>
    );
}

export default Media;