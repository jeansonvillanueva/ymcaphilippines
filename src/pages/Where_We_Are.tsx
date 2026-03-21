import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import InteractivePhilippinesMap, { type BranchMarker } from '../components/InteractivePhilippinesMap';
import SubjectHeader from '../components/SubjectHeader';
import { getLocalById, getLocalsAggregateStats } from '../data/locals';
import '../styles/design-system.css';
import './Where_We_Are.css';
import map from '../assets/images/Philippine-Map.png';
import defaultBranchLogo from '../assets/images/logo.webp';
type Branch = {
  id: string;
  name: string;
  markerId: string;
  link?: string;
};

type Region = {
  id: string;
  name: string;
  branches: Branch[];
};

// Marker positions are approximate on the simplified map SVG.
const MARKERS: BranchMarker[] = [
  { id: 'baguio', label: 'YMCA of the City of Baguio', x: 150, y: 130 },
  { id: 'tuguegarao', label: 'City of Tuguegarao YMCA', x: 200, y: 50 },
  { id: 'nueva_ecija', label: 'YMCA of Nueva Ecija', x: 175, y: 150  },
  { id: 'pangasinan', label: 'YMCA of Pangasinan', x: 145, y: 140  },

  { id: 'makati', label: 'YMCA of Makati', x: 175, y: 195 },
  { id: 'manila', label: 'YMCA of Manila', x: 180, y: 190 },
  { id: 'manila_downtown', label: 'Manila Downtown YMCA', x: 170, y: 180 },
  { id: 'quezon_city', label: 'YMCA of Quezon City', x: 165, y: 175 },

  { id: 'albay', label: 'YMCA of Albay', x: 270, y: 260 },
  { id: 'los_banos', label: 'YMCA of Los Baños', x: 180, y: 200 },
  { id: 'san_pablo', label: 'YMCA of San Pablo', x: 180, y: 225 },
  { id: 'nueva_caceres', label: 'YMCA of Nueva Caceres', x: 255, y: 240 },

  { id: 'cebu', label: 'YMCA of Cebu', x: 280, y: 400 },
  { id: 'leyte', label: 'YMCA of Leyte', x: 330, y: 360 },
  { id: 'negros_occidental', label: 'YMCA of Negros Occidental', x: 255, y: 380 },
  { id: 'negros_oriental', label: 'YMCA of Negros Oriental', x: 250, y: 420 },
  { id: 'ormoc', label: 'City of Ormoc YMCA', x: 330, y: 350  },
  { id: 'san_carlos_city', label: 'YMCA of San Carlos City', x: 270, y: 370},
  
  { id: 'davao', label: 'YMCA of Davao', x: 370, y: 520 },
  { id: 'cagayan_de_oro', label: 'YMCA Cagayan de Oro', x: 330, y: 470 },
];

const REGIONS: Region[] = [
  {
    id: 'north-luzon',
    name: 'North Luzon Region',
    branches: [
      { id: 'b1', name: 'YMCA of the City of Baguio', markerId: 'baguio', link: 'https://www.facebook.com/ymcabaguiocity' },
      { id: 'b2', name: 'City of Tuguegarao YMCA', markerId: 'tuguegarao', link: 'https://www.facebook.com/ymcatuguegarao/' },
      { id: 'b3', name: 'YMCA of Nueva Ecija', markerId: 'nueva_ecija', link: 'https://www.facebook.com/ymca.nuevaecija.2024' },
      { id: 'b4', name: 'YMCA of Pangasinan', markerId: 'pangasinan', link: 'https://www.facebook.com/ymcapangasinan' },
    ],
  },
  {
    id: 'manila-bay',
    name: 'Manila Bay Region',
    branches: [
      { id: 'b6', name: 'YMCA of Makati', markerId: 'makati', link: 'https://www.facebook.com/ymcamakati' },
      { id: 'b7', name: 'Manila Downtown YMCA', markerId: 'manila_downtown', link: 'https://www.facebook.com/mdymca' },
      { id: 'b8', name: 'YMCA of Manila', markerId: 'manila', link: 'https://www.facebook.com/YmcaOfManilaOfficial'  },
      { id: 'b9', name: 'YMCA of Quezon City', markerId: 'quezon_city', link: 'https://www.facebook.com/p/YMCA-of-Quezon-City-Inc-100064587435993/' },
    ],
  },
  {
    id: 'south-luzon',
    name: 'South Luzon Region',
    branches: [
      { id: 'b10', name: 'YMCA of Albay', markerId: 'albay', link: 'https://www.facebook.com/albay.ymca' },
      { id: 'b11', name: 'YMCA of Los Baños', markerId: 'los_banos', link: 'https://www.facebook.com/ymcalb' },
      { id: 'b12', name: 'YMCA of Nueva Caceres', markerId: 'nueva_caceres', link: 'https://www.facebook.com/YMCACamarinesSur' },
      { id: 'b13', name: 'YMCA of San Pablo', markerId: 'san_pablo', link: 'https://www.facebook.com/YMCASanPablo' },
    ],
  },
  {
    id: 'visayas',
    name: 'Visayas Region',
    branches: [
      { id: 'b14', name: 'YMCA of Cebu', markerId: 'cebu' },
      { id: 'b15', name: 'YMCA of Leyte', markerId: 'leyte', link: 'https://www.facebook.com/ymcaofleyte' },
      { id: 'b16', name: 'YMCA of Negros Occidental', markerId: 'negros_occidental', link: 'https://www.facebook.com/ymcanegrosoccidental/' },
      { id: 'b17', name: 'YMCA of Negros Oriental', markerId: 'negros_oriental', link: 'https://www.facebook.com/ymcadumaguete.negrosor' },
      { id: 'b18', name: 'City of Ormoc YMCA', markerId: 'ormoc' },
      { id: 'b19', name: 'YMCA of San Carlos City', markerId: 'san_carlos_city' },
    ],
  },
  {
    id: 'mindanao',
    name: 'Mindanao Region',
    branches: [
      { id: 'b20', name: 'YMCA of Davao', markerId: 'davao', link: 'https://www.facebook.com/YMCAofDavao' },
      { id: 'b21', name: 'YMCA Cagayan de Oro', markerId: 'cagayan_de_oro', link: 'https://www.facebook.com/cagayandeoroymca' },
    ],
  },
];

