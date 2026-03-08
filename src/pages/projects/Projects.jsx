// src/pages/Projects.jsx
import { useState, useEffect, useLayoutEffect } from 'react'; import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Projects.css';

import { getActiveProjectsOptimized } from '../../services/ProjectsPageApi';
import ProjectDetails from './ProjectDetails/ProjectDetails';
import GoogleMap from './ProjectMap/GoogleMap';

const Projects = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mapView, setMapView] = useState('details');

  const [isChildGalleryOpen, setIsChildGalleryOpen] = useState(false);

  // React Query
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching
  } = useQuery({
    queryKey: ['websiteProjects', i18n.language, activeFilter],
    queryFn: () =>
      getActiveProjectsOptimized({
        lang: i18n.language,
        type: activeFilter
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5
  });

  const loading = isLoading || isFetching;
  const errorMessage =
    (isError && (error?.message || 'Failed to load properties. Please try again later.')) ||
    null;

  const getTranslatedField = (project, field) => {
    const currentLang = i18n.language || 'en';
    if (project?.translations && project.translations[currentLang]) {
      return project.translations[currentLang][field];
    }
    return project?.[field];
  };

  useEffect(() => {
    if (!data || !data.projects) return;
    setProjects(data.projects);

    const projectIdFromUrl = searchParams.get('id');
    if (projectIdFromUrl) {
      const projectFromUrl = data.projects.find(p => p.id === projectIdFromUrl);
      if (projectFromUrl) {
        setSelectedProject(projectFromUrl);
      } else if (!selectedProject && data.projects.length > 0) {
        setSelectedProject(data.projects[0]);
      }
    } else {
      if (data.projects.length > 0 && !selectedProject) {
        setSelectedProject(data.projects[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchParams]);

  // Scroll to Details Logic
  // Scroll to Details Logic - OPTIMIZED

  // EFFECT 1: "Nuclear" Scroll Reset (Fixes "Enter from Down" issue)
  useLayoutEffect(() => {
    // 1. Temporarily disable ALL smooth scrolling on the HTML element.
    // This prevents the browser from "animating" the scroll from bottom to top.
    document.documentElement.style.scrollBehavior = 'auto';

    // 2. Kill browser scroll memory
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 3. INSTANTLY jump to top (User won't see the travel)
    window.scrollTo(0, 0);

    // 4. Re-enable smooth scrolling after a tiny delay (so the "Glide" works later)
    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = ''; // Revert to CSS default
    }, 100);

    return () => {
      clearTimeout(timer);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // EFFECT 2: The Delayed "Luxury Glide"
  useEffect(() => {
    const projectIdFromUrl = searchParams.get('id');

    if (projectIdFromUrl && !loading && selectedProject && selectedProject.id === projectIdFromUrl) {

      // We wait 1.2s for the entrance animations to settle.
      const timer = setTimeout(() => {
        const detailsElement = document.getElementById('project-details');

        if (detailsElement) {
          const headerOffset = 80;
          const elementPosition = detailsElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          // Now we can smoothly scroll down because we re-enabled smooth scrolling in Effect 1
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [selectedProject, loading, searchParams]);

  useEffect(() => {
    if (projects.length > 0 && !projects.find(p => p.id === selectedProject?.id)) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const filters = [
    { value: 'all', label: t('projects.filters.all') },
    { value: 'forSale', label: t('projects.filters.forSale') },
    { value: 'forRent', label: t('projects.filters.forRent') },
    { value: 'sold', label: t('projects.filters.sold') }
  ];

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('project-details')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  return (
    <div className="projects-page-wrapper">
      {/* 1. WRAPPER DIV: This aligns the button with the page content */}
      {!isChildGalleryOpen && (
        <div className="projects-nav-wrapper">
          <button
            className="projects-back-btn"
            onClick={() => {
              navigate('/properties-gallery')
              window.scrollTo(0, 0);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>{t('propertiesGallery.backToGallery') || 'Back to Gallery'}</span>
          </button>
        </div>
      )}
      <div className="projects-page">

        <section id="title" className="projects-hero">

          <div className="projects-hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="projects-hero-title"
            >
              {selectedProject
                ? getTranslatedField(selectedProject, 'title')
                : t('projects.title')}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="projects-hero-divider"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="projects-hero-subtitle"
            >
              {selectedProject
                ? (
                  <span className="hero-location-flex">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" style={{ color: '#D4AF37' }}>
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {getTranslatedField(selectedProject, 'location')}
                  </span>
                )
                : t('projects.subtitle') || 'Explore our collection'}
            </motion.p>
          </div>
        </section>

        <div className="projects-container">

          {/* Section 1: Filter Menu */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="projects-filters-section"
          >
            <div className="projects-filters-desktop">
              {filters.map((filter) => (
                <div key={filter.value} className="projects-filter-wrapper">
                  <button
                    onClick={() => setActiveFilter(filter.value)}
                    className={`projects-filter-btn ${activeFilter === filter.value ? 'active' : ''}`}
                  >
                    {filter.label}
                    {activeFilter === filter.value && (
                      <motion.div
                        layoutId="activeProjectFilter"
                        className="projects-filter-active-bg"
                      />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="projects-filters-mobile">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="projects-filter-select"
              >
                {filters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="projects-loading">
              <div className="spinner" />
              <p>{t('projects.loading')}</p>
            </div>
          )}

          {/* Error State */}
          {errorMessage && !loading && (
            <div className="projects-error">
              <p>{t('projects.error')}</p>
              <button onClick={() => window.location.reload()}>
                {t('projects.retry') || 'Retry'}
              </button>
            </div>
          )}

          {/* Section 2: Carousel */}
          {!loading && !errorMessage && projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="projects-carousel-section"
            >
              <Swiper
                key={`${activeFilter}-${i18n.language}-${i18n.dir()}`}
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true
                }}
                speed={600}
                pagination={{
                  clickable: true,
                  bulletActiveClass: 'swiper-pagination-bullet-active-gold'
                }}
                navigation={true}
                loop={projects.length > 3}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 15 },
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 3, spaceBetween: 25 },
                  1280: { slidesPerView: 4, spaceBetween: 30 }
                }}
                className="projects-swiper"
              >
                {projects?.map((project) => (
                  <SwiperSlide key={project.id}>
                    <div
                      className={`projects-card ${selectedProject?.id === project.id ? 'selected' : ''
                        }`}
                      onClick={() => handleProjectSelect(project)}
                    >
                      <div className="projects-card-image-wrapper">
                        <img
                          src={
                            project.mainImage ||
                            project.images?.[0] ||
                            'https://via.placeholder.com/400x300'
                          }
                          alt={getTranslatedField(project, 'title')}
                          className="projects-card-image"
                        />
                        {project.badge && (
                          <div className="projects-card-badge">
                            {project.badge.toUpperCase()}
                          </div>
                        )}
                        {selectedProject?.id === project.id && (
                          <div className="projects-card-selected-indicator">
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="white">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="projects-card-info">
                        <h3 className="projects-card-title">
                          {getTranslatedField(project, 'title')}
                        </h3>
                        <p className="projects-card-location">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {getTranslatedField(project, 'location')}
                        </p>
                        {(project.price > 0 || project.pricePerMonth > 0) && (
                          <p className="projects-card-price">
                            {project.currency === 'ILS'
                              ? '₪'
                              : project.currency === 'USD'
                                ? '$'
                                : '€'}
                            {project.pricePerMonth
                              ? `${project.pricePerMonth.toLocaleString()}/mo`
                              : project.price?.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          )}

          {/* Section 3: Map + Details */}
          {!loading && !errorMessage && projects.length > 0 && selectedProject && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="projects-details-section"
            >
              <div className="projects-toggle-tabs">
                <button
                  className={`projects-toggle-btn ${mapView === 'map' ? 'active' : ''}`}
                  onClick={() => setMapView('map')}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t('projects.toggles.map')}
                </button>
                <button
                  className={`projects-toggle-btn ${mapView === 'details' ? 'active' : ''}`}
                  onClick={() => setMapView('details')}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t('projects.toggles.details')}
                </button>
              </div>

              <div className="projects-details-grid">
                <div
                  className={`projects-map-column ${mapView === 'map' ? 'visible' : ''}`}
                >
                  <div className="map-container">
                    <GoogleMap
                      projects={projects}
                      selectedProjectId={selectedProject?.id}
                      onMarkerClick={setSelectedProject}
                    />
                    <div className="map-info-overlay">
                      <p className="map-location-text">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {selectedProject
                          ? getTranslatedField(selectedProject, 'location')
                          : t('projects.selectPropertyOnMap')}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  id="project-details"
                  className={`projects-details-column ${mapView === 'details' ? 'visible' : ''}`}
                >
                  <ProjectDetails
                    project={selectedProject}
                    onGalleryToggle={setIsChildGalleryOpen}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {!loading && !errorMessage && projects.length === 0 && (
            <div className="projects-empty">
              <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" opacity="0.3">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <h3>{t('projects.noProperties')}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;