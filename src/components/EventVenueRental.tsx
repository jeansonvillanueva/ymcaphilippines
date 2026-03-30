import { useState, useEffect } from 'react';
import './EventVenueRental.css';

interface EventVenueRentalProps {
  images: string[];
}

export default function EventVenueRental({ images }: EventVenueRentalProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % images.length);
    }, 5000); // change slide every 5s
  
    return () => clearInterval(interval);
  }, [images.length]);

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
                Tel: <a className="event-venue-rental__contact-link" href="tel:+63285280557">
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
            {images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`YMCA Event Venue - 7th Floor Convention Hall ${index + 1}`} 
                className={
                  index === activeSlide
                    ? 'event-venue-rental__image event-venue-rental__image--active'
                    : 'event-venue-rental__image'
                }
              />
            ))}
            
            {images.length > 1 && (
              <div className="event-venue-rental__dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={
                      index === activeSlide
                        ? 'event-venue-rental__dot event-venue-rental__dot--active'
                        : 'event-venue-rental__dot'
                    }
                    onClick={() => setActiveSlide(index)}
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
