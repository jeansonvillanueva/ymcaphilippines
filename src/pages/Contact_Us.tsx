import React from 'react';

function Contact_Us() {
    return (
        <div className = "container">
            <div className="card mt -4">
                <div className="card-body">
                    <h2>Contact Us Page</h2>
                    <p>This is the Contact Us page of the website</p>
                </div>

                <p>Leave your details and and our team will reach out to you.</p>

                <input type="text" placeholder="Name" required />
                <input type="text" placeholder="Surname" required />
                <input type="email" placeholder="Email" required />
                <input type="text" placeholder="Phone Number" />
                <input type="text" placeholder="Your Message" />

                <button type="submit">Submit</button>


            </div>
        </div>
    );
}

    export default Contact_Us;