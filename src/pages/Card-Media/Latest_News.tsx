// Latest_News.tsx
import React from 'react';
import Card from './Card.tsx';

const LatestNews: React.FC = () => {
  return (
    <div>
      <Card title="8th National Youth Assembly" subtitle="November 6-7, 2026" imageUrl="https://via.placeholder.com/300x150">
        <a href="/news/Card_One">Read More</a>
      </Card>

      <Card title="Basic Training for Support Staff" subtitle="September 29 - October 4, 2025" imageUrl="https://via.placeholder.com/300x150">
        <a href="/news/Card_Two">Read More</a>
      </Card>

      <Card title="45th Rizal Youth Leadership Training Institute (RYLTI)" imageUrl="https://via.placeholder.com/300x150">
        <a href="/news/Card_Three">Read More</a>
      </Card>

      <Card title="YMCA National Eco-Heroes Training" imageUrl="https://via.placeholder.com/300x150">
        <a href="news/Card_Four">Read More</a>
      </Card>

      <Card title="YMCA & YWCA National Youth Summit" imageUrl="https://via.placeholder.com/300x150">
        <a href="news/Card_Five">Read More</a>
      </Card>

      <Card title="The 53rd National Council Meeting & 113th Anniversary Celebration" imageUrl="https://via.placeholder.com/300x150">
        <a href="news/Card_Six">Read More</a>
      </Card>

      <Card title="A Transformative Journey : The 7th National Youth Assembly" imageUrl="https://via.placeholder.com/300x150">
        <a href="news/Card_Seven">Read More</a>
      </Card>

      <Card title="YMCA CAREER DEVELOPMENT PROGRAM" imageUrl="https://via.placeholder.com/300x150">
        <a href="news/Card_Eight">Read More</a>
      </Card>
    </div>
  );
};

export default LatestNews;