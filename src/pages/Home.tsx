// src/pages/Home.tsx
import React from 'react';
import LatestNews from './Card-Media/Latest_News';
import Find_Your_YMCA from './Find_Your_YMCA';
import Partners from '../components/Partners';

const Home: React.FC = () => {
  return (
    <div className="container">
      <div>
        <h1>Helping Filipino youth improve their lives.</h1>
        <p>
          Since the first YMCA opened in Manila in 1911, YMCA programs are offered at more than 21 locations
          across the Philippines and help people become healthier in spirit, mind and body.
        </p>
      </div>

      <div>
        <h1>Y latest News</h1>
        <LatestNews />
      </div>
      
      <div>
        <h1>Global impact, lives changed</h1>
        <p>Experience the inspiring stories of YMCAs worldwide—from supporting refugees and empowering young people, to fostering mental health and sustainability. In 2024, we made a series of films showcasing real impact across the four Pillars of YMCA Vision 2030. We screened them at the Accelerator Summit in Mombasa, and you can see them all on the Pillar pages of this website, and on our World YMCA YouTube site. And see here all 8 films rolled into one!</p>
      </div>

      <div>
        <h1>Y Making Impact</h1>
        <Find_Your_YMCA />
      </div>

      <div>
        <Partners />
      </div>
      

  
    </div>
  );
};

export default Home;