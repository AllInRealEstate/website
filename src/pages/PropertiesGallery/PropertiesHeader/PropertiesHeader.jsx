// src/pages/properties-gallery/components/PropertiesHeader.jsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './PropertiesHeader.css';

const PropertiesHeader = () => {
  const { t } = useTranslation();

  return (
    <section className="properties-header">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="properties-header-title"
      >
        {t('propertiesGallery.title')}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="properties-header-divider"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="properties-header-subtitle"
      >
        {t('propertiesGallery.subtitle')}
      </motion.p>
    </section>
  );
};

export default PropertiesHeader;