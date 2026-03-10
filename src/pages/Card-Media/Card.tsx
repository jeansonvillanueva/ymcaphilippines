import React from 'react';
import './Card.css';

interface CardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, imageUrl, children }) => {
  return (
    <div className="card-container">
      {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
      <div className="card-content">
        <div className="card-title">{title}</div>
        {subtitle && <div className="card-subtitle">{subtitle}</div>}
        {children}
      </div>
    </div>
  );
};

export default Card;