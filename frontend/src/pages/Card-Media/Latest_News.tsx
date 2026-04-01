// Latest_News.tsx
import React from 'react';
import Card from './Card.tsx';
import { Link } from 'react-router-dom';
import { LATEST_NEWS } from '../../data/news';

const LatestNews: React.FC = () => {
  return (
    <>
      {LATEST_NEWS.map((item) => (
        <Card key={item.path} title={item.title} subtitle={item.date} imageUrl={item.imageUrl}>
          <Link to={item.path}>Read More</Link>
        </Card>
      ))}
    </>
  );
};

export default LatestNews;