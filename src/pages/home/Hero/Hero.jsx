import { useRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useVideoContext } from '../VideoContext';
import './Hero.css';

const HERO_SUPABASE =
  "https://xeohooryhdadjcgrnzmt.supabase.co/storage/v1/object/public/website_videos/Sl_01_smooth.mp4";

// mobile tiny local version (place in /public)
const HERO_MOBILE_LOCAL = "/Sl_01_Ar-mobile.mp4";

// desktop fallback local version (place in /public)
const HERO_DESKTOP_BACKUP_LOCAL = "/Sl_01_Ar-backup.mp4";

// poster image (place in /public)
const HERO_POSTER = "/hero-poster.webp";


const Hero = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const highResPreloadRef = useRef(null);
  const [useHighRes, setUseHighRes] = useState(false);
  const { setHeroVideoReady } = useVideoContext();

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  }, []);

  const backupSrc = isMobile ? HERO_MOBILE_LOCAL : HERO_DESKTOP_BACKUP_LOCAL;

  useEffect(() => {
    const highResVideo = highResPreloadRef.current;
    if (!highResVideo) return;

    let switched = false;

    const markReady = () => {
      if (switched) return;
      switched = true;
      setUseHighRes(true);
      setHeroVideoReady(true); // Signal that hero HIGH-RES video is ready
    };

    highResVideo.muted = true;
    highResVideo.playsInline = true;
    highResVideo.preload = "auto";

    // Start loading ASAP
    highResVideo.src = HERO_SUPABASE;
    highResVideo.load();

    // When enough data is ready to play smoothly
    highResVideo.addEventListener("canplay", markReady);
    highResVideo.addEventListener("canplaythrough", markReady);

    // Safety fallback: if Supabase is slow but still loading,
    // don't block the UX—just keep backup playing.
    const timeoutId = setTimeout(() => {
      // If it becomes ready later, events will still trigger.
    }, 2500);

    return () => {
      clearTimeout(timeoutId);
      highResVideo.removeEventListener("canplay", markReady);
      highResVideo.removeEventListener("canplaythrough", markReady);
    };
  }, [setHeroVideoReady]);


  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Background Video Layer */}
      <div className="video-container">
        {/* ✅ Visible hero video (starts with backup, upgrades to high-res) */}
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
          key={useHighRes ? "high" : "backup"} // forces a clean swap
        >
          <source
            src={useHighRes ? HERO_SUPABASE : backupSrc}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* ✅ Hidden high-res preloader */}
        <video
          ref={highResPreloadRef}
          style={{ display: "none" }}
          muted
          playsInline
        />

        <div className="video-overlay" />

        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="pattern-overlay"
        />
      </div>


      {/* Content Layer - BRIGHT TEXT on DARK background */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="content-card"
        >
          {/* Logo - BRIGHT on DARK */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-logo-section"
          >
            <div className="hero-logo-text">


              {/* Logo on top */}
              <img
                src="logo-optimized.png"   // <-- replace with your logo path
                alt="Brand Logo"
                style={{
                  height: "4rem",       // matches text height
                  width: "auto"
                }}
              />

              {/* Text below it */}
              <div>
                <span className="logo-all">ALL</span>
                <span className="logo-in"> IN</span>
              </div>

            </div>

            <div className="logo-divider" />
          </motion.div>

          {/* Tagline - WHITE TEXT */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hero-tagline"
          >
            {t('hero.tagline')}
          </motion.h2>

          {/* Subtitle - LIGHT GRAY TEXT */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="hero-subtitle"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Location - GOLD TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="hero-location"
          >
            <svg className="location-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="location-text">{t('hero.location')}</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="hero-buttons"
          >
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-primary"
            >
              {t('hero.cta1')}
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="btn-secondary"
            >
              {t('hero.cta2')}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - GOLD on DARK */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="scroll-indicator"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="scroll-content"
          onClick={() => scrollToSection('about')}
        >
          <span className="scroll-text">
            {t('hero.scroll')}
          </span>
          <svg className="scroll-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;