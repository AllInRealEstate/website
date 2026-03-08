import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "./Footer.css";

/******************************
 * 🔥 Memoized SVG Components
 ******************************/
const FacebookIcon = memo(() => (
  <svg className="icon-svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 
      10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 
      1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 
      0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 
      23.027 24 18.062 24 12.073z" />
  </svg>
));

const InstagramIcon = memo(() => (
  <svg className="icon-svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 
      4.85.07 3.252.148 4.771 1.691 
      4.919 4.919.058 1.265.069 
      1.645.069 4.849 0 3.205-.012 
      3.584-.069 4.849-.149 3.225-1.664 
      4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 
      0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 
      0-3.204.013-3.583.07-4.849.149-3.227 
      1.664-4.771 4.919-4.919 1.266-.057 
      1.645-.069 4.849-.069zm0 5.838c-3.403 
      0-6.162 2.759-6.162 
      6.162s2.759 6.163 6.162 
      6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 
      10.162c-2.209 0-4-1.79-4-4 
      0-2.209 1.791-4 4-4s4 1.791 
      4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 
      0-1.441.645-1.441 1.44s.645 
      1.44 1.441 1.44c.795 
      0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
));

const TikTokIcon = memo(() => (
  <svg className="icon-svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 
      1-3.77-4.25V2h-3.45v13.67a2.89 
      2.89 0 0 1-5.2 1.74 2.89 2.89 
      0 0 1 2.31-4.64 2.93 2.93 0 0 
      1 .88.13V9.4a6.84 6.84 0 0 
      0-1-.05A6.33 6.33 0 0 0 5 
      20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 
      8.16 0 0 0 4.77 1.52v-3.4a4.85 
      4.85 0 0 1-1-.1z" />
  </svg>
));

/******************************
 * 🔥 PURE FOOTER COMPONENT
 ******************************/
const Footer = () => {
  const { t, i18n } = useTranslation();

  /******************************************
   * 1️⃣ Memoize Social Links for Performance
   ******************************************/
  const socialLinks = useMemo(
    () => [
      {
        href: "https://www.facebook.com/share/177syYzx3y/?mibextid=wwXIfr",
        aria: "Facebook",
        Icon: FacebookIcon,
      },
      {
        href: "https://www.instagram.com/estateallin?igsh=NHN6aGVybnB5dW9y",
        aria: "Instagram",
        Icon: InstagramIcon,
      },
      {
        href: "https://www.tiktok.com/@estateallin_official?is_from_webapp=1&sender_device=pc",
        aria: "TikTok",
        Icon: TikTokIcon,
      },
    ],
    [i18n.language]
  );

  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        {/* Main Footer (2 Columns) */}
        <div className="footer-main">

          {/* LEFT: Brand */}
          <div className="footer-brand">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="brand-logo"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <img
                src="logo-optimized.png"
                alt="Logo"
                height="48"
                width="auto"
                loading="lazy"
                decoding="async"
                style={{ height: "3rem", width: "auto" }}
              />
              <div>
                <span className="brand-all">ALL</span>
                <span className="brand-in"> IN</span>
              </div>
            </motion.div>

            <p className="brand-tagline">{t("footer.tagline")}</p>
          </div>

          {/* RIGHT: Social Links */}
          <div className="footer-social">
            <h4 className="social-title">{t("Follow Us")}</h4>

            <div className="social-icons">
              {socialLinks.map(({ href, aria, Icon }) => (
                <motion.a
                  key={aria}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  className="social-icon"
                  aria-label={aria}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Footer */}
        <div className="footer-bottom">

          <p className="copyright-text">
            {t("footer.copyright")}
          </p>

          <div className="legal-links">
            <a href="/privacy-policy" className="legal-link">
              {t("footer.links.privacy")}
            </a>
            <a href="/terms-of-use" className="legal-link">
              {t("footer.links.terms")}
            </a>
            <a href="/cookie-policy" className="legal-link">
              {t("footer.links.cookies")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

/*********************************************
 * 🔥 Prevent Useless Re-Renders Automatically
 *********************************************/
export default memo(Footer);
