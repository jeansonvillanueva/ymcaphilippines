import { useState, useEffect } from 'react';
import './EventVenueRental.css';

interface EventVenueRentalProps {
  imageUrl?: string;
  images?: string[];
}

export default function EventVenueRental({ imageUrl, images }: EventVenueRentalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideImages = images && images.length > 0 ? images : (imageUrl ? [imageUrl] : []);

  useEffect(() => {
    if (slideImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slideImages.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  if (slideImages.length === 0) return null;

  return (
    <section className="event-venue-rental">
      <div className="page-section__inner event-venue-rental__inner">
        <div className="event-venue-rental__layout">
          <div className="event-venue-rental__content">
            <h2 className="event-venue-rental__title">Event Venue</h2>
            <h3 className="event-venue-rental__subtitle">RENTAL</h3>
            
            <p className="event-venue-rental__description">
              Elevate your event at the YMCA of the Philippines' 7th Floor Convention Hall, where functionality meets a welcoming and professional atmosphere
            </p>
            
            <div className="event-venue-rental__contact">
              <p className="event-venue-rental__contact-label">
                For more inquiries, kindly contact us via:
              </p>
              <p className="event-venue-rental__contact-item">
                Tel: <a className="event-venue-rental__contact-link" href="cel:">
                    <span>+(02) 8528-0557</span>
                </a>              
              </p>
              <p className="event-venue-rental__contact-item">
                Cel: <a className="event-venue-rental__contact-link" href="tel:+63932905075">
                    <span>0939-329-05-75</span>
                </a>              
              </p>
              <p className="event-venue-rental__contact-item">
                <span className="event-venue-rental__contact-title">Email:</span> <a href="mailto:ymcaphilippines@yahoo.com">ymcaphilippines@yahoo.com</a>
              </p>
            </div>
          </div>
          
          <div className="event-venue-rental__image-wrap">
            {slideImages.length > 1 && (
              <button 
                className="event-venue-rental__nav-button event-venue-rental__nav-button--prev"
                onClick={handlePrevSlide}
                aria-label="Previous slide"
              >
                ‹
              </button>
            )}
            <img 
              src={slideImages[currentSlide]} 
              alt="YMCA Event Venue - 7th Floor Convention Hall" 
              className="event-venue-rental__image"
            />
            {slideImages.length > 1 && (
              <button 
                className="event-venue-rental__nav-button event-venue-rental__nav-button--next"
                onClick={handleNextSlide}
                aria-label="Next slide"
              >
                ›
              </button>
            )}
            
            {slideImages.length > 1 && (
              <div className="event-venue-rental__dots">
                {slideImages.map((_, index) => (
                  <button
                    key={index}
                    className={`event-venue-rental__dot ${index === currentSlide ? 'event-venue-rental__dot--active' : ''}`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
