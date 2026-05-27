import { useEffect, useState } from 'react';
import type { ContentBlock, SlideshowImage } from '../components/ContentBuilder';
import './ContentRenderer.css';

interface ContentRendererProps {
  contentBlocks: ContentBlock[];
}

interface InlineSlideshowProps {
  images: SlideshowImage[];
}

function InlineSlideshow({ images }: InlineSlideshowProps) {
  const orderedImages = [...images].sort((a, b) => (a.order || 0) - (b.order || 0));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    if (!autoplay || orderedImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % orderedImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [autoplay, orderedImages.length]);

  if (orderedImages.length === 0) return null;

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    setAutoplay(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((current) => (current - 1 + orderedImages.length) % orderedImages.length);
    setAutoplay(false);
  };

  const goToNext = () => {
    setCurrentIndex((current) => (current + 1) % orderedImages.length);
    setAutoplay(false);
  };

  return (
    <div className="content-slideshow-block">
      <div className="content-slideshow-frame">
        <img
          src={orderedImages[currentIndex].url}
          alt={`Slideshow image ${currentIndex + 1}`}
          className="content-slideshow-image"
        />

        {orderedImages.length > 1 && (
          <>
            <button
              type="button"
              className="content-slideshow-nav content-slideshow-nav-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              className="content-slideshow-nav content-slideshow-nav-next"
              onClick={goToNext}
              aria-label="Next image"
            >
              &rsaquo;
            </button>
          </>
        )}
      </div>

      {orderedImages.length > 1 && (
        <div className="content-slideshow-footer">
          <div className="content-slideshow-indicators">
            {orderedImages.map((image, index) => (
              <button
                type="button"
                key={image.id || `${image.url}-${index}`}
                className={`content-slideshow-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToImage(index)}
                aria-label={`Go to slideshow image ${index + 1}`}
              />
            ))}
          </div>
          <span className="content-slideshow-counter">
            {currentIndex + 1} / {orderedImages.length}
          </span>
        </div>
      )}
    </div>
  );
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ contentBlocks }) => {
  if (!contentBlocks || contentBlocks.length === 0) {
    return <p>No content available.</p>;
  }

  return (
    <div className="content-renderer">
      {contentBlocks.map((block) => {
        if (block.type === 'text') {
          return (
            <div
              key={block.id}
              className="content-text-block"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          );
        } else if (block.type === 'image') {
          return (
            <div key={block.id} className="content-image-block">
              <img
                src={block.content}
                alt={block.alt || 'Article image'}
                className="content-image"
              />
              {block.alt && (
                <figcaption className="content-image-caption">{block.alt}</figcaption>
              )}
            </div>
          );
        } else if (block.type === 'slideshow') {
          return (
            <InlineSlideshow
              key={block.id}
              images={block.slideshow_images || []}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default ContentRenderer;
