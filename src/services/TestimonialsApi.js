import { publicApi } from './api';

// 🟢 Website - All Testimonials
export const getWebsiteTestimonials = async (lang = 'en') => {
  const { data } = await publicApi.get('/testimonials/website/all', {
    params: { lang }
  });
  return data;
};

// 🟢 Website - Featured Only
export const getFeaturedTestimonials = async (lang = 'en') => {
  const { data } = await publicApi.get('/testimonials/website/featured', {
    params: { lang }
  });
  return data;
};

// 🟢 Website - Single Testimonial (optional future)
export const getWebsiteTestimonialById = async (id, lang = 'en') => {
  const { data } = await publicApi.get(`/testimonials/website/${id}`, {
    params: { lang }
  });
  return data;
};