const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80';

function formatStat(n: number) {
  return new Intl.NumberFormat('en-PH').format(n);
}

const STRICT_EMAIL =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/** Digits only; typical PH numbers are 10–12 digits (with country code). */
function isValidPhPhone(raw: string) {
  const digits = raw.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 12;
}

function Find_Your_YMCA() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const navigate = useNavigate();

  const aggregate = useMemo(() => getLocalsAggregateStats(), []);

  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactTouched, setContactTouched] = useState(false);

  const emailInvalid = contactTouched && contactEmail.length > 0 && !STRICT_EMAIL.test(contactEmail.trim());
  const phoneInvalid =
    contactTouched && contactPhone.trim().length > 0 && !isValidPhPhone(contactPhone.trim());

  const activeLabel = useMemo(() => {
    if (!activeMarkerId) return null;
    return MARKERS.find((m) => m.id === activeMarkerId)?.label ?? null;
  }, [activeMarkerId]);

  return (
    <div className="find-ymca-page" ref={ref}>
      <section id="find-ymca" className="page-section page-section--white">
        <div className="page-section__inner">
          {/* ABOUT */}
    <section id="about" className="page-section page-section--white">
        <div
          className="about-banner reveal"
          style={{ backgroundImage: `url(${ABOUT_IMAGE})` }}
        >
          <div className="about-banner__overlay" />
          <div className="about-banner__inner">
            <h1 className="about-banner__title">
              About <span className="y-accent">Y</span> Philippines
            </h1>
            <p className="about-banner__body">
              We, the Young Men's Christian Association in the Philippines, are committed to
              advocating and working for the viability of the movement and empowerment of people
              through coordinated programs that will promote peace, sustainability of life with
              justice, and the holistic development of community.
            </p>
          </div>
        </div>
      </section>

          <SubjectHeader text="Find Your YMCA" className="reveal" />

          <div className="find-ymca__stats reveal reveal-delay-1" aria-label="Membership summary across configured locals">
            <div className="find-ymca__stat">
              <div className="find-ymca__stat-label">Corporate</div>
              <div className="find-ymca__stat-value">{formatStat(aggregate.corporate)}</div>
            </div>
            <div className="find-ymca__stat">
              <div className="find-ymca__stat-label">Non-Corporate</div>
              <div className="find-ymca__stat-value">{formatStat(aggregate.nonCorporate)}</div>
            </div>
            <div className="find-ymca__stat">
              <div className="find-ymca__stat-label">Youth</div>
              <div className="find-ymca__stat-value">{formatStat(aggregate.youth)}</div>
            </div>
            <div className="find-ymca__stat">
              <div className="find-ymca__stat-label">Others</div>
              <div className="find-ymca__stat-value">{formatStat(aggregate.others)}</div>
            </div>
            <div className="find-ymca__stat find-ymca__stat--total">
              <div className="find-ymca__stat-label">Total (reported)</div>
              <div className="find-ymca__stat-value">{formatStat(aggregate.total)}</div>
            </div>
          </div>

          <div className="find-ymca__layout reveal reveal-delay-1">
            <div className="find-ymca__map-wrap" aria-label="Map and branch highlight">
              <div className="find-ymca__map-layer">
                <img src={map} alt="Philippine Map" className="find-ymca__map-image" />
                <InteractivePhilippinesMap activeBranchId={activeMarkerId} markers={MARKERS} />
              </div>
              {activeLabel && (
                <div className="find-ymca__active-label" aria-live="polite">
                  {activeLabel}
                </div>
              )}
            </div>

            <ul className="find-ymca__regions" aria-label="Regions">
              {REGIONS.map((region) => (
                <li key={region.id} className="find-ymca__region">
                  <div className="find-ymca__region-title">{region.name}</div>
                  <ul className="find-ymca__branches" aria-label={`${region.name} branches`}>
                  {region.branches.map((b) => {
                    const local = getLocalById(b.markerId);
                    const logoSrc = local?.logoImageUrl ?? defaultBranchLogo;
                    const fb = b.link && b.link !== '#';
                    const rowActive = activeMarkerId === b.markerId;

                    return (
                      <li key={b.id} className="find-ymca__branch">
                        <div
                          className={rowActive ? 'find-ymca__branch-row find-ymca__branch-row--active' : 'find-ymca__branch-row'}
                          onMouseEnter={() => setActiveMarkerId(b.markerId)}
                          onFocus={() => setActiveMarkerId(b.markerId)}
                          onMouseLeave={() => setActiveMarkerId(null)}
                        >
                          {fb ? (
                            <a
                              className="find-ymca__branch-cta"
                              href={b.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${b.name} on Facebook`}
                            >
                              <img src={logoSrc} alt="" className="find-ymca__branch-logo" />
                              <span className="find-ymca__branch-name">{b.name}</span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              className="find-ymca__branch-cta find-ymca__branch-cta--fallback"
                              onClick={() => {
                                if (local) navigate(`/find-ymca/${local.id}`);
                              }}
                              disabled={!local}
                              aria-label={local ? `Open ${b.name} local page` : b.name}
                            >
                              <img src={logoSrc} alt="" className="find-ymca__branch-logo" />
                              <span className="find-ymca__branch-name">{b.name}</span>
                            </button>
                          )}
                          {local && fb ? (
                            <Link className="find-ymca__profile-pill" to={`/find-ymca/${local.id}`}>
                              Local page
                            </Link>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="contact-us" className="page-section page-section--white">
        <div className="page-section__inner">
          <SubjectHeader text="Contact Us" as="h1" className="reveal" />

          <div className="contact-layout reveal reveal-delay-1">
            {/* Google Map */}
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.172665460871!2d120.97979170421569!3d14.589235070481982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cbdfa4e6de45%3A0xad9f5ff94d5f823!2sYMCA%20of%20the%20Philippines%20Federation%20Office!5e0!3m2!1sen!2sph!4v1773130234298!5m2!1sen!2sph"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="YMCA Location"
              />
            </div>

            {/* Contact Form */}
            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                setContactTouched(true);
                if (!STRICT_EMAIL.test(contactEmail.trim())) return;
                if (contactPhone.trim() && !isValidPhPhone(contactPhone.trim())) return;
              }}
              noValidate
            >
              <p className="contact-form__lead">
                Leave your details and our team will reach out to you.
              </p>

              <input className="contact-input" type="text" placeholder="Name" required />
              <input className="contact-input" type="text" placeholder="Surname" required />
              <input
                className={`contact-input ${emailInvalid ? 'contact-input--invalid' : ''}`}
                type="email"
                placeholder="Email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                onBlur={() => setContactTouched(true)}
                aria-invalid={emailInvalid}
              />
              {emailInvalid ? <p className="contact-field-error">Enter a valid email address.</p> : null}

              <input
                className={`contact-input ${phoneInvalid ? 'contact-input--invalid' : ''}`}
                type="tel"
                inputMode="tel"
                placeholder="Phone (e.g. 0917 123 4567)"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                onBlur={() => setContactTouched(true)}
                aria-invalid={phoneInvalid}
              />
              {phoneInvalid ? (
                <p className="contact-field-error">Use a valid PH-style number (at least 10 digits).</p>
              ) : null}

              <textarea className="contact-textarea" placeholder="Your Message" />

              <div className="contact-actions">
                <button className="contact-submit" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Find_Your_YMCA;