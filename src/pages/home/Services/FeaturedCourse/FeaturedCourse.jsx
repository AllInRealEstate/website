import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getWebsiteCourses } from '../../../../services/CoursesApi';
import './FeaturedCourse.css';

const FeaturedCourse = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  // Fetch courses using TanStack Query
  const {
    data: courses = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['websiteCourses', i18n.language],
    queryFn: () => getWebsiteCourses(i18n.language),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Extract featured course (first in array)
  const featuredCourse = courses[0] || null;

  // Navigation handlers
  const handleViewCourse = () => {
    navigate('/courses');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleContact = () => {
    navigate('/', { state: { scrollTo: 'contact' } })

  };

  // Loading state
  if (isLoading) {
    return (
      <div className="featured-course-section">
        <div className="featured-loading">
          <div className="featured-spinner" />
          <p>{t('services.featuredCourse.loading')}</p>
        </div>
      </div>
    );
  }

  // Error or no courses - silent fallback
  if (isError || !featuredCourse) {
    return null; // Don't show anything if error or no courses
  }

  return (
    <section className="featured-course-section">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="featured-course-container"
      >
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
          className="featured-course-card"
        >
          {/* Image Section */}
          <div className="featured-image-wrapper">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={featuredCourse.image}
              alt={featuredCourse.title}
              className="featured-image"
              loading="lazy"
            />
            {/* Featured Badge */}
            <div className="featured-badge">
              {t('services.featuredCourse.badge')}
            </div>
          </div>

          {/* Content Section */}
          <div className="featured-content">
            <h3 className="featured-title">{featuredCourse.title}</h3>
            <p className="featured-description">{featuredCourse.description}</p>

            {/* Meta Info */}
            <div className="featured-meta">
              <span className="featured-meta-item">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {featuredCourse.duration}
              </span>
              <span className="featured-meta-item">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                {featuredCourse.level}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="featured-cta-wrapper">
              {/* Primary Button */}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="featured-btn-primary"
                onClick={handleContact}
              >
                {t('services.featuredCourse.contactUs')}
              </motion.button>


              {/* Secondary Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="featured-btn-secondary"
                onClick={handleViewCourse}
              >
                {t('services.featuredCourse.viewDetails')}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturedCourse;