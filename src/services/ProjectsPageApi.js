// src/services/ProjectsPageApi.js

import { publicApi } from './api'; 

/**
 * Fetch ALL ACTIVE projects for the public Projects page.
 * Uses the optimized, lean backend endpoint:
 *
 *   GET /api/projects/website-active-projects-optimized
 *
 * Params:
 * - lang: i18n language code (en, ar, he)
 * - type: "all" | "forSale" | "forRent" | "sold"
 *
 * Backend returns:
 * {
 *   success: true,
 *   projects: [...],
 *   pagination: { total, page, limit, pages }
 * }
 */
export const getActiveProjectsOptimized = async ({ lang, type }) => {
  const response = await publicApi.get('/projects/website-active-projects-optimized', {
    params: {
      lang,
      type,
      page: 1,   // default for now
      limit: 200 // enough for all active projects
    }
  });

  return response.data;
};
