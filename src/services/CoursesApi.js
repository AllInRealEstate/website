// CoursesPageApi.js
import { publicApi } from './api';

// 🟢 Public lightweight fetch - all courses for website
export const getWebsiteCourses = async (lang = 'en') => {
  try {
    const { data } = await publicApi.get('/courses/website/all', {
      params: { lang }
    });
    // Backend returns an array directly
    return data;
  } catch (err) {
    console.error('❌ Error fetching public courses:', err);
    throw err;
  }
};

// 🟢 Public lightweight fetch - single course (if/when needed)
export const getWebsiteCourseById = async (id, lang = 'en') => {
  try {
    const { data } = await publicApi.get(`/courses/website/${id}`, {
      params: { lang }
    });
    return data;
  } catch (err) {
    console.error('❌ Error fetching public course by id:', err);
    throw err;
  }
};
