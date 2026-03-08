import { useState } from 'react';
// 👇 FIXED: Added 'Trans' to the import
import { useTranslation, Trans } from 'react-i18next'; 
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import './Contact.css';
import { submitLead } from '../../../services/ContactApi';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
    botField: '',
    privacyConsent: false
  });

  const validateForm = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(formData.email)) return t('contact.validation.invalidEmail');
    if (formData.phone.length < 6) return t('contact.validation.invalidPhone');
    if (!formData.interest) return t('contact.validation.interestRequired');
    
    // ✅ Privacy consent validation
    if (!formData.privacyConsent) {
      // Make sure this key exists in your JSON (see step 2 below)
      return t('contact.validation.privacyRequired'); 
    }

    return null;
  };

  const mutation = useMutation({
    mutationFn: submitLead,
    onSuccess: () => {
      toast.success(t('contact.form.successToast'));

      setFormData({
        name: '',
        email: '',
        phone: '',
        interest: '',
        message: '',
        botField: '',
        privacyConsent: false
      });
    },
    onError: (err) => {
      toast.error(err.message || t('contact.form.errorToast'));
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.botField !== '') {
      return;
    }

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    const leadData = {
      fullName: formData.name || "",
      email: formData.email,
      phoneNumber: formData.phone,
      inquiryType: formData.interest,
      message: formData.message || "",
      source: "Website Contact Form",
      lang: i18n.language
    };

    mutation.mutate(leadData);
  };

  const isSubmitting = mutation.isPending;

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="contact-header"
        >
          <h2 className="contact-title">{t('contact.title')}</h2>
          <p className="contact-subtitle">{t('contact.subtitle')}</p>
          <div className="contact-divider" />
        </motion.div>

        <div className="contact-layout">

          {/* LEFT INFO */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="info-card side-card"
          >
            <h3 className="info-card-title">{t('contact.info.title')}</h3>
            <div className="info-items">
              <div className="info-item">
                <svg className="info-icon" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="info-text">{t('contact.info.address')}</p>
              </div>
              <div className="info-item">
                <svg className="info-icon" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <p className="info-text">{t('contact.info.phone')}</p>
              </div>
              <div className="info-item">
                <svg className="info-icon" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                </svg>
                <p className="info-text">{t('contact.info.email')}</p>
              </div>
            </div>
          </motion.div>

          {/* CENTER FORM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="contact-form-wrapper"
          >
            <form onSubmit={handleSubmit} className="contact-form">

              <input
                type="text"
                name="botField"
                value={formData.botField}
                onChange={handleChange}
                style={{ display: "none" }}
              />

              <input
                type="text"
                name="name"
                placeholder={t('contact.form.name')}
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />

              <input
                type="email"
                name="email"
                placeholder={t('contact.form.email')}
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />

              <input
                type="tel"
                name="phone"
                placeholder={t('contact.form.phone')}
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
              />

              <div className="select-wrapper">
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="" disabled>{t('contact.form.interest')}</option>
                  <option value="buying">{t('contact.form.interestOptions.buying')}</option>
                  <option value="selling">{t('contact.form.interestOptions.selling')}</option>
                  <option value="renting">{t('contact.form.interestOptions.renting')}</option>
                  <option value="land">{t('contact.form.interestOptions.land')}</option>
                  <option value="consulting">{t('contact.form.interestOptions.consulting')}</option>
                </select>
                <svg className="select-arrow" viewBox="0 0 24 24">
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>

              <textarea
                name="message"
                placeholder={t('contact.form.message')}
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="form-textarea"
              />

              {/* PRIVACY CONSENT CHECKBOX */}
              <div className="privacy-consent-wrapper">
                <label className="privacy-consent-label">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={handleChange}
                    className="privacy-checkbox"
                    required
                  />
                  <span className="privacy-text">
                    <Trans i18nKey="common.privacyConsent">
                      I have read and agree to the{' '}
                      <a 
                        href="/privacy-policy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="privacy-link"
                      >
                        Privacy Policy
                      </a>
                      {' '}and consent to the storage and processing of my personal information.
                    </Trans>
                    <span className="required-asterisk"> *</span>
                  </span>
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`form-submit-btn ${mutation.isSuccess ? 'success' : ''}`}
              >
                {isSubmitting
                  ? t('contact.form.sending')
                  : mutation.isSuccess
                    ? t('contact.form.success')
                    : t('contact.form.submit')}
              </motion.button>

            </form>
          </motion.div>

          {/* RIGHT INFO */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="info-card side-card"
          >
            <h3 className="info-card-title">{t('contact.workingHours')}</h3>
            <div className="info-items">
              <div className="info-item">
                <svg className="info-icon" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <p className="info-text">{t('contact.info.hours')}</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;