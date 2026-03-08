// src/pages/properties-gallery/components/ProjectCard.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImageGallery from '../../global/ImageGallery/ImageGallery';
import './ProjectCard.css';

const ProjectCard = ({ project, onViewDetails }) => {
  const { t } = useTranslation();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Get all images
  const getAllImages = () => {
    const rawImages = [
      project.mainImage,
      ...(project.images || [])
    ].filter(img => img && typeof img === 'string' && img.trim() !== '');
    const uniqueImages = [...new Set(rawImages)];
    return uniqueImages.length > 0 ? uniqueImages : ['https://via.placeholder.com/400x300'];
  };

  const images = getAllImages();

  // Format price
  const getFormattedPrice = () => {
    const symbol = project.currency === 'ILS' ? '₪' : project.currency === 'USD' ? '$' : '€';
    if (project.pricePerMonth) {
      return `${symbol}${project.pricePerMonth.toLocaleString()}/mo`;
    }
    if (project.price && project.price > 0) {
      return `${symbol}${project.price.toLocaleString()}`;
    }
    return '--';
  };

  // Get type label
  const getTypeLabel = () => {
    if (project.type === 'forSale') return t('propertiesGallery.filters.typeSale');
    if (project.type === 'forRent') return t('propertiesGallery.filters.typeRent');
    if (project.type === 'sold') return t('propertiesGallery.filters.typeSold');
    return project.type;
  };

  // Handle image click
  const handleImageClick = (e) => {
    e.stopPropagation();
    setIsGalleryOpen(true);
  };

  return (
    <>
      <div className="property-row" onClick={() => onViewDetails(project.id)}>
        {/* Image Column */}
        <div className="property-cell property-image-cell" onClick={handleImageClick}>
          <div className="property-image-container">
            <img src={project.mainImage || 'https://via.placeholder.com/400x300'} alt={project.title} />
            {images.length > 1 && (
              <div className="image-count">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>{images.length}</span>
              </div>
            )}
            {project.badge && (
              <div className="gallery-card-badge">{project.badge}</div>
            )}
          </div>
        </div>

        {/* Title Column */}
        <div className="property-cell property-title-cell">
          <h3 className="property-title">{project.title || t('projectDetails.untitledProperty')}</h3>
        </div>

        {/* Location Column */}
        <div className="property-cell property-location-cell">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{project.location || t('projectDetails.locationNotSpecified')}</span>
        </div>

        {/* Price Column */}
        <div className="property-cell property-price-cell">
          <span className="property-price">{getFormattedPrice()}</span>
        </div>

        {/* Specs Columns (Desktop Only) */}
        <div className="property-cell property-spec-cell desktop-only">
          <span>{project.bedrooms || '-'}</span>
        </div>
        <div className="property-cell property-spec-cell desktop-only">
          <span>{project.bathrooms || '-'}</span>
        </div>
        <div className="property-cell property-spec-cell desktop-only">
          <span>{project.area ? `${project.area}` : '-'}</span>
        </div>

        {/* Type Badge */}
        <div className="property-cell property-type-cell">
          <span className={`property-type-badge ${project.type}`}>{getTypeLabel()}</span>
        </div>

        {/* Action Button */}
        <div className="property-cell property-action-cell">
          <button className="property-action-btn" onClick={(e) => { e.stopPropagation(); onViewDetails(project.id); }}>
            <span>{t('portfolio.viewDetails')}</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {isGalleryOpen && (
        <ImageGallery images={images} initialIndex={0} onClose={() => setIsGalleryOpen(false)} projectTitle={project.title} />
      )}
    </>
  );
};

export default ProjectCard;