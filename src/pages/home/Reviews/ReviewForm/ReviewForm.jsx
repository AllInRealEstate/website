import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { submitReview } from '../../../../services/ReviewsApi';
import { X, Star, Send } from 'lucide-react';
import './ReviewForm.css';

const ReviewForm = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    author: '',
    location: '',
    rating: 5,
    text: ''
  });
  
  const [hoverRating, setHoverRating] = useState(0);

  // Detect if current language is RTL
  const isRTL = i18n.language === 'ar' || i18n.language === 'he';
  const direction = isRTL ? 'rtl' : 'ltr';

  const mutation = useMutation({
    mutationFn: (data) => submitReview(data),
    onSuccess: () => {
      toast.success(
        t('reviews.form.success') || 
        'Thank you! Your review has been submitted and will appear after approval.',
        { autoClose: 4000 }
      );
      
      // Refresh reviews list
      queryClient.invalidateQueries(['websiteReviews']);
      
      // Reset and close
      setFormData({ author: '', location: '', rating: 5, text: '' });
      onClose();
    },
    onError: (error) => {
      console.error('Review submission error:', error);
      toast.error(
        t('reviews.form.error') || 
        'Failed to submit review. Please try again.'
      );
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate review text
    if (!formData.text.trim()) {
      toast.warning(
        t('reviews.form.reviewRequired') || 
        'Please write your review before submitting.'
      );
      return;
    }

    mutation.mutate({
      ...formData,
      lang: i18n.language
    });
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      onClose();
    }
  };

  // Rating descriptions with proper fallbacks
  const getRatingText = (rating) => {
    const ratingKey = `reviews.form.rating${rating}`;
    const translated = t(ratingKey);
    
    // If translation key is returned as-is, use fallback
    if (translated === ratingKey) {
      const fallbacks = {
        5: '⭐ Excellent!',
        4: '⭐ Very Good',
        3: '⭐ Good',
        2: '⭐ Fair',
        1: '⭐ Needs Improvement'
      };
      return fallbacks[rating] || '';
    }
    
    return translated;
  };

  if (!isOpen) return null;

  const currentRating = hoverRating || formData.rating;

  return (
    <div className="review-modal-overlay" onClick={handleClose}>
      <div 
        className="review-modal-container" 
        onClick={e => e.stopPropagation()}
        dir={direction}
      >
        
        {/* Header */}
        <div className="review-modal-header">
          <h3>{t('reviews.form.title') || 'Share Your Experience'}</h3>
          <button 
            className="close-btn" 
            onClick={handleClose}
            disabled={mutation.isPending}
            aria-label={t('common.close') || 'Close modal'}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          
          {/* Star Rating Section */}
          <div className="rating-section">
            <div className="rating-label">
              {t('reviews.form.rating') || 'Rate Your Experience'}
            </div>
            <div className="star-rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= currentRating ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${t('reviews.form.rate') || 'Rate'} ${star} ${t('reviews.form.stars') || 'stars'}`}
                >
                  <Star 
                    fill={star <= currentRating ? "currentColor" : "none"} 
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <div className="rating-text">
              {getRatingText(currentRating)}
            </div>
          </div>

          {/* Review Text (Required) */}
          <div className="form-group">
            <label>
              {t('reviews.form.review') || 'Your Review'}
            </label>
            <textarea 
              required 
              value={formData.text}
              onChange={e => setFormData({...formData, text: e.target.value})}
              placeholder={t('reviews.form.reviewPlaceholder') || "Share your experience..."}
              dir={direction}
              disabled={mutation.isPending}
            />
          </div>

          {/* Name & Location (Optional) */}
          <div className="form-row">
            <div className="form-group">
              <label>
                {t('reviews.form.name') || 'Name'}
                <span className="optional-badge">
                  {t('common.optional') || 'Optional'}
                </span>
              </label>
              <input 
                type="text" 
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
                placeholder={t('reviews.form.namePlaceholder') || "Anonymous"}
                dir={direction}
                disabled={mutation.isPending}
              />
            </div>
            
            <div className="form-group">
              <label>
                {t('reviews.form.location') || 'Location'}
                <span className="optional-badge">
                  {t('common.optional') || 'Optional'}
                </span>
              </label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                placeholder={t('reviews.form.locationPlaceholder') || "City"}
                dir={direction}
                disabled={mutation.isPending}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={handleClose}
              disabled={mutation.isPending}
            >
              {t('common.cancel') || 'Cancel'}
            </button>
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={mutation.isPending || !formData.text.trim()}
            >
              {mutation.isPending ? (
                <>
                  <span className="spinner-small"></span>
                  {t('reviews.form.submitting') || 'Submitting...'}
                </>
              ) : (
                <>
                  <Send size={16} />
                  {t('reviews.form.submit') || 'Submit Review'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;