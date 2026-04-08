import React, { useState } from 'react';
import Select from 'react-select';
import type { SingleValue } from 'react-select';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SubjectHeader from '../components/SubjectHeader';
import '../styles/design-system.css';
import './Article_Form.css';
import { PUBLIC_API_URL } from '../hooks/useApi';

type YMCAOption = {
  value: string;
  label: string;
};

const ymcaOptions: YMCAOption[] = [
  { value: 'baguio', label: 'YMCA of the City of Baguio' },
  { value: 'tuguegarao', label: 'City of Tuguegarao YMCA' },
  { value: 'nueva_ecija', label: 'YMCA of Nueva Ecija' },
  { value: 'pangasinan', label: 'YMCA of Pangasinan' },
  { value: 'makati', label: 'YMCA of Makati' },
  { value: 'manila', label: 'YMCA of Manila' },
  { value: 'manila_downtown', label: 'Manila Downtown YMCA' },
  { value: 'quezon_city', label: 'YMCA of Quezon City' },
  { value: 'albay', label: 'YMCA of Albay' },
  { value: 'los_banos', label: 'YMCA of Los Baños' },
  { value: 'san_pablo', label: 'YMCA of San Pablo' },
  { value: 'nueva_caceres', label: 'YMCA of Nueva Caceres' },
  { value: 'cebu', label: 'YMCA of Cebu' },
  { value: 'leyte', label: 'YMCA of Leyte' },
  { value: 'negros_occidental', label: 'YMCA of Negros Occidental' },
  { value: 'negros_oriental', label: 'YMCA of Negros Oriental' },
  { value: 'ormoc', label: 'City of Ormoc YMCA' },
  { value: 'san_carlos_city', label: 'YMCA of San Carlos City' },
  { value: 'davao', label: 'YMCA of Davao' },
  { value: 'cagayan_de_oro', label: 'YMCA Cagayan de Oro' },
];

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function Article() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [selectedYMCA, setSelectedYMCA] = useState<YMCAOption | null>(null);
  const [email, setEmail] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [touched, setTouched] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [message, setMessage] = useState('');

  const emailInvalid = touched && email.length > 0 && !EMAIL_RE.test(email.trim());
  const urlInvalid = touched && articleUrl.length > 0 && !/^https?:\/\/.+\..+/.test(articleUrl.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!selectedYMCA || 
        !EMAIL_RE.test(email.trim()) ||
        !/^https?:\/\/.+\..+/.test(articleUrl.trim())
      ) {
      return;
    }

    try {
      const response = await fetch(`${PUBLIC_API_URL}/submit-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          local_ymca: selectedYMCA?.value,
          title, 
          subtitle,
          articleUrl,
          email,
          message,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', response.status, errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success:', data);

      alert('Thank you — your update was recorded for review.');

      //OPTIONAL: reset form
      setName('');
      setSelectedYMCA(null);
      setTitle('');
      setSubtitle('');
      setArticleUrl('');
      setEmail('');
      setMessage('');

    } catch (error) {
      console.error('Error submitting update:', error);
      alert('An error occurred while submitting your update. Please try again later.');
    }
  };

  return (
    <div className="article-form-page page-section page-section--white" ref={ref}>
      <div className="page-section__inner">
        <SubjectHeader text="Submit YMCA Update" as="h1" className="reveal" />

        <form className="article-form reveal reveal-delay-1" onSubmit={handleSubmit} noValidate>
          <p className="article-form__lead">
            To share your local YMCA update on the official website of the YMCA of the Philippines, kindly provide the
            following details.
          </p>

          <div className="article-form__grid">
            <div>
              <label className="article-form__label" htmlFor="ymca-update-name">
                Name
              </label>
              <input 
                id="ymca-update-name" 
                className="article-form__field" 
                type="text" 
                placeholder="Your name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <span className="article-form__label" id="ymca-local-label">
                Local YMCA
              </span>
              <Select<YMCAOption>
                aria-labelledby="ymca-local-label"
                options={ymcaOptions}
                placeholder="Select or search local YMCA…"
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable
                value={selectedYMCA}
                onChange={(option) => setSelectedYMCA(option as SingleValue<YMCAOption>)}
              />
              {touched && !selectedYMCA ? (
                <p className="article-form__error">Please select a local YMCA.</p>
              ) : null}
            </div>

            <div>
              <label className="article-form__label" htmlFor="ymca-update-title">
                Title
              </label>
              <input 
                id="ymca-update-title" 
                className="article-form__field" 
                type="text" 
                placeholder="Headline" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="article-form__label" htmlFor="ymca-update-subtitle">
                Subtitle
              </label>
              <input 
                id="ymca-update-subtitle" 
                className="article-form__field" 
                type="text" 
                placeholder="Short summary" 
                required 
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>

            <div>
              <label className="article-form__label" htmlFor="ymca-update-url">
                Article link for review
              </label>
              <input
                id="ymca-update-url"
                className={`article-form__field ${urlInvalid ? 'article-form__field--invalid' : ''}`}
                type="url"
                inputMode="url"
                placeholder="https://…"
                value={articleUrl}
                onChange={(e) => setArticleUrl(e.target.value)}
                onBlur={() => setTouched(true)}
                required
                aria-invalid={urlInvalid}
              />
              {urlInvalid ? <p className="article-form__error">Enter a valid URL (include https://).</p> : null}
            </div>

            <div>
              <label className="article-form__label" htmlFor="ymca-update-email">
                Email
              </label>
              <input
                id="ymca-update-email"
                className={`article-form__field ${emailInvalid ? 'article-form__field--invalid' : ''}`}
                type="email"
                autoComplete="email"
                placeholder="name@organization.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                required
                aria-invalid={emailInvalid}
              />
              {emailInvalid ? <p className="article-form__error">Enter a valid email address.</p> : null}
            </div>

            <div>
              <label className="article-form__label" htmlFor="ymca-update-message">
                Message
              </label>
              <textarea
                id="ymca-update-message"
                className="article-form__field article-form__textarea"
                placeholder="Additional context for the web team"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="article-form__actions">
            <button className="article-form__submit" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Article;
