import React, { useEffect, useRef, useState } from 'react';

const MediaCard = ({ type, title, description, thumbnail, link, aspectRatio }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      ref={cardRef} 
      className="media-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="media-thumbnail" data-ratio={aspectRatio}>
        {isVisible ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className="thumbnail-placeholder" />
        )}
        {type === 'video' && (
          <div className="play-icon">
            <div className="play-triangle" />
          </div>
        )}
      </div>
      <div className="media-overlay">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default MediaCard;
