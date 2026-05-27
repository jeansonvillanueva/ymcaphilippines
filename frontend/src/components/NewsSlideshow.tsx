import { useState, useEffect } from 'react';
import axios from 'axios';
import { PUBLIC_API_URL } from '../hooks/useApi';
import './NewsSlideshow.css';

interface NewsImage {
  id: number;
  news_id: number;
  image_url: string;
  image_order: number;
}

interface NewsSlideshowProps {
  newsId: number;
}

export default function NewsSlideshow({ newsId }: NewsSlideshowProps) {
  const [images, setImages] = useState<NewsImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    fetchNewsImages();
  }, [newsId]);

  const fetchNewsImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${PUBLIC_API_URL}/news/${newsId}/images`);
      setImages(response.data || []);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Error fetching news images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-play slideshow
  useEffect(() => {
    if (!autoplay || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [autoplay, images.length]);

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setAutoplay(false);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setAutoplay(false);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setAutoplay(false);
  };

  const normalizeImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/backend/uploads/')) return url;
    if (url.startsWith('/uploads/')) return `/backend${url}`;
    if (url.startsWith('/php-api/uploads/')) {
      return `/backend/${url.substring('/php-api/uploads/'.length)}`;
    }
    return url;
  };

  if (loading) {
    return <div className="news-slideshow-loading">Loading slideshow...</div>;
  }

  // Only show if there are images
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="news-slideshow">
      <div className="news-slideshow-container">
        {/* Slideshow section */}
        <div className="news-slideshow-image-section">
          <div className="news-slideshow-image-wrapper">
            <img
              src={normalizeImageUrl(images[currentImageIndex].image_url)}
              alt={`News image ${currentImageIndex + 1}`}
              className="news-slideshow-image"
            />

            {/* Navigation buttons - only show if there are multiple images */}
            {images.length > 1 && (
              <>
                <button
                  className="news-slideshow-nav news-slideshow-nav-prev"
                  onClick={goToPreviousImage}
                  aria-label="Previous image"
                >
                  ❮
                </button>
                <button
                  className="news-slideshow-nav news-slideshow-nav-next"
                  onClick={goToNextImage}
                  aria-label="Next image"
                >
                  ❯
                </button>
              </>
            )}
          </div>

          {/* Image indicators */}
          {images.length > 1 && (
            <div className="news-slideshow-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`news-slideshow-indicator ${
                    index === currentImageIndex ? 'active' : ''
                  }`}
                  onClick={() => goToImage(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="news-slideshow-counter">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
