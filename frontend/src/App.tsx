import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { LoadingProvider } from './context/LoadingContext';
import { NewsProvider } from './context/NewsContext';
import { LoadingScreen } from './components/LoadingScreen';

import Home from './pages/Home';
import Calendar from './pages/What_We_Do';
import Documents from './pages/Documents';
import Find_Your_YMCA from './pages/Where_We_Are';
import Get_Involved from './pages/Get_Involved';
import LocalDetails from './pages/LocalDetails';
import About_Us from './pages/About_Us';
import Developer from './pages/developer';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminNewsPreview from './pages/admin/AdminNewsPreview';
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
      <NewsProvider>
        <LoadingScreen />
        <Router basename="/">
          <AppContent />
        </Router>
      </NewsProvider>
    </LoadingProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/secure-management/v3/k7n4m9p2q8c1x5j3');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <ScrollToHash />

      <main className={isAdminRoute ? 'main--admin' : undefined}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/secure-management/v3/k7n4m9p2q8c1x5j3/portal/login" element={<AdminLogin />} />
          <Route path="/secure-management/v3/k7n4m9p2q8c1x5j3/portal/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route
            path="/secure-management/v3/k7n4m9p2q8c1x5j3/portal/news/preview"
            element={
              <ProtectedRoute>
                <AdminNewsPreview />
              </ProtectedRoute>
            }
          />
          <Route path="/secure-management/v3/k7n4m9p2q8c1x5j3/*" element={<Navigate to="/secure-management/v3/k7n4m9p2q8c1x5j3/portal/login" replace />} />
          <Route path="/calendar" element={<Navigate to="/what-we-do" replace />} />
          <Route path="/find-ymca" element={<Navigate to="/where-we-are" replace />} />
          <Route path="/find-ymca/:localId" element={<RedirectFindYMCA />} />
          <Route path="/what-we-do" element={<Calendar />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/where-we-are" element={<Find_Your_YMCA />} />
          <Route path="/where-we-are/:localId" element={<LocalDetails />} />
          <Route path="/donate" element={<Navigate to="/get-involved" replace />} />
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

function RedirectFindYMCA() {
  const { localId } = useParams();
  return <Navigate to={`/where-we-are/${localId}`} replace />;
}

export default App;
