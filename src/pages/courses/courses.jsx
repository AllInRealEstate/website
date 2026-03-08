import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import './Courses.css';
import { useNavigate } from 'react-router-dom';

import { getWebsiteCourses } from '../../services/CoursesApi';

const Courses = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();;

  // Header animation
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  // 🔁 React Query - fetch public website courses
  const {
    data: courses = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['websiteCourses', i18n.language],
    queryFn: () => getWebsiteCourses(i18n.language),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    cacheTime: 1000 * 60 * 10 // 10 minutes in cache
  });

  return (
    <section className="courses-page">
      <div className="courses-container">

        {/* Header Section */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="courses-header"
        >
          <h1 className="courses-title">
            {t('courses.title') || 'Educational Courses'}
          </h1>
          <div className="courses-divider" />
          <p className="courses-subtitle">
            {t('courses.subtitle') ||
              'Expand your real estate knowledge with our expert-led masterclasses.'}
          </p>
        </motion.div>

        {/* Content Section */}
        {isLoading ? (
          // 🌀 Loading state (same design)
          <div className="courses-loading">
            <div className="spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : isError ? (
          // ❌ Error state – safe fallback
          <motion.div
            className="courses-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="empty-state-card">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10v6M12 2l8.5 5-8.5 5-8.5-5L12 2z" />
                <path d="M2 10l10 5 10-5" />
                <path d="M12 22V17" />
              </svg>
              <h3>Unable to load courses</h3>
              <p>
                {error?.message ||
                  'There was a problem loading the courses. Please try again later.'}
              </p>
            </div>
          </motion.div>
        ) : courses.length > 0 ? (
          // ✅ Courses grid (unchanged design)
          <motion.div
            className="courses-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                className="course-card-public"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                {/* Course Image */}
                <div className="course-image-wrapper">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="course-image"
                  />
                  {/* Badge Logic: Show 'Free' if 0, Actual Price if > 0. Hidden otherwise. */}

                </div>

                {/* Course Information */}
                <div className="course-info">
                  {/* Meta Information */}
                  <div className="course-meta">
                    <span className="course-level">{course.level}</span>
                    <span className="course-duration">
                      <svg
                        width="16"
                        height="16"
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
                      {course.duration}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="course-title-text">{course.title}</h3>

                  {/* Description */}
                  <p className="course-description">{course.description}</p>

                  {/* Footer - Instructor & Price */}
                  <div className="course-footer">
                    <span className="course-instructor">
                      {course.instructor}
                    </span>
                    {course.price > 0 && (
                      <span className="course-price">
                        {course.currency}
                        {course.price}
                      </span>
                    )}
                  </div>

                  {/* Contact Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="course-contact-btn"
                    onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
                  >
                    {t('courses.contactUs')}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // 🕊 Empty state (same design)
          <motion.div
            className="courses-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="empty-state-card">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10v6M12 2l8.5 5-8.5 5-8.5-5L12 2z" />
                <path d="M2 10l10 5 10-5" />
                <path d="M12 22V17" />
              </svg>
              <h3>New Content Coming Soon</h3>
              <p>
                We are currently curating exclusive real estate masterclasses
                for you. Stay tuned.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Courses;
