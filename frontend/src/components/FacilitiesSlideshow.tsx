import { useState, useEffect } from 'react';
import axios from 'axios';
import { PUBLIC_API_URL } from '../hooks/useApi';
import './FacilitiesSlideshow.css';

interface Facility {
  name: string;
  details?: string;
  isEnabled: boolean;
}

interface FacilityImage {
  id: number;
  local_id: string;
  image_url: string;
  image_order: number;
}

interface FacilitiesSlideshowProps {
  localId: string;
}

export default function FacilitiesSlideshow({ localId }: FacilitiesSlideshowProps) {
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [images, setImages] = useState<FacilityImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, [localId]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${PUBLIC_API_URL}/facilities/${localId}`);
      setAllFacilities(response.data.allFacilities || []);
      setImages(response.data.images || []);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setAllFacilities([]);
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
    if (url.startsWith('/uploads/')) return `/testsite/backend${url}`;
    if (url.startsWith('/php-api/uploads/')) {
      return `/testsite/backend/${url.substring('/php-api/uploads/'.length)}`;
    }
    return url;
  };

  if (loading) {
    return <div className="facilities-slideshow-loading">Loading facilities...</div>;
  }

  // Check if there are any facilities at all
  const hasFacilities = allFacilities.length > 0;

  if (!hasFacilities && images.length === 0) {
    return null;
  }

  return (
    <div className="facilities-slideshow">
      <div className="facilities-slideshow-container">
        {/* Slideshow section - only show if there are images */}
        {images.length > 0 && (
          <div className="facilities-slideshow-image-section">
            <div className="facilities-slideshow-image-wrapper">
              <img
                src={normalizeImageUrl(images[currentImageIndex].image_url)}
                alt={`Facility image ${currentImageIndex + 1}`}
                className="facilities-slideshow-image"
              />

              {images.length > 1 && (
                <>
                  <button
                    className="facilities-slideshow-nav facilities-slideshow-nav-prev"
                    onClick={goToPreviousImage}
                    aria-label="Previous image"
                  >
                    ❮
                  </button>
                  <button
                    className="facilities-slideshow-nav facilities-slideshow-nav-next"
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
              <div className="facilities-slideshow-indicators">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`facilities-slideshow-indicator ${
                      index === currentImageIndex ? 'active' : ''
                    }`}
                    onClick={() => goToImage(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Facilities List - Show all enabled facilities */}
        {hasFacilities && (
          <div className="facilities-list-all">
            <h3>Available Facilities</h3>
            <ul className="facilities-bullet-list">
              {allFacilities
                .filter((f) => f.isEnabled)
                .map((facility, index) => (
                  <li key={index} className="facilities-item-bullet">
                    <span className="facilities-item-label">{facility.name}</span>
                    {facility.details && (
                      <span className="facilities-item-details">{facility.details}</span>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
