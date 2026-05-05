import { useEffect, useState } from 'react';
import { useLoading } from '../context/LoadingContext';
import logoImg from '../assets/images/logo.webp';
import './LoadingScreen.css';

export function LoadingScreen() {
  const { isLoading, loadingMessage } = useLoading();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Start fade-out animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match the fade-out duration

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [isLoading]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
      <div className="loading-container">
        <img src={logoImg} alt="YMCA Philippines Logo" className="loading-logo" />
        <div className="spinner"></div>
        <p className="loading-text">{loadingMessage}</p>
      </div>
    </div>
  );
}
