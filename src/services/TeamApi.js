// src/services/TeamApi.js (NEW FILE)
import { publicApi } from './api';

/**
 * 🚀 Get all active team members (OPTIMIZED for website front-end).
 * Fetches MINIMAL data using a dedicated backend route.
 * @param {string} lang - Language code (en, ar, he)
 */
export const getWebsiteTeamMembersOptimized = async (lang = 'en') => {
  try {
    // Note the new route endpoint
    const response = await publicApi.get(`/team/website-optimized?lang=${lang}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching optimized team members:', error);
    throw new Error(error.response?.data?.error || 'Failed to load team members');
  }
};

/**
 * Get single team member by ID (Public)
 */
export const getTeamMember = async (id, lang = 'en') => {
  try {
    const response = await api.get(`/team/${id}?lang=${lang}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to load team member');
  }
};

