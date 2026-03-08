// ServicesPageApi.js
import { publicApi } from './api';

// Public lightweight fetch
export const getPublicServices = async (lang = 'en') => {
  try {
    const { data } = await publicApi.get('/services/website/all', {
      params: { lang }
    });
    return data;
  } catch (err) {
    console.error('❌ Error fetching public services:', err);
    throw err;
  }
};
