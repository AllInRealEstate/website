import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Globe, PlusCircle, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

import { getWebsiteReviews } from '../../../services/ReviewsApi';
import ReviewForm from './ReviewForm/ReviewForm';
import ReviewTooltip from './ReviewTooltip/ReviewTooltip';
import './Reviews.css';

const Reviews = () => {
    const { t, i18n } = useTranslation();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [shouldLoop, setShouldLoop] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
    const { ref: counterRef, inView: countersInView } = useInView({ threshold: 0.4, triggerOnce: false });

    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ['websiteReviews', i18n.language],
        queryFn: () => getWebsiteReviews(i18n.language),
        staleTime: 1000 * 60 * 5,
    });

    // Dynamic loop threshold based on screen size and review count
    useEffect(() => {
        const updateSwiperConfig = () => {
            const width = window.innerWidth;
            const mobile = width < 1024;
            setIsMobile(mobile);

            if (mobile) {
                // Mobile: show 1 card, need 2+ to loop
                setShouldLoop(reviews.length >= 2);
            } else {
                // Desktop: show up to 3 cards, need 4+ to loop
                setShouldLoop(reviews.length >= 4);
            }
        };

        updateSwiperConfig();
        window.addEventListener('resize', updateSwiperConfig);
        return () => window.removeEventListener('resize', updateSwiperConfig);
    }, [reviews.length]);

    // Close modal on escape key and manage body scroll
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setSelectedReviewId(null);
            }
        };

        if (selectedReviewId) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [selectedReviewId]);

    // Calculate how many slides to show on desktop (1, 2, 3, or 3 max)
    const getDesktopSlidesPerView = () => {
        if (reviews.length === 0) return 1;
        if (reviews.length === 1) return 1;
        if (reviews.length === 2) return 2;
        return 3; // 3 or more reviews
    };

    // Determine wrapper class based on review count for centering
    const getWrapperClass = () => {
        if (reviews.length === 0) return 'reviews-slider-wrapper';
        if (reviews.length === 1) return 'reviews-slider-wrapper reviews-single';
        if (reviews.length === 2) return 'reviews-slider-wrapper reviews-double';
        if (reviews.length === 3) return 'reviews-slider-wrapper reviews-triple';
        return 'reviews-slider-wrapper';
    };

    // Build dynamic breakpoints based on review count
    const getBreakpoints = () => {
        const desktopSlides = getDesktopSlidesPerView();

        return {
            // Mobile: always 1 slide
            0: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // Desktop: show based on review count (1, 2, or 3)
            1024: {
                slidesPerView: desktopSlides,
                spaceBetween: 30
            }
        };
    };

    // Handle card click to open modal
    const handleCardClick = (reviewId) => {
        setSelectedReviewId(reviewId);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setSelectedReviewId(null);
    };

    // Get selected review
    const selectedReview = selectedReviewId 
        ? reviews.find(r => r.id === selectedReviewId) 
        : null;

    return (
        <section id="reviews" className="elite-reviews-section">
            <div className="elite-reviews-container">

                {/* === HEADER === */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="reviews-header-block"
                >
                    <h2 className="section-main-title">{t('reviews.title') || 'Client Voices'}</h2>
                    <div className="title-separator-gold" />
                </motion.div>

                {/* === STATS RIBBON === */}
                <motion.div
                    ref={counterRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="stats-glass-ribbon"
                >
                    <div className="stat-pillar">
                        <span className="stat-val">
                            <CountUpAnimation end={120} suffix="+" duration={2} isInView={countersInView} />
                        </span>
                        <span className="stat-lbl">{t('reviews.stats.transactions') || 'Transactions'}</span>
                    </div>

                    <div className="pillar-divider"></div>

                    <div className="stat-pillar">
                        <span className="stat-val">
                            <CountUpAnimation end={98} suffix="%" duration={2} isInView={countersInView} />
                        </span>
                        <span className="stat-lbl">{t('reviews.stats.satisfaction') || 'Satisfaction'}</span>
                    </div>

                    <div className="pillar-divider"></div>

                    <div className="stat-pillar">
                        <span className="stat-val gold-text">
                            <CountUpAnimation end={4.9} suffix="" decimals={1} duration={2} isInView={countersInView} />
                        </span>
                        <span className="stat-lbl">Average Rating <Star size={12} fill="#D4AF37" color="#D4AF37" style={{ display: 'inline', marginLeft: 4 }} /></span>
                    </div>
                </motion.div>

                {/* === CAROUSEL === */}
                {!isLoading && reviews.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className={getWrapperClass()}
                    >
                        <Swiper
                            key={`${i18n.language}-${shouldLoop}-${reviews.length}`}
                            modules={[Autoplay, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1}
                            centeredSlides={false}
                            loop={shouldLoop}
                            speed={1000}
                            autoplay={shouldLoop ? {
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            } : false}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true
                            }}
                            breakpoints={getBreakpoints()}
                            className="elite-swiper"
                        >
                            {reviews.map((review) => (
                                <SwiperSlide key={review.id}>
                                    <div
                                        className="elite-review-card"
                                        onClick={() => handleCardClick(review.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleCardClick(review.id);
                                            }
                                        }}
                                    >
                                        {/* Card Header */}
                                        <div className="card-top-row">
                                            <div className="rating-stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < review.rating ? "#D4AF37" : "none"} color={i < review.rating ? "#D4AF37" : "#E5E7EB"} />
                                                ))}
                                            </div>
                                            {review.isFallback && (
                                                <div className="lang-tag">
                                                    <Globe size={12} /> {review.originalLanguage.toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-quote-icon">
                                            <Quote size={60} />
                                        </div>

                                        {/* Review Content */}
                                        <div className="card-body">
                                            <p className="review-excerpt">"{review.text}"</p>
                                        </div>

                                        {/* Author Footer */}
                                        <div className="card-author-row">
                                            <div className="author-avatar">
                                                {review.author.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="author-meta">
                                                <span className="author-name">{review.author}</span>
                                                <span className="author-loc">{review.location}</span>
                                            </div>
                                        </div>

                                        {/* Click hint */}
                                        <div className="card-click-hint">
                                            <span>{t('reviews.clickToRead') || 'Click to read full review'}</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                ) : (
                    !isLoading && <div className="empty-state"><p>{t('reviews.empty') || 'No reviews yet.'}</p></div>
                )}

                {isLoading && <div className="loading-spinner"><div className="gold-loader"></div></div>}

                {/* === CTA BUTTON === */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="reviews-footer-action"
                >
                    <button className="elite-add-btn" onClick={() => setIsFormOpen(true)}>
                        <PlusCircle size={18} />
                        <span>{t('reviews.writeReview') || 'Write a Review'}</span>
                    </button>
                </motion.div>
            </div>

            <ReviewForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

            {/* Review Modal - rendered at root level */}
            {selectedReview && (
                <ReviewTooltip
                    review={selectedReview}
                    isVisible={true}
                    onClose={handleCloseModal}
                />
            )}
        </section>
    );
};

const CountUpAnimation = ({ end, suffix = '', duration = 2, decimals = 0, isInView }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!isInView) return;
        let startTime = null;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            const easeOut = 1 - Math.pow(1 - progress, 4);
            setCount(end * easeOut);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration, isInView]);
    return <span>{count.toFixed(decimals)}{suffix}</span>;
};

export default Reviews;