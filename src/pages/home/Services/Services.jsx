
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import './Services.css';
import { useQuery } from '@tanstack/react-query';
import { getPublicServices } from '../../../services/ServicesApi.js';
import FeaturedCourse from './FeaturedCourse/FeaturedCourse';

const Services = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [hoveredCard, setHoveredCard] = useState(null);

  // ==================================
  // React Query fetch
  // ==================================
  const {
    data: services = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['public-services', i18n.language],
    queryFn: () => getPublicServices(i18n.language),
    staleTime: 1000 * 60 * 5, // 5 min caching
  });

  return (
    <section id="services" className="services-section">
      <div className="services-container">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="services-header"
        >
          <h2 className="services-title">{t('services.title')}</h2>
          <p className="services-subtitle">{t('services.subtitle')}</p>
          <div className="services-divider" />
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#d4af37' }}>
            <div className="spinner"
              style={{
                border: '3px solid rgba(212,175,55,0.1)',
                borderTop: '3px solid #d4af37',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}
            />
            <p>Loading services...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#ff6b6b' }}>
            <p>Failed to load services. Please try again later.</p>
          </div>
        )}

        {/* Cards */}
        {!isLoading && !isError && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="services-grid"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  onMouseEnter={() => setHoveredCard(service.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="service-card"
                  role="presentation"
                >

                  {/* Image */}
                  <div className="service-image-wrapper">
                    <motion.img
                      animate={{
                        scale: hoveredCard === service.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.6 }}
                      src={service.icon}
                      alt={service.title}
                      className="service-image"
                    />

                    {/* Hover Overlay */}
                    <AnimatePresence>
                      {hoveredCard === service.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="service-overlay"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Info */}
                  <motion.div
                    animate={{ y: hoveredCard === service.id ? -5 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="service-info"
                  >
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-desc">{service.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Education Section Divider */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="education-divider"
            >
              <h2 className="education-title">{t('services.educationTitle')}</h2>
              <div className="education-divider-line" />
              <p className="education-subtitle">{t('services.educationSubtitle')}</p>
            </motion.div>

            {/* Featured Course Component */}
            <FeaturedCourse />
          </>
        )}

      </div>
    </section>
  );
};

export default Services;
