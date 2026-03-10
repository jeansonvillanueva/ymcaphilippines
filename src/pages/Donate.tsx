import React, { useState } from 'react';
import Partner from '../components/Partners';

function Donate() {

    const [amount, setAmount] = useState(100);
    const [customAmount, setCustomAmount] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Credit Card");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert(name);
    };

    return (
        <div className="container">

            <h1>Help Give Young People A Chance Of A Better Future</h1>
            <p>
                The YMCA of the Philippines are dedicated to the growth of all persons
                in spirit, mind and body, and to their sense of responsibility to each
                other and the global community.
            </p>

            <form onSubmit={handleSubmit}>

            {/* Donation Amount */}
            <h3>Your Donation</h3>

            <div className="amount-buttons">
                 {/* Custom Amount Button */}
                <button type="button" onClick={() => setIsCustom(true)}>
                    Custom Amount
                </button>
                
                <button type="button" onClick={() => setAmount(10)}>$10</button>
                <button type="button" onClick={() => setAmount(25)}>$25</button>
                <button type="button" onClick={() => setAmount(50)}>$50</button>
                <button type="button" onClick={() => setAmount(100)}>$100</button>
                <button type="button" onClick={() => setAmount(250)}>$250</button>
            </div>

            {isCustom && (
                <div className="custom-amount">
                    <input
                        type="number"
                        placeholder="Enter Amount"
                        value={customAmount}
                        onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setAmount(Number(e.target.value));
                        }}
                    />
                </div>
            )}

            <p>Selected Amount: ${amount}</p>

            {/* Payment Method */}
            <h3>Payment Method</h3>

            <label>
                <input
                    type="radio"
                    value="Credit Card"
                    checked={paymentMethod === "Credit Card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit Card
            </label>

            <label>
                <input
                    type="radio"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                />
                PayPal
            </label>

            {/* CREDIT CARD FORM */}

            {paymentMethod === "Credit Card" && (
                <>
                <h3>Personal Info</h3>
                <p>Your privacy is important to us. All personal information you provide when making a donation will be treated with the highest level of confidentiality and security.</p>

                <input type="text" placeholder="Name" required />
                <input type="text" placeholder="Surname" required />
                <input type="email" placeholder="Email" required />
                <input type="text" placeholder="Phone Number" />

                <h3>Billing Details</h3>
                <p>Your privacy is important to us. All personal information you provide when making a donation will be treated with the highest level of confidentiality and security.</p>

                <input type="text" placeholder="Country" />
                <input type="text" placeholder="Address 1" />
                <input type="text" placeholder="Address 2" />
                <input type="text" placeholder="City" />

                <div style={{display:"flex", gap:"10px"}}>
                    <input type="text" placeholder="Region" />
                    <input type="text" placeholder="Zip / Postal Code" />
                </div>
                </>
            )}

            {/* PAYPAL FORM */}

            {paymentMethod === "PayPal" && (
                <>
                <h3>Personal Info</h3>
                <p>Your privacy is important to us. All personal information you provide when making a donation will be treated with the highest level of confidentiality and security.</p>

                <input type="email" placeholder="Email" required />
                <input type="text" placeholder="Card Number" />
                <input type="text" placeholder="Expires" />
                <input type="text" placeholder="CSC" />

                <h3>Billing Details</h3>
                <p>Your privacy is important to us. All personal information you provide when making a donation will be treated with the highest level of confidentiality and security.</p>

                <input type="text" placeholder="First Name" />
                <input type="text" placeholder="Surname" />
                <input type="text" placeholder="Address" />
                <input type="text" placeholder="Apt., Ste., Bldg." />

                <div style={{display:"flex", gap:"10px"}}>
                    <input type="text" placeholder="Region" />
                    <input type="text" placeholder="Zip / Postal Code" />
                </div>

                <input type="text" placeholder="Phone Number" />
                </>
            )}

            {/* Donation Summary */}

            <h3>Donation Summary</h3>

            <p>
                Payment Amount: <b>${amount}</b>
            </p>

            <p>
                Payment Method: <b>{paymentMethod}</b>
            </p>

            <button type="submit">Donate Now</button>

            </form>

            <Partner />

        </div>
    );
}

export default Donate;