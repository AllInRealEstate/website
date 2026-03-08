import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useVideoContext } from '../VideoContext';
import './About.css';

const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Separate refs for different sections
  const { ref: storyRef, inView: storyInView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const { ref: teamRef, inView: teamInView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const { ref: buttonRef, inView: buttonInView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const { ref: approachRef, inView: approachInView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const { ref: videoSectionRef, inView: videoSectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <section id="about" className="about-section" ref={videoSectionRef}>
      <div className="about-container">
        {/* Brand Story */}
        <motion.div
          ref={storyRef}
          initial={{ opacity: 0, y: 30 }}
          animate={storyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="about-story"
        >
          <h2 className="about-title">
            {t('about.title')}
          </h2>
          <div className="about-divider" />

          <p className="about-paragraph">
            {t('about.story1')}
          </p>
          <p className="about-paragraph">
            {t('about.story2')}
          </p>
          <p className="about-paragraph">
            {t('about.story3')}
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div
          ref={teamRef}
          initial={{ opacity: 0, y: 30 }}
          animate={teamInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="about-team-section"
        >
          <h3 className="about-team-title">
            {t('about.teamTitle')}
          </h3>

          {/* Fares - Left Circle, Right Text */}
          <div className="team-member team-member-left">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="team-photo-wrapper"
            >
              <div className="team-photo">
                <img
                  src="/fares_final.webp"
                  alt="Fares Jabbour"
                  className="team-photo-image"
                />
              </div>

              {/* License Badge */}
              <div className="license-badge">
               מ.ר. 3245280 
              </div>
            </motion.div>

            <div className="team-info team-info-left">
              <h4 className="team-name">
                {t('about.team.fares.name')}
              </h4>
              <p className="team-title">
                {t('about.team.fares.title')}
              </p>
              <p className="team-quote">
                "{t('about.team.fares.quote')}"
              </p>
              <p className="team-bio">
                {t('about.team.fares.bio')}
              </p>
            </div>
          </div>

          {/* Fares Video */}
          <SmartVideo
            videoSrc="https://xeohooryhdadjcgrnzmt.supabase.co/storage/v1/object/public/website_videos/fares_smooth.mp4"
            isInView={videoSectionInView}
            delay={0.2}
          />

          {/* Ward - Right Circle, Left Text */}
          <div className="team-member team-member-right">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="team-photo-wrapper"
            >
              <div className="team-photo">
                <img
                  src="/ward_final.webp"
                  alt="Ward Jabbour"
                  className="team-photo-image"
                />
              </div>

              {/* License Badge */}
              <div className="license-badge">
                	3216692 .מ.ר
              </div>
            </motion.div>
            <div className="team-info team-info-right">
              <h4 className="team-name">
                {t('about.team.ward.name')}
              </h4>
              <p className="team-title">
                {t('about.team.ward.title')}
              </p>
              <p className="team-quote">
                "{t('about.team.ward.quote')}"
              </p>
              <p className="team-bio">
                {t('about.team.ward.bio')}
              </p>
            </div>
          </div>

          <SmartVideo
            videoSrc="https://xeohooryhdadjcgrnzmt.supabase.co/storage/v1/object/public/website_videos/ward_smooth.mp4"
            isInView={videoSectionInView}
            delay={0.4}
          />

        </motion.div>

        {/* MEET OUR FULL TEAM BUTTON - Option 1 Placement */}
        <motion.div
          ref={buttonRef}
          initial={{ opacity: 0, y: 20 }}
          animate={buttonInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="team-button-wrapper"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="meet-team-button"
            onClick={() => {
              navigate('/team');
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 50);
            }}

          >
            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            {t('about.meetTeamButton') || 'Meet Our Full Team'}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Our Approach - 3 Pillars */}
        <motion.div
          ref={approachRef}
          initial={{ opacity: 0, y: 30 }}
          animate={approachInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="about-approach-title">
            {t('about.approachTitle')}
          </h3>

          <div className="approach-grid">
            {/* Discretion */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="approach-card"
            >
              <div className="approach-icon">🔒</div>
              <h4 className="approach-card-title">
                {t('about.approach.discretion.title')}
              </h4>
              <p className="approach-card-desc">
                {t('about.approach.discretion.desc')}
              </p>
            </motion.div>

            {/* Expertise */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="approach-card"
            >
              <div className="approach-icon">💎</div>
              <h4 className="approach-card-title">
                {t('about.approach.expertise.title')}
              </h4>
              <p className="approach-card-desc">
                {t('about.approach.expertise.desc')}
              </p>
            </motion.div>

            {/* Dedication */}
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="approach-card"
            >
              <div className="approach-icon">🤝</div>
              <h4 className="approach-card-title">
                {t('about.approach.dedication.title')}
              </h4>
              <p className="approach-card-desc">
                {t('about.approach.dedication.desc')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Smart Video Component with Hero video dependency
const SmartVideo = ({ videoSrc, isInView, delay }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [canUnmute, setCanUnmute] = useState(false);
  const { heroVideoReady } = useVideoContext();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(hover: none)');
      setIsTouchDevice(mediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    const enableUnmute = () => {
      setCanUnmute(true);
      sessionStorage.setItem('videoUnmuteEnabled', 'true');
    };

    if (sessionStorage.getItem('videoUnmuteEnabled') === 'true') {
      setCanUnmute(true);
    }

    const events = ['click', 'touchstart', 'keydown', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, enableUnmute, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, enableUnmute);
      });
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Wait for hero video to be ready before loading About videos
    if (isInView && heroVideoReady) {
      video.currentTime = 0;
      video.muted = true;

      const playTimer = setTimeout(() => {
        video.play().catch(error => {
          console.log('Autoplay prevented:', error);
        });
        setHasPlayedOnce(true);
      }, delay * 1000);

      return () => clearTimeout(playTimer);
    } else if (!isInView) {
      video.pause();
      video.currentTime = 0;
      setHasPlayedOnce(false);
      setIsHovered(false);
    }
  }, [isInView, delay, heroVideoReady]);

  const handleMouseEnter = () => {
    if (!canUnmute) return;

    setIsHovered(true);
    const video = videoRef.current;
    if (video && hasPlayedOnce) {
      video.muted = false;
      if (video.paused) {
        video.play().catch(error => {
          console.log('Play on hover failed:', error);
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const video = videoRef.current;
    if (video && hasPlayedOnce) {
      video.muted = true;
      if (video.paused) {
        video.play().catch(error => {
          console.log('Play on leave failed:', error);
        });
      }
    }
  };

  const handleClick = () => {
    if (!isTouchDevice) return;
    if (!hasPlayedOnce) return;
    if (!canUnmute) {
      setCanUnmute(true);
      sessionStorage.setItem('videoUnmuteEnabled', 'true');
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      setIsHovered(true);
      if (video.paused) {
        video.play().catch(() => { });
      }
    } else {
      video.muted = true;
      setIsHovered(false);
      if (video.paused) {
        video.play().catch(() => { });
      }
    }
  };

  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (video && isInView) {
      video.currentTime = 0;
      video.muted = true;
      setIsHovered(false);
      video.play().catch(error => {
        console.log('Restart prevented:', error);
      });
    }
  };

    const posterImage = videoSrc.includes('fares') 
    ? '/fares_poster.webp' 
    : '/ward_poster.webp';


  return (
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="team-video-section"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        className="team-video"
        playsInline
        preload="none"
        poster={posterImage}
        onEnded={handleVideoEnd}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {hasPlayedOnce && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`sound-indicator ${isHovered ? 'unmuted' : 'muted'}`}
        >
          {isHovered ? '🔊' : '🔇'}
        </motion.div>
      )}
    </motion.div>
  );
};

export default About;