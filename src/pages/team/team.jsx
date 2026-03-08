import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query'; // 🆕 NEW IMPORT for caching
import { getWebsiteTeamMembersOptimized } from '../../services/TeamApi';

import './team.css';

const Team = () => {
  const { t, i18n } = useTranslation();
  const rawLang = i18n.language || 'en';
  const lang = rawLang.split('-')[0];

  // 🚀 REACT QUERY: Fetching data with caching, background re-fetching, and auto-loading states
  const {
    data: teamMembers,
    isLoading,
    isError,
    error
  } = useQuery({
    // Unique key based on language guarantees proper caching
    queryKey: ['teamMembers', lang],

    queryFn: () => getWebsiteTeamMembersOptimized(lang),

  });

  console.log("🌍 i18n.language =", i18n.language);


  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const getInitials = (name) => {
    if (!name) return 'TM';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const currentLang = i18n.language;

  // 🚀 OPTIMIZATION: Use isLoading state from React Query
  if (isLoading) {
    return (
      <section className="team-page">
        <div className="team-container">
          <div className="loading-state">
            <div className="spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  // 🚀 STABILITY: Error boundary for data fetch failure
  if (isError) {
    console.error("Team Data Fetch Error:", error);
    return (
      <section className="team-page">
        <div className="team-container">
          <p style={{ color: 'red', textAlign: 'center' }}>
            Error loading team members. Please try again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="team-page">
      <div className="team-container">

        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="team-hero"
        >
          <h2 className="team-page-title">
            {t('team.title') || 'Meet Our Team'}
          </h2>
          <div className="team-divider" />
          <p className="team-page-subtitle">
            {t('team.subtitle') || 'The dedicated professionals behind ALL IN Real Estate'}
          </p>
        </motion.div>


        {/* Dynamic Team List */}
        <div className="team-list">
          {teamMembers.length === 0 ? (
            <p style={{ color: '#C5BDB0', textAlign: 'center' }}>No team members found.</p>
          ) : (
            teamMembers.map((member, index) => {
              return (
                <TeamMemberItem
                  key={member._id || index}
                  member={member}
                  index={index}
                  currentLang={currentLang}
                  getInitials={getInitials}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

const TeamMemberItem = ({ member, index, currentLang, getInitials }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const isRight = index % 2 !== 0;
  const memberClass = isRight ? 'team-member-right' : 'team-member-left';
  const infoClass = isRight ? 'team-info-right' : 'team-info-left';



  const rawLang = currentLang || 'en';
  const lang = rawLang.split('-')[0]; // normalize

  const name = member.name || 'Team Member';
  const title = member.title || member.role || '';
  const quote = member.quote;
  const bio = member.bio;





  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={`team-member ${memberClass}`}
    >
      {/* PHOTO */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className="team-photo-wrapper"
      >
        <div className="team-photo">
          {member.image ? (
            <img
              src={member.image}
              alt={name}
              className="team-photo-image"
              loading="lazy"
              width="256"
              height="256"
            />
          ) : (
            <div className="team-photo-placeholder">
              <span className="team-initial">{getInitials(name)}</span>
            </div>
          )}
        </div>
        {/* LICENSE BADGE */}
        {member.licenseNumber && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: (index * 0.2) + 0.3 }}
            className="license-badge"
          >
            {member.licenseNumber} .מ.ר
          </motion.div>
        )}
      </motion.div>

      {/* INFO */}
      <div className={`team-info ${infoClass}`}>
        <h4 className="team-name">
          {name}
        </h4>

        <p className="team-title">
          {title}
        </p>
        {quote && (
          <p className="team-quote">
            "{quote}"
          </p>
        )}

        {bio && (
          <p className="team-bio">
            {bio}
          </p>
        )}
      </div>
    </motion.div>
  );
};
export default Team;