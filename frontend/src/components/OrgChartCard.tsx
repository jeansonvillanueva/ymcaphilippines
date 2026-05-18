import React from 'react';
import '../styles/design-system.css';

export interface OrgChartCardProps {
  name: string;
  position: string;
  imageUrl?: string | null;
}

const normalizeImageUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/backend/uploads/')) return url;
  if (url.startsWith('/uploads/')) return `/backend${url}`;
  if (url.startsWith('/php-api/uploads/')) return `/backend/${url.substring('/php-api/uploads/'.length)}`;
  return url;
};

const OrgChartCard: React.FC<OrgChartCardProps> = ({ name, position, imageUrl }) => {
  const resolvedImageUrl = normalizeImageUrl(imageUrl);

  return (
    <div className="org-chart-card">
      <div className="org-chart-card__image-wrap">
        {resolvedImageUrl ? (
          <img src={resolvedImageUrl} alt={name} className="org-chart-card__image" />
        ) : (
          <div className="org-chart-card__placeholder" aria-hidden />
        )}
      </div>
      <div className="org-chart-card__body">
        <div className="org-chart-card__name">{name}</div>
        <div className="org-chart-card__position">{position}</div>
      </div>
    </div>
  );
};

export default OrgChartCard;
