import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route ,Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from "react-hot-toast";
import { MotionConfig } from "framer-motion";

import WhatsAppWidget from './components/WhatsAppWidget/WhatsAppWidget';


// NEW IMPORT: Error boundary for crash protection
import ErrorBoundary from './components/ErrorBoundary.jsx';

// NEW IMPORT: Accessibility Widget
import AccessibilityWidget from './components/AccessibilityWidget/AccessibilityWidget.jsx';

// NEW IMPORT: Cookie Consent Banner
import CookieConsent from './components/Cookieconsent/Cookieconsent';

// ===============================================
// DYNAMIC IMPORTS: Code Splitting Public Pages
// ===============================================

// Public pages
const Home = lazy(() => import('./pages/home/Home'));
const Projects = lazy(() => import('./pages/projects/Projects'));
const Team = lazy(() => import('./pages/team/team'));
const Courses = lazy(() => import('./pages/courses/courses'));

const PropertiesGallery = lazy(() => import('../src/pages/PropertiesGallery/PropertiesGallery.jsx'));

// Legal pages
const PrivacyPolicy = lazy(() => import('./pages/global/Footer/PrivacyPolicy/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/global/Footer/TermsOfUse/TermsOfUse'));
const CookiePolicy = lazy(() => import('./pages/global/Footer/CookiePolicy/CookiePolicy'));

import { initGA } from "./analytics";

// ===============================================
// FALLBACK: Loading Component (Minimal UI)
// ===============================================
const LoadingFallback = () => (
    <div className="full-screen-loading-overlay" style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#1A1410', color: '#D4AF37', zIndex: 9999
    }}>
        <div className="spinner"></div>
    </div>
);

function App() {
    // ACCESSIBILITY STATE MANAGEMENT
    const [a11ySettings, setA11ySettings] = useState(() => {
        const saved = localStorage.getItem('a11ySettings');
        return saved ? JSON.parse(saved) : {
            fontSize: 'default',
            contrast: false,
            underlineLinks: false,
            textSpacing: false,
            stopAnimations: false
        };
    });

    // NEW: GOOGLE ANALYTICS STATE
    const [gaLoaded, setGaLoaded] = useState(false);

    // APPLY ACCESSIBILITY SETTINGS
    useEffect(() => {
        const root = document.documentElement;

        //  Add classes to html element instead of changing font-size directly
        // Remove all font scaling classes first
        root.classList.remove('a11y-font-medium', 'a11y-font-large');

        // Add appropriate class based on setting
        if (a11ySettings.fontSize === 'medium') {
            root.classList.add('a11y-font-medium');
        } else if (a11ySettings.fontSize === 'large') {
            root.classList.add('a11y-font-large');
        }
        // If 'default', no class is added - original design preserved!

        // High contrast mode
        if (a11ySettings.contrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Underline links
        if (a11ySettings.underlineLinks) {
            root.classList.add('underline-links');
        } else {
            root.classList.remove('underline-links');
        }

        // Text spacing
        if (a11ySettings.textSpacing) {
            root.classList.add('text-spacing');
        } else {
            root.classList.remove('text-spacing');
        }

        // âœ… Stop animations - comprehensive disable
        if (a11ySettings.stopAnimations) {
            root.classList.add('no-animations');

            // âœ… Inject comprehensive CSS to disable ALL animations
            if (!document.getElementById('a11y-motion-override')) {
                const style = document.createElement('style');
                style.id = 'a11y-motion-override';
                style.textContent = `
            /*  Disable ALL animations and transitions */
            .no-animations *,
            .no-animations *::before,
            .no-animations *::after {
                animation-duration: 0.01ms !important;
                animation-delay: 0s !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                transition-delay: 0s !important;
                scroll-behavior: auto !important;
            }
            
            /*  Disable transforms on hover/active states */
            .no-animations *:hover,
            .no-animations *:active,
            .no-animations *:focus {
                transform: none !important;
            }
            
            /*  Force Framer Motion to skip animations */
            .no-animations [data-framer-motion],
            .no-animations [class*="motion"],
            .no-animations [class*="animate"] {
                animation: none !important;
                transition: none !important;
            }
            
            /*  Disable Swiper autoplay visually */
            .no-animations .swiper-wrapper {
                transition-duration: 0ms !important;
            }
        `;
                document.head.appendChild(style);
            }
        } else {
            root.classList.remove('no-animations');
            // Remove the override when animations are re-enabled
            const style = document.getElementById('a11y-motion-override');
            if (style) {
                style.remove();
            }
        }

        // Save to localStorage
        localStorage.setItem('a11ySettings', JSON.stringify(a11ySettings));
    }, [a11ySettings]);

    // NEW: HANDLE COOKIE CONSENT
    const handleAcceptCookies = () => {
        if (!gaLoaded) {
            initGA(); // Load Google Analytics
            setGaLoaded(true);
            console.log('Google Analytics loaded after consent');
        }
    };

    const handleRejectCookies = () => {
        console.log('Google Analytics NOT loaded - user rejected');
        // Do nothing - GA won't load
    };

    // CHECK FOR EXISTING CONSENT ON MOUNT
    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (consent) {
            const consentData = JSON.parse(consent);
            if (consentData.analytics && !gaLoaded) {
                initGA(); // Load GA if previously accepted
                setGaLoaded(true);
            }
        }
    }, [gaLoaded]);

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            {/* NEW: COOKIE CONSENT BANNER - Shows first, before GA loads */}
            <CookieConsent
                onAccept={handleAcceptCookies}
                onReject={handleRejectCookies}
            />

            {/* ACCESSIBILITY WIDGET */}
            <AccessibilityWidget settings={a11ySettings} onChange={setA11ySettings} />

            {/* WHATSAPP WIDGET */}
            <WhatsAppWidget />
            
            {/* This disables Framer Motion animations globally when stopAnimations is true */}
            <MotionConfig reducedMotion={a11ySettings.stopAnimations ? "always" : "never"}>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        {/* 1. Public Layout (The Main Bundle) */}
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Home />} />

                            {/* Crash Protection applied to data-heavy pages: */}
                            <Route path="/projects" element={<ErrorBoundary><Projects /></ErrorBoundary>} />
                            <Route path="/properties-gallery" element={<ErrorBoundary><PropertiesGallery /></ErrorBoundary>} />
                            <Route path="/team" element={<ErrorBoundary><Team /></ErrorBoundary>} />
                            <Route path="/courses" element={<ErrorBoundary><Courses /></ErrorBoundary>} />

                            {/* Legal pages usually don't need protection */}
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-of-use" element={<TermsOfUse />} />
                            <Route path="/cookie-policy" element={<CookiePolicy />} />

                            {/* Catch-all route: Redirect any unknown routes to homepage */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Routes>
                </Suspense>
            </MotionConfig>
        </>
    );
}

export default App;