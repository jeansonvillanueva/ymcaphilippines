import { useMemo, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Partners from '../components/Partners';
import '../styles/design-system.css';
import './Donate.css';

const DONATE_IMAGE =
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80';

const PRESET_AMOUNTS_USD = [10, 25, 50, 100, 250] as const;

/** Reference rates for display only (USD base) */
const PHP_PER_USD = 58;
const EUR_PER_USD = 0.92;

type DisplayCurrency = 'USD' | 'PHP' | 'EUR';

function Donate() {
  const ref = useScrollReveal<HTMLDivElement>();
  const amountInputRef = useRef<HTMLInputElement | null>(null);

  /** Amount always stored in USD for presets + summary logic */
  const [amountUsd, setAmountUsd] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal'>('Credit Card');
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>('USD');

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Donation submitted');
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
                    min={0}
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

                <h3 className="donate-section-title">Payment Method</h3>
                <div className="donate-payment-method" role="radiogroup" aria-label="Payment method">
                  <label className="donate-radio">
                    <input
                      type="radio"
                      checked={paymentMethod === 'Credit Card'}
                      onChange={() => setPaymentMethod('Credit Card')}
                    />
                    Credit Card
                  </label>
                  <label className="donate-radio">
                    <input
                      type="radio"
                      checked={paymentMethod === 'PayPal'}
                      onChange={() => setPaymentMethod('PayPal')}
                    />
                    PayPal
                  </label>
                </div>

                {paymentMethod === 'Credit Card' && (
                  <>
                    <h3 className="donate-section-title">Personal Info</h3>
                    <input className="donate-input" type="text" placeholder="Name" required />
                    <input className="donate-input" type="text" placeholder="Surname" required />
                    <input className="donate-input" type="email" placeholder="Email" required />
                    <input className="donate-input" type="text" placeholder="Phone Number" />

                    <h3 className="donate-section-title">Billing Details</h3>
                    <input className="donate-input" type="text" placeholder="Country" />
                    <input className="donate-input" type="text" placeholder="Address 1" />
                    <input className="donate-input" type="text" placeholder="Address 2" />
                    <input className="donate-input" type="text" placeholder="City" />
                    <div className="donate-two-inputs">
                      <input className="donate-input" type="text" placeholder="Region" />
                      <input className="donate-input" type="text" placeholder="Zip/Postal Code" />
                    </div>
                  </>
                )}

                {paymentMethod === 'PayPal' && (
                  <>
                    <h3 className="donate-section-title">PayPal Details</h3>
                    <input className="donate-input" type="email" placeholder="Email" required />
                    <input className="donate-input" type="text" placeholder="Card Number" />
                    <div className="donate-two-inputs">
                      <input className="donate-input" type="text" placeholder="Expires" />
                      <input className="donate-input" type="text" placeholder="CSC" />
                    </div>

                    <h3 className="donate-section-title">Billing Details</h3>
                    <input className="donate-input" type="text" placeholder="First Name" />
                    <input className="donate-input" type="text" placeholder="Surname" />
                    <input className="donate-input" type="text" placeholder="Address" />
                    <input className="donate-input" type="text" placeholder="Apt., Ste., Bldg." />
                    <div className="donate-two-inputs">
                      <input className="donate-input" type="text" placeholder="Region" />
                      <input className="donate-input" type="text" placeholder="Zip/Postal Code" />
                    </div>
                    <input className="donate-input" type="text" placeholder="Phone Number" />
                  </>
                )}

                <div className="donate-summary">
                  <div className="donate-summary__row">
                    <span>Payment Amount</span>
                    <b>
                      {currencySymbol}
                      {displayAmount}
                    </b>
                  </div>
                  <div className="donate-summary__row">
                    <span>Payment Method</span>
                    <b>{paymentMethod}</b>
                  </div>
                </div>

                <button type="submit" className="donate-btn">
                  Donate Now
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