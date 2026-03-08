// src/pages/properties-gallery/components/EmptyState.jsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion'; // Assuming you have framer-motion installed like other files
import './EmptyState.css';

const EmptyState = ({ onClear }) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      className="empty-state-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="empty-state-content">
        {/* Animated Icon Wrapper */}
        <motion.div 
          className="empty-icon-wrapper"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Custom "Search Home" Icon */}
          <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            <circle cx="16" cy="16" r="6" stroke="#FAF8F3" strokeWidth="3" /> {/* Cutout for glass */}
            <circle cx="16" cy="16" r="4" className="icon-glass" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 19l2 2" className="icon-handle" />
          </svg>
        </motion.div>

        <h3 className="empty-title">{t('propertiesGallery.noResults')}</h3>
        <p className="empty-subtitle">{t('propertiesGallery.adjustFilters')}</p>

        {/* Action Button */}
        {onClear && (
          <motion.button 
            className="empty-reset-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
          >
            {t('propertiesGallery.clear') || 'Clear All Filters'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;