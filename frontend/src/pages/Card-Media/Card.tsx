import React from 'react';
import './Card.css';

const normalizeImageUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/testsite/') || url.startsWith('/testsite/backend/uploads/')) return url;
  if (url.startsWith('/backend/uploads/')) return url;
  if (url.startsWith('/uploads/')) return `/testsite/backend${url}`;
  if (url.startsWith('/php-api/uploads/')) return `/testsite/backend/${url.substring('/php-api/uploads/'.length)}`;
  return url;
};

interface CardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  tag?: string;
  description?: string;
  /** Articles use a distinct editorial layout */
  variant?: 'news' | 'article';
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, imageUrl, tag, description, variant = 'news', children }) => {
  return (
    <div className={variant === 'article' ? 'card-container card-container--article' : 'card-container'}>
      <div className="card-media">
        {tag ? <div className="card-tag">{tag}</div> : null}
        {imageUrl ? (
          <img src={normalizeImageUrl(imageUrl)} alt={title} className="card-image" />
        ) : (
          <div className="card-image card-image--placeholder" aria-hidden>
            Image template — to be modified later
          </div>
        )}
      </div>
      <div className="card-content">
        <div className="card-title">{title}</div>
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
        {description ? <div className="card-description">{description}</div> : null}
        {children}
      </div>
    </div>
  );
};

export default Card;