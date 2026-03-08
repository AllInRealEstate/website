import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // ← ADD THIS
import './Cookieconsent.css';

function CookieConsent({ onAccept, onReject }) {
    const { t, i18n } = useTranslation(); // ← ADD THIS
    const [isVisible, setIsVisible] = useState(false);
    
    // Determine text direction based on language
    const isRtl = ['he', 'ar'].includes(i18n.language);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        } else {
            const consentData = JSON.parse(consent);
            if (consentData.analytics) {
                onAccept();
            } else {
                onReject();
            }
        }
    }, [onAccept, onReject]);

    const handleAccept = () => {
        const consent = {
            analytics: true,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        localStorage.setItem('cookie_consent', JSON.stringify(consent));
        setIsVisible(false);
        onAccept();
    };

    const handleReject = () => {
        const consent = {
            analytics: false,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        localStorage.setItem('cookie_consent', JSON.stringify(consent));
        setIsVisible(false);
        onReject();
    };

    if (!isVisible) return null;

    return (
        <>
            <div className="cookie-backdrop" />
            
            <div 
                className="cookie-consent-banner" 
                role="dialog" 
                aria-label={t('cookieBanner.title')}
                dir={isRtl ? 'rtl' : 'ltr'} // ← Handle direction
            >
                <div className="cookie-content">
                    <div className="cookie-icon">🍪</div>
                    
                    <div className="cookie-text">
                        <h3>{t('cookieBanner.title')}</h3>
                        <p>
                            {t('cookieBanner.description')}
                        </p>
                        <p className="cookie-details">
                            {t('cookieBanner.details')}
                        </p>
                    </div>

                    <div className="cookie-buttons">
                        <button 
                            className="cookie-btn cookie-btn-accept" 
                            onClick={handleAccept}
                        >
                            {t('cookieBanner.accept')}
                        </button>
                        <button 
                            className="cookie-btn cookie-btn-reject" 
                            onClick={handleReject}
                        >
                            {t('cookieBanner.reject')}
                        </button>
                    </div>

                    <div className="cookie-links">
                        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                            {t('cookieBanner.privacy')}
                        </a>
                        <span className="cookie-separator">•</span>
                        <a href="/cookie-policy" target="_blank" rel="noopener noreferrer">
                            {t('cookieBanner.cookies')}
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CookieConsent;