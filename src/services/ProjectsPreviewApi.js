// src/services/ProjectsPreviewApi.js
// 💡 IMPORTANT: This imports the shared, token-free client from the main API file.
import { publicApi } from './api'; 

/**
 * 🚀 Get featured, optimized projects for the public website preview.
 * This function is dedicated to the public projects view.
 * @param {string} lang - Language code (en, ar, he)
 */
export const getWebsiteFeaturedProjectsOptimized = async (lang = 'en') => {
  try {
    // Uses the clean publicApi instance imported above
    const response = await publicApi.get(`/projects/website-featured-optimized?lang=${lang}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching optimized featured projects from ProjectsPreviewApi:', error);
    throw new Error(error.response?.data?.error || 'Failed to load projects');
  }
};