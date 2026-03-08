import { publicApi } from './api';

/**
 * FETCH WEBSITE REVIEWS
 * @param {string} lang - Current language (e.g., 'en', 'he')
 */
export const getWebsiteReviews = async (lang = 'en') => {
  try {
    const { data } = await publicApi.get('/reviews', {
      params: { lang, limit: 20 }
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return [];
  }
};

/**
 * SUBMIT A NEW REVIEW
 * @param {object} reviewData - { author, location, rating, text, lang }
 */
export const submitReview = async (reviewData) => {
  try {
    const { data } = await publicApi.post('/reviews', reviewData);
    return data;
  } catch (error) {
    console.error("❌ Error submitting review:", error);
    throw error;
  }
};