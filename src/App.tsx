import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About_Y from './pages/Who_is_Y';
import Calendar from './pages/Calendar';
import Media from './pages/Media';
import Find_Your_YMCA from './pages/Find_Your_YMCA';
import Contact_Us from './pages/Contact_Us';
import Donate from './pages/Donate';
import Get_Involved from './pages/Get_Involved';

import Card_One from './pages/Card-Media/news/Card_One';
import Card_Two from './pages/Card-Media/news/Card_Two';
import Card_Three from './pages/Card-Media/news/Card_Three';
import Card_Four from './pages/Card-Media/news/Card_Four';
import Card_Five from './pages/Card-Media/news/Card_Five';
import Card_Six from './pages/Card-Media/news/Card_Six';
import Card_Seven from './pages/Card-Media/news/Card_Seven';
import Card_Eight from './pages/Card-Media/news/Card_Eight';

import Footer from './components/Footer';
import Partner from './components/Partners';


function App() {
  return (
    <Router>
      <Navbar />

      <main>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About_Y />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/media" element={<Media />} />
          <Route path="/find-ymca" element={<Find_Your_YMCA />} />
          <Route path="/contact" element={<Contact_Us />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/get-involved" element={<Get_Involved />} />

          <Route path="/news/Card_One" element={<Card_One />} />
          <Route path="/news/Card_Two" element={<Card_Two />} />
          <Route path="/news/Card_Three" element={<Card_Three />} />
          <Route path="/news/Card_Four" element={<Card_Four />} />
          <Route path="/news/Card_Five" element={<Card_Five />} />
          <Route path="/news/Card_Six" element={<Card_Six />} />
          <Route path="/news/Card_Seven" element={<Card_Seven />} />
          <Route path="/news/Card_Eight" element={<Card_Eight />} />
        </Routes>
      </main>
      
      <Footer />
    </Router>
  );
}

export default App;