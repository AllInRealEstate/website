import { Star, Globe, MapPin, User, X } from 'lucide-react';
import './ReviewTooltip.css';

const ReviewTooltip = ({ review, isVisible, onClose }) => {
  if (!isVisible || !review) return null;

  // Handle backdrop click to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // Handle escape key to close
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  };

  return (
    <div 
      className="review-tooltip-overlay" 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="review-tooltip-card">
        {/* Close button */}
        <button 
          className="review-tooltip-close" 
          onClick={onClose}
          aria-label="Close"
        >
          X
        </button>

        {/* Header with Stars and Badge */}
        <div className="review-tooltip-header">
          <div className="review-tooltip-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < review.rating ? "#D4AF37" : "none"}
                color={i < review.rating ? "#D4AF37" : "#6b7280"}
                strokeWidth={1.5}
              />
            ))}
            <span className="review-tooltip-rating">{review.rating}/5</span>
          </div>

          {review.isFallback && (
            <div className="review-tooltip-badge">
              <Globe size={14} />
              <span>{review.originalLanguage.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Full Review Text */}
        <div className="review-tooltip-text">
          "{review.text}"
        </div>

        {/* Author Info */}
        <div className="review-tooltip-footer">
          <div className="review-tooltip-info">
            <User size={16} />
            <span>{review.author}</span>
          </div>
          <div className="review-tooltip-info">
            <MapPin size={16} />
            <span>{review.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTooltip;