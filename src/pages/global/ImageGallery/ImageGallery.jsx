// src/pages/projects/ProjectDetails/ImageGallery.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom, Keyboard } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

// Import gallery-specific styles
import './ImageGallery.css';

/**
 * ImageGallery Component
 * 
 * A full-screen, modal-based image gallery with:
 * - Swiper carousel with navigation, zoom, and keyboard support
 * - Thumbnail strip for quick navigation
 * - Responsive design for all screen sizes
 * - Smooth animations with Framer Motion
 * 
 * @param {Array} images - Array of image URLs
 * @param {number} initialIndex - Index of image to show initially (default: 0)
 * @param {Function} onClose - Callback function when gallery closes
 * @param {string} projectTitle - Title for alt text and accessibility
 */
const ImageGallery = ({ 
  images = [], 
  initialIndex = 0, 
  onClose, 
  projectTitle = 'Project' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Prevent body scroll when gallery is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle ESC key to close gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  // Handle slide change
  const handleSlideChange = (swiper) => {
    setCurrentIndex(swiper.activeIndex);
  };

  // Safety check for images
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="image-gallery-modal"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Image Gallery"
      >
        <div
          className="image-gallery-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Back Button (Top Left) */}
          <button
            className="gallery-back-btn"
            onClick={onClose}
            aria-label="Close gallery and return"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
           
          </button>



          {/* Main Swiper Area */}
          <div className="image-gallery-main">
            <Swiper
              style={{
                '--swiper-navigation-color': '#D4AF37',
                '--swiper-pagination-color': '#D4AF37',
              }}
              modules={[Navigation, Pagination, Zoom, Keyboard]}
              initialSlide={initialIndex}
              onSwiper={setSwiperInstance}
              onSlideChange={handleSlideChange}
              spaceBetween={30}
              slidesPerView={1}
              navigation={true}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              zoom={{
                maxRatio: 3,
                minRatio: 1,
              }}
              keyboard={{
                enabled: true,
              }}
              grabCursor={true}
              className="image-gallery-swiper"
              loop={images.length > 1}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="swiper-zoom-container">
                    <img
                      src={image}
                      alt={`${projectTitle} - Image ${index + 1} of ${images.length}`}
                      draggable="false"
                      onDragStart={(e) => e.preventDefault()}
                      loading={index === initialIndex ? 'eager' : 'lazy'}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div
              className="image-gallery-thumbnails"
              role="tablist"
              aria-label="Image thumbnails"
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleThumbnailClick(index);
                    }
                  }}
                  className={`gallery-thumbnail ${
                    currentIndex === index ? 'active' : ''
                  }`}
                  role="tab"
                  aria-selected={currentIndex === index}
                  aria-label={`View image ${index + 1}`}
                  tabIndex={0}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageGallery;