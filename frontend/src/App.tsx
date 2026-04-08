import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import About_Y from './pages/Home';
import Calendar from './pages/What_We_Do';
import Find_Your_YMCA from './pages/Where_We_Are';
import Donate from './pages/Donate';
import Get_Involved from './pages/Get_Involved';
import LocalDetails from './pages/LocalDetails';
import About_Us from './pages/About_Us';
import AboutUsHighlights from './pages/Card-Media/articles/about_us';
import Developer from './pages/developer';
import AdminDashboard from './pages/admin/AdminDashboard';

import Card_One from './pages/Card-Media/news/Card_One';
import Card_Two from './pages/Card-Media/news/Card_Two';
import Card_Three from './pages/Card-Media/news/Card_Three';
import Card_Four from './pages/Card-Media/news/Card_Four';
import Card_Five from './pages/Card-Media/news/Card_Five';
import Card_Six from './pages/Card-Media/news/Card_Six';
import Card_Seven from './pages/Card-Media/news/Card_Seven';
import Article_One from './pages/Card-Media/articles/Manila_YMCA/Article_One';
import Article_Two from './pages/Card-Media/articles/Manila_YMCA/Article_Two';

import Footer from './components/Footer';
import Article from './pages/Article_Form';

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    // Always start at top when navigating to a new page without a hash.
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    const id = hash.replace('#', '');
    // Defer until after paint so the section exists.
    window.requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;

      // Offset for fixed navbar.
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: Math.max(0, y), left: 0, behavior: 'smooth' });
    });
  }, [hash, pathname]);

  return null;
}

function App() {
  return (
    <Router basename="/testsite">
      <Navbar />
      <ScrollToHash />

      <main>
      <Routes>
          <Route path="/" element={<About_Y />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/find-ymca" element={<Find_Your_YMCA />} />
          <Route path="/find-ymca/:localId" element={<LocalDetails />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/get-involved" element={<Get_Involved />} />
          <Route path="/about-us" element={<About_Us />} />
          <Route path="/about-us/highlights" element={<AboutUsHighlights />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/article" element={<Article />} />

          <Route path="/news/Card_One" element={<Card_One />} />
          <Route path="/news/Card_Two" element={<Card_Two />} />
          <Route path="/news/Card_Three" element={<Card_Three />} />
          <Route path="/news/Card_Four" element={<Card_Four />} />
          <Route path="/news/Card_Five" element={<Card_Five />} />
          <Route path="/news/Card_Six" element={<Card_Six />} />
          <Route path="/news/Card_Seven" element={<Card_Seven />} />
          <Route path="/news/Article_One" element={<Article_One />} />
          <Route path="/news/Article_Two" element={<Article_Two />} />
        </Routes>
      </main>
      
      <Footer />
    </Router>
  );
}

export default App;