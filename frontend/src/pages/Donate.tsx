import { useMemo, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PUBLIC_API_URL } from '../hooks/useApi';
import Partners from '../components/Partners';
import '../styles/design-system.css';
import './Donate.css';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_TEST_PUBLISHABLE_KEY'; // Replace with your Stripe publishable key

const DONATE_IMAGE =
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80';

const PRESET_AMOUNTS_USD = [10, 25, 50, 100, 250] as const;

/** Reference rates for display only (USD base) */
const PHP_PER_USD = 58;
const EUR_PER_USD = 0.92;

type DisplayCurrency = 'USD' | 'PHP' | 'EUR';

declare global {
  interface Window {
    Stripe?: any;
  }
}

function Donate() {
  const ref = useScrollReveal<HTMLDivElement>();
  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const cardElementRef = useRef<any>(null);

  // Form state
  const [amountUsd, setAmountUsd] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>('USD');
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string>('');

  // Donor info
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [zip, setZip] = useState('');

  // Load Stripe.js
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => {
      if (window.Stripe) {
        setStripeLoaded(true);
      }
    };
    document.body.appendChild(script);
  }, []);

  const displayAmount = useMemo(() => {
    const v = Number.isFinite(amountUsd) ? amountUsd : 0;
    if (displayCurrency === 'USD') return v.toFixed(0);
    if (displayCurrency === 'PHP') return (v * PHP_PER_USD).toFixed(0);
    return (v * EUR_PER_USD).toFixed(2);
  }, [amountUsd, displayCurrency]);

  const currencySymbol = displayCurrency === 'USD' ? '$' : displayCurrency === 'PHP' ? '₱' : '€';

  const conversionHint = useMemo(() => {
    const v = Number.isFinite(amountUsd) ? amountUsd : 0;
    const php = (v * PHP_PER_USD).toFixed(0);
    const eur = (v * EUR_PER_USD).toFixed(2);
    if (displayCurrency === 'USD') return `≈ ₱${php} · €${eur}`;
    if (displayCurrency === 'PHP') return `≈ $${v.toFixed(0)} · €${eur}`;
    return `≈ $${v.toFixed(0)} · ₱${php}`;
  }, [amountUsd, displayCurrency]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStripeError('');

    // Validation
    if (!name || !surname || !email || !amountUsd) {
      alert('Please fill in required fields (name, surname, email, amount).');
      return;
    }

    if (amountUsd < 0.50) {
      alert('Minimum donation is $0.50');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create Stripe PaymentIntent on backend
      const intentResponse = await axios.post(`${PUBLIC_API_URL}/stripe/create-payment-intent`, {
        amountUsd,
        currency: displayCurrency.toLowerCase(),
        email,
        name: `${name} ${surname}`,
      });

      const { clientSecret, paymentIntentId } = intentResponse.data;

      // Step 2: Confirm payment with Stripe
      const stripe = window.Stripe!(STRIPE_PUBLISHABLE_KEY);
      const cardElement = cardElementRef.current;

      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${name} ${surname}`,
            email,
            phone,
            address: {
              line1: address1,
              city,
              state: region,
              postal_code: zip,
              country,
            },
          },
        },
      });

      if (confirmResult.error) {
        setStripeError(confirmResult.error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      // Step 3: Confirm payment on backend
      await axios.post(`${PUBLIC_API_URL}/stripe/confirm-payment`, {
        paymentIntentId,
        name,
        surname,
        email,
        phone,
        country,
        address1,
        city,
        region,
        zip,
        amountUsd,
        currency: displayCurrency,
      });

      alert('✅ Donation successful! Thank you for your generosity.');
      // Reset form
      event.currentTarget.reset();
      setAmountUsd(100);
      setIsCustom(false);
      setCustomAmount('');
      setName('');
      setSurname('');
      setEmail('');
      setPhone('');
      setCountry('');
      setAddress1('');
      setCity('');
      setRegion('');
      setZip('');
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Payment processing failed';
      setStripeError(message);
      console.error('Donation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="donate-page" ref={ref}>
      <section className="page-section page-section--white">
        <div className="page-section__inner">
          <h1 className="donate-hero-title reveal">
            Help Give <span className="donate-hero-title__accent">Young People</span>
            <br />
            Chance Of A <span className="donate-hero-title__accent">Better Future</span>
          </h1>

          <div className="donate-layout reveal reveal-delay-1">
            <div className="donate-info">
              <div className="donate-image-wrap">
                <img src={DONATE_IMAGE} alt="YMCA community support" />
              </div>
              <p className="donate-info__text">
                When you support the <b>Y</b> the leading nonprofit committed to strengthening communities – you give young people a chance at a better future, foster healthy lifestyles and help build vibrant communities right where you live.
              </p>
            </div>

            <div className="donate-form-card">
              <p className="donate-form-card__hint">
                <b>Your privacy</b> is important to us. All personal information you provide when making a donation will be treated with the highest level of confidentiality and security.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="donate-currency-row" aria-label="Display currency">
                  <span className="donate-currency-row__label">Show amounts in</span>
                  <select
                    className="donate-currency-select"
                    value={displayCurrency}
                    onChange={(e) => setDisplayCurrency(e.target.value as DisplayCurrency)}
                    aria-label="Currency for donation display"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="PHP">PHP (₱)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <p className="donate-conversion-hint" role="note">
                  {conversionHint} — reference rates for planning; charged currency may vary at checkout.
                </p>

                <div className="donate-amount-row" aria-label="Donation amount">
                  <span className="donate-currency">{currencySymbol}</span>
                  <input
                    ref={amountInputRef}
                    className="donate-amount-input"
                    type="number"
                    inputMode="decimal"
                    min={0.50}
                    step={displayCurrency === 'EUR' ? '0.01' : '1'}
                    value={isCustom ? customAmount : displayAmount}
                    readOnly={!isCustom}
                    placeholder="0"
                    onChange={(e) => {
                      const next = e.target.value;
                      setCustomAmount(next);
                      const num = Number(next || 0);
                      if (displayCurrency === 'USD') setAmountUsd(num);
                      else if (displayCurrency === 'PHP') setAmountUsd(num / PHP_PER_USD);
                      else setAmountUsd(num / EUR_PER_USD);
                    }}
                    aria-label="Donation amount input"
                  />
                </div>

                <div className="donate-amount-buttons" aria-label="Preset donation amounts">
                  {PRESET_AMOUNTS_USD.map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={
                        amountUsd === v && !isCustom ? 'donate-pill donate-pill--active' : 'donate-pill'
                      }
                      onClick={() => {
                        setIsCustom(false);
                        setCustomAmount('');
                        setAmountUsd(v);
                      }}
                    >
                      {displayCurrency === 'USD' && `$${v}.00`}
                      {displayCurrency === 'PHP' && `₱${(v * PHP_PER_USD).toFixed(0)}`}
                      {displayCurrency === 'EUR' && `€${(v * EUR_PER_USD).toFixed(2)}`}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={isCustom ? 'donate-pill donate-pill--active' : 'donate-pill'}
                    onClick={() => {
                      setIsCustom(true);
                      setCustomAmount(customAmount || displayAmount);
                      window.setTimeout(() => {
                        amountInputRef.current?.focus();
                        amountInputRef.current?.select();
                      }, 0);
                    }}
                  >
                    Custom Amount
                  </button>
                </div>

                <h3 className="donate-section-title">Personal Information</h3>
                <input
                  className="donate-input"
                  type="text"
                  placeholder="First Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="donate-input"
                  type="text"
                  placeholder="Last Name *"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
                <input
                  className="donate-input"
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="donate-input"
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <h3 className="donate-section-title">Billing Address</h3>
                <input
                  className="donate-input"
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <input
                  className="donate-input"
                  type="text"
                  placeholder="Address"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
                <input
                  className="donate-input"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <div className="donate-two-inputs">
                  <input
                    className="donate-input"
                    type="text"
                    placeholder="State/Region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                  <input
                    className="donate-input"
                    type="text"
                    placeholder="Zip Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>

                <h3 className="donate-section-title">Card Information</h3>
                {!stripeLoaded ? (
                  <p className="donate-loading">Loading payment options...</p>
                ) : (
                  <div id="card-element" ref={cardElementRef} className="donate-stripe-element" />
                )}

                {stripeError && <div className="donate-error">{stripeError}</div>}

                <div className="donate-summary">
                  <div className="donate-summary__row">
                    <span>Payment Amount</span>
                    <b>
                      {currencySymbol}
                      {displayAmount}
                    </b>
                  </div>
                </div>

                <button type="submit" className="donate-btn" disabled={isProcessing || !stripeLoaded}>
                  {isProcessing ? 'Processing...' : 'Donate Now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="partners-section">
        <div className="page-section__inner reveal">
          <Partners />
        </div>
      </section>
    </div>
  );
}

export default Donate;