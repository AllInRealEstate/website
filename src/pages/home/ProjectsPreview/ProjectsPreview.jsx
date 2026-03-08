// src/components/ProjectsPreview.jsx (based on your old Portfolio.jsx)
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './ProjectsPreview.css';
import { getWebsiteFeaturedProjectsOptimized } from '../../../services/ProjectsPreviewApi.js';

// Helper: map lean backend project → UI object
const mapProjectToCard = (project, lang) => {
  const baseLang = (lang || 'en').split('-')[0].toLowerCase();
  const translations = project.translations || {};
  const tData = translations[baseLang] || translations.en || {};

  const price = project.pricePerMonth
    ? `₪${project.pricePerMonth.toLocaleString()}/mo`
    : project.price && project.price > 0
      ? `₪${(project.price / 1000000).toFixed(1)}M`
      : '--';

  return {
    id: project._id,
    title: tData.title || '',
    location: tData.location || '',
    price,
    category: project.type,
    badge: project.badge?.toUpperCase() || null,
    image: project.mainImage || 'https://via.placeholder.com/800x600',
    featured: project.featured
  };
};

const Portfolio = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  // 🔥 Optimized data fetch with React Query + lean backend
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['featuredProjects', i18n.language],
    queryFn: () => getWebsiteFeaturedProjectsOptimized(i18n.language),
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  });

  // Normalize data shape (defensive, in case API wraps it)
  const rawProjects = Array.isArray(data)
    ? data
    : data?.data || data?.projects || [];

  // 1) Map projects into card objects (title/location via translations)
  const allCards = rawProjects.map(project =>
    mapProjectToCard(project, i18n.language)
  );

  // 2) Apply filter on type (forSale, forRent, etc.) like before
  const filteredProperties = allCards.filter(property => {
    if (activeFilter === 'all') return true;
    return property.category === activeFilter;
  });

  // Artificial Loop
  // Duplicate list until we have enough items (16+) for a smooth infinite loop
  let loopableProperties = [...filteredProperties];
  const MIN_SLIDES_FOR_LOOP = 16;

  if (loopableProperties.length > 0) {
    while (loopableProperties.length < MIN_SLIDES_FOR_LOOP) {
      loopableProperties = [...loopableProperties, ...filteredProperties];
    }
  }

  const filters = [
    { id: 'all', label: t('portfolio.filters.all') },
    { id: 'forSale', label: t('portfolio.filters.forSale') },
    { id: 'forRent', label: t('portfolio.filters.forRent') },
    { id: 'sold', label: t('portfolio.filters.sold') }
  ];

  // Navigate to specific project with ID
  const handleViewDetails = (projectId) => {
    // 1. Force the current window to top immediately (visual reset)
    window.scrollTo(0, 0);

    // 2. Navigate with state
    navigate(`/projects?id=${projectId}`, {
      state: {
        scrollToId: projectId,
        fromPreview: true // Flag to tell the next page we came from here
      }
    });
  };

  // Navigate to projects page and scroll to title
  const handleViewAllProperties = () => {
    navigate('/properties-gallery');
    window.scrollTo(0, 0);
  };

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="portfolio-header"
        >
          <h2 className="portfolio-title">
            {t('portfolio.title')}
          </h2>
          <div className="portfolio-divider" />
        </motion.div>

        {/* Filter Tabs & Mobile Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="portfolio-filters"
        >
          {/* 1. Desktop View: Buttons (Hidden on mobile via CSS) */}
          {filters.map((filter) => (
            <div key={filter.id} className="filter-wrapper">
              <button
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
              >
                <span>{filter.label}</span>
                {activeFilter === filter.id && (
                  <motion.div
                    layoutId="activeFilter"
                    className="filter-active-bg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>
          ))}
          {/* 2. Mobile View: Dropdown (Hidden on desktop via CSS) */}
          <select
            className="mobile-filter-select"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            {filters.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Loading State (same UI, wired to isLoading) */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="portfolio-loading"
            style={{ textAlign: 'center', padding: '4rem', color: '#d4af37' }}
          >
            <div className="spinner" style={{
              border: '3px solid rgba(212, 175, 55, 0.1)',
              borderTop: '3px solid #d4af37',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p>Loading properties...</p>
          </motion.div>
        )}

        {/* Error State (same UI, wired to isError) */}
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="portfolio-error"
            style={{ textAlign: 'center', padding: '4rem', color: '#ff6b6b' }}
          >
            <p>Failed to load properties. Please try again later.</p>
            {error?.message && <p style={{ opacity: 0.8 }}>{error.message}</p>}
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1.5rem',
                background: '#d4af37',
                border: 'none',
                color: '#0a0a0a',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Property Carousel */}
        {!isLoading && !isError && filteredProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="portfolio-carousel"
          >
            <Swiper
              key={`${activeFilter}-${i18n.language}`}
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              speed={1000}
              pagination={{
                clickable: true,
                bulletActiveClass: 'swiper-pagination-bullet-active-gold'
              }}
              navigation={true}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
                1280: { slidesPerView: 4, spaceBetween: 30 }
              }}
              className="properties-swiper"
            >
              {loopableProperties.map((property, index) => (
                <SwiperSlide key={`${property.id}-${index}`}>
                  <div
                    className="property-card"
                    onMouseEnter={() => setHoveredCard(property.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    // Mobile double-tap logic preserved
                    onClick={(e) => {
                      if (hoveredCard === property.id) {
                        handleViewDetails(property.id);
                      } else {
                        setHoveredCard(property.id);
                      }
                    }}
                  >
                    {/* Image Container */}
                    <div className="property-image-wrapper">
                      <motion.img
                        animate={{
                          scale: hoveredCard === property.id ? 1.1 : 1
                        }}
                        transition={{ duration: 0.6 }}
                        src={property.image}
                        alt={property.title}
                        className="property-image"
                      />

                      {/* Badge */}
                      {property.badge && (
                        <div className="property-badge">
                          {t(`portfolio.badges.${property.badge.toLowerCase()}`)}
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <AnimatePresence>
                        {hoveredCard === property.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="property-overlay"
                          >
                            <button
                              className="property-view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(property.id);
                              }}
                            >
                              {t('portfolio.viewDetails')}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Property Info */}
                    <motion.div
                      animate={{
                        y: hoveredCard === property.id ? -5 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="property-info"
                    >
                      <h3 className="property-title">
                        {property.title}
                      </h3>
                      <div className="property-location">
                        <svg className="location-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{property.location}</span>
                      </div>
                      <p className="property-price">
                        {property.price}
                      </p>
                    </motion.div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '4rem', color: '#888' }}
          >
            <p>No properties found in this category.</p>
          </motion.div>
        )}
        {/* View All Projects Button */}
        {!isLoading && !isError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ textAlign: 'center', marginTop: '3rem' }}
          >
            <button
              onClick={handleViewAllProperties}
              className="view-all-projects-btn"
            >
              <span>{t('portfolio.viewAllProperties')}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
