import Navbar from './components/Navbar';
import './App.css';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
=======
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
>>>>>>> 0ac1e4a8513bef680c8307afe418cb8b5a90d925
import { useEffect } from 'react';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { LoadingScreen } from './components/LoadingScreen';

import Home from './pages/Home';
import Calendar from './pages/What_We_Do';
import Documents from './pages/Documents';
import Find_Your_YMCA from './pages/Where_We_Are';
<<<<<<< HEAD
=======
import Donate from './pages/Donate';
>>>>>>> 0ac1e4a8513bef680c8307afe418cb8b5a90d925
import Get_Involved from './pages/Get_Involved';
import LocalDetails from './pages/LocalDetails';
import About_Us from './pages/About_Us';
import Developer from './pages/developer';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

import Footer from './components/Footer';
import Article from './pages/Article_Form';
import NewsDetail from './pages/NewsDetail';
import AboutUsHighlights from './pages/Card-Media/articles/about_us';

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
    <LoadingProvider>
      <LoadingScreen />
      <Router basename="/">
        <AppContent />
      </Router>
    </LoadingProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const { setIsLoading } = useLoading();
  const isAdminRoute = location.pathname.startsWith('/secure-management/v3/k7n4m9p2q8c1x5j3');

  // Hide loading screen when content is mounted
  useEffect(() => {
    // Use a small delay to ensure render has completed
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <ScrollToHash />

      <main style={{ paddingTop: isAdminRoute ? 0 : undefined }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/secure-management/v3/k7n4m9p2q8c1x5j3/portal/login" element={<AdminLogin />} />
          <Route path="/secure-management/v3/k7n4m9p2q8c1x5j3/portal/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/secure-management/v3/k7n4m9p2q8c1x5j3/*" element={<Navigate to="/secure-management/v3/k7n4m9p2q8c1x5j3/portal/login" replace />} />
<<<<<<< HEAD
          <Route path="/calendar" element={<Navigate to="/what-we-do" replace />} />
          <Route path="/find-ymca" element={<Navigate to="/where-we-are" replace />} />
          <Route path="/find-ymca/:localId" element={<RedirectFindYMCA />} />
          <Route path="/what-we-do" element={<Calendar />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/where-we-are" element={<Find_Your_YMCA />} />
          <Route path="/where-we-are/:localId" element={<LocalDetails />} />
          <Route path="/donate" element={<Navigate to="/get-involved" replace />} />
=======
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/find-ymca" element={<Find_Your_YMCA />} />
          <Route path="/find-ymca/:localId" element={<LocalDetails />} />
          <Route path="/donate" element={<Donate />} />
>>>>>>> 0ac1e4a8513bef680c8307afe418cb8b5a90d925
          <Route path="/get-involved" element={<Get_Involved />} />
          <Route path="/about-us" element={<About_Us />} />
          <Route path="/about-us/highlights" element={<AboutUsHighlights />} />
          <Route path="/x7f4t9w2k8" element={<Developer />} />

          <Route path="/article" element={<Article />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

<<<<<<< HEAD
function RedirectFindYMCA() {
  const { localId } = useParams();
  return <Navigate to={`/where-we-are/${localId}`} replace />;
}

export default App;
=======
export default App;
>>>>>>> 0ac1e4a8513bef680c8307afe418cb8b5a90d925
