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
import Footer from "./components/Footer"

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
        </Routes>
      </main>
      
      <Footer />
    </Router>
  );
}

export default App;