import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import './Navbar.css';

/***********************
 * 🔥 UTILITY: THROTTLE
 ***********************/
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /********************************************
   * 1️⃣ MEMOIZED NAV ITEMS (Prevent Rerenders)
   ********************************************/
  const navItems = useMemo(
    () => [
      { id: 'home', label: t('nav.home'), href: '#home' },
      { id: 'about', label: t('nav.about'), href: '#about' },
      { id: 'portfolio', label: t('nav.portfolio'), href: '#portfolio' },
      { id: 'services', label: t('nav.services'), href: '#services' },
      // 🟢 UPDATED: Changed testimonials to reviews
      { id: 'reviews', label: t('nav.testimonials'), href: '#reviews' }, 
      { id: 'contact', label: t('nav.contact'), href: '#contact' }
    ],
    [i18n.language]
  );

  /*******************************************************
   * 2️⃣ THROTTLED SCROLL HANDLER (Huge Performance Boost)
   *******************************************************/
  const handleScroll = useCallback(
    throttle(() => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);

      if (location.pathname === '/' || location.pathname === '') {
        // 🟢 UPDATED: Changed testimonials to reviews here too
        const sections = ['home', 'about', 'portfolio', 'services', 'reviews', 'contact'];

        for (let section of sections) {
          const el = document.getElementById(section);
          if (!el) continue;

          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    }, 120),
    [location.pathname]
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /********************************************
   * 3️⃣ BODY SCROLL FREEZE ON MOBILE MENU OPEN
   ********************************************/
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  /******************************************************
   * 4️⃣ CROSS-PAGE SCROLL BEHAVIOR (Cleaner + Faster)
   ******************************************************/
  useEffect(() => {
    const path = location.pathname;

    if (path.includes('team')) setActiveSection('about');
    else if (path.includes('projects')) setActiveSection('portfolio');
    else if (path.includes('courses')) setActiveSection('services');

    if (location.state?.scrollTo) {
      requestAnimationFrame(() => {
        const target = document.getElementById(location.state.scrollTo);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(location.state.scrollTo);
        }
        window.history.replaceState({}, document.title);
      });
    }
  }, [location]);

  /**********************************************
   * 5️⃣ HANDLE NAVIGATION CLICKS
   **********************************************/
  const handleNavClick = (id) => {
    const onHome = location.pathname === '/' || location.pathname === '';

    setIsMobileMenuOpen(false);

    if (onHome) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  /**********************************************
   * 6️⃣ LOGO CLICK HANDLER
   **********************************************/
  const handleLogoClick = () => {
    const onHome = location.pathname === '/' || location.pathname === '';

    setIsMobileMenuOpen(false);

    if (onHome) window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate('/');
  };

  /**********************************************
   * 7️⃣ RENDER NAVBAR
   **********************************************/
  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container" dir="ltr">

          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="navbar-logo"
            onClick={handleLogoClick}
          >
            <img
              src="/logo-optimized.png"
              alt="ALL IN Logo"
              className="navbar-logo-image"
              loading="lazy"
              decoding="async"
            />
            <div className="navbar-logo-text" dir="ltr">
              <span className="logo-all">ALL</span>
              <span className="logo-in">IN</span>
            </div>
          </motion.div>

          {/* DESKTOP NAV */}
          <div className="navbar-items">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="navbar-item-wrapper"
              >
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`navbar-item ${activeSection === item.id ? 'navbar-item-active' : ''}`}
                >
                  {item.label}
                </button>

                {activeSection === item.id && (
                  <motion.div
                    layoutId="underline"
                    className="navbar-underline"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="navbar-right">
            <LanguageSwitcher />

            {/* MOBILE MENU TOGGLE */}
            <button
              className="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              <div className={`hamburger ${isMobileMenuOpen ? 'hamburger-open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mobile-menu-backdrop"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* MENU SLIDE-IN */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="mobile-menu"
            >
              {/* HEADER */}
              <div className="mobile-menu-header">
                <div className="mobile-menu-logo" onClick={handleLogoClick}>
                  <img
                    src="/logo-optimized.png"
                    alt="ALL IN Logo"
                    className="mobile-menu-logo-image"
                    loading="lazy"
                  />
                  <div className="mobile-menu-logo-text">
                    <span className="logo-all">ALL</span>
                    <span className="logo-in">IN</span>
                  </div>
                </div>

                <button
                  className="mobile-menu-close"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>

              {/* ITEMS */}
              <div className="mobile-menu-items">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`mobile-menu-item ${
                      activeSection === item.id && location.pathname === '/' ? 'mobile-menu-item-active' : ''
                    }`}
                  >
                    <span>{item.label}</span>

                    {activeSection === item.id && (
                      <motion.div
                        layoutId="mobile-indicator"
                        className="mobile-menu-indicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* FOOTER */}
              <div className="mobile-menu-footer">
                <p className="mobile-menu-footer-text">{t('hero.tagline')}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;