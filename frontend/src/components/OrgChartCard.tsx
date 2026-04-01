import React from 'react';
import '../styles/design-system.css';

export interface OrgChartCardProps {
  name: string;
  position: string;
  imageUrl?: string | null;
}

const OrgChartCard: React.FC<OrgChartCardProps> = ({ name, position, imageUrl }) => {
  return (
    <div className="org-chart-card">
      <div className="org-chart-card__image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="org-chart-card__image" />
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
