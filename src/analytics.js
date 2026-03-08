// Google Analytics - Only loads when user accepts cookies

export const initGA = () => {
  // Check if GA ID is configured
  if (!import.meta.env.VITE_GA_ID) {
    console.warn('Google Analytics ID not configured');
    return;
  }

  // Check if GA is already loaded
  if (window.gtag) {
    console.log('Google Analytics already loaded');
    return;
  }

  console.log('Loading Google Analytics...');

  // Load GA script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', import.meta.env.VITE_GA_ID, {
    'anonymize_ip': true, // GDPR compliance
    'cookie_flags': 'SameSite=None;Secure' // Modern cookie settings
  });

  console.log('Google Analytics loaded successfully');
};

// Optional: Function to track page views manually
export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_ID, {
      page_path: path
    });
  }
};

// Optional: Function to track events manually
export const trackEvent = (category, action, label, value) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};