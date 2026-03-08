// src/pages/properties-gallery/PropertiesGallery.jsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Fuse from 'fuse.js';

import { getActiveProjectsOptimized } from '../../services/ProjectsPageApi';
import PropertiesHeader from './PropertiesHeader/PropertiesHeader';
import PropertiesFilters from './PropertiesFilters/PropertiesFilters';
import ProjectsGrid from './ProjectsGrid/ProjectsGrid';
import EmptyState from './EmptyState/EmptyState';

import './PropertiesGallery.css';

const PropertiesGallery = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    bedrooms: null,
    bathrooms: null,
    area: { min: null, max: null },
    priceRange: { min: null, max: null }
  });

  // UI state
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  // Fetch all projects (max 100)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['allPropertiesGallery', i18n.language],
    queryFn: () =>
      getActiveProjectsOptimized({
        lang: i18n.language,
        type: 'all',
        limit: 200
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    keepPreviousData: true
  });

  // Extract projects array
  const allProjects = useMemo(() => {
    return data?.projects || [];
  }, [data]);

  // Apply filters
  const filteredProjects = useMemo(() => {
    let result = [...allProjects];

    // 1. Fuzzy search filter
    if (filters.search && filters.search.trim() !== '') {
      const fuse = new Fuse(result, {
        keys: ['title', 'location', 'shortDesc', 'fullDesc', 'features'],
        threshold: 0.4, // Allows typos like "nzaret" -> "nazareth"
        ignoreLocation: true
      });
      result = fuse.search(filters.search).map(item => item.item);
    }

    // 2. Type filter
    if (filters.type !== 'all') {
      result = result.filter(p => p.type === filters.type);
    }

    // 3. Bedrooms filter (minimum)
    if (filters.bedrooms) {
      result = result.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
    }

    // 4. Bathrooms filter (minimum)
    if (filters.bathrooms) {
      result = result.filter(p => p.bathrooms >= parseInt(filters.bathrooms));
    }

    // 5. Area range filter
    if (filters.area.min || filters.area.max) {
      result = result.filter(p => {
        const area = p.area || 0;
        if (filters.area.min && area < parseFloat(filters.area.min)) return false;
        if (filters.area.max && area > parseFloat(filters.area.max)) return false;
        return true;
      });
    }

    // 6. Price range filter
    if (filters.priceRange.min || filters.priceRange.max) {
      result = result.filter(p => {
        const price = p.pricePerMonth || p.price || 0;
        if (filters.priceRange.min && price < parseFloat(filters.priceRange.min)) return false;
        if (filters.priceRange.max && price > parseFloat(filters.priceRange.max)) return false;
        return true;
      });
    }

    return result;
  }, [allProjects, filters]);

  // Lazy loading - show only first N projects
  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.type !== 'all') count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.area.min || filters.area.max) count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    return count;
  }, [filters]);

  // Get active filter pills for display
  const getActiveFilterPills = () => {
    const pills = [];

    // FIX: Correctly map filter values to translation keys
    if (filters.type !== 'all') {
      let label = '';
      if (filters.type === 'forSale') label = t('propertiesGallery.filters.typeSale');
      else if (filters.type === 'forRent') label = t('propertiesGallery.filters.typeRent');
      else if (filters.type === 'sold') label = t('propertiesGallery.filters.typeSold');
      else label = filters.type; // Fallback

      pills.push({
        label: label,
        onRemove: () => setFilters(prev => ({ ...prev, type: 'all' }))
      });
    }

    if (filters.bedrooms) {
      pills.push({
        label: `${filters.bedrooms}+ ${t('propertiesGallery.filters.bedsLabel')}`,
        onRemove: () => setFilters(prev => ({ ...prev, bedrooms: null }))
      });
    }

    if (filters.bathrooms) {
      pills.push({
        label: `${filters.bathrooms}+ ${t('propertiesGallery.filters.bathsLabel')}`,
        onRemove: () => setFilters(prev => ({ ...prev, bathrooms: null }))
      });
    }

    if (filters.area.min || filters.area.max) {
      const areaText = `${filters.area.min || 0}-${filters.area.max || '∞'} m²`;
      pills.push({
        label: areaText,
        onRemove: () => setFilters(prev => ({ ...prev, area: { min: null, max: null } }))
      });
    }

    if (filters.priceRange.min || filters.priceRange.max) {
      const priceText = `₪${filters.priceRange.min || 0}-${filters.priceRange.max || '∞'}`;
      pills.push({
        label: priceText,
        onRemove: () => setFilters(prev => ({ ...prev, priceRange: { min: null, max: null } }))
      });
    }

    return pills;
  };

  // Handle view details navigation
  const handleViewDetails = (projectId) => {
    navigate(`/projects?id=${projectId}`);
  };

  // Handle clear all filters
  const handleClearAll = () => {
    setFilters({
      search: '',
      type: 'all',
      bedrooms: null,
      bathrooms: null,
      area: { min: null, max: null },
      priceRange: { min: null, max: null }
    });
  };

  // Handle load more
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <div className="properties-gallery-page">
      {/* Header Section */}
      <PropertiesHeader />

      {/* Filter Section */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="filter-section-container"
      >
        {/* Row 1: Search + Filter Toggle (Always Visible) */}
        <div className="search-row">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder={t('propertiesGallery.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            {filters.search && (
              <button
                className="search-clear-btn"
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <button
            className={`filter-toggle-btn ${isFiltersExpanded ? 'expanded' : ''}`}
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            <span>
              {t('propertiesGallery.filtersButton')}
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </span>
            <svg className="toggle-arrow" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Row 2: Advanced Filters (Collapsible) */}
        {isFiltersExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="filters-expanded-section"
          >
            <PropertiesFilters
              filters={filters}
              onChange={setFilters}
              onApply={() => setIsFiltersExpanded(false)}
            />
          </motion.div>
        )}

        {/* Active Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="active-filters-row">
            <span className="active-filters-label">{t('propertiesGallery.activeFilters')}</span>
            <div className="filter-pills">
              {getActiveFilterPills().map((pill, index) => (
                <div key={index} className="filter-pill">
                  <span>{pill.label}</span>
                  <button onClick={pill.onRemove} aria-label="Remove filter">✕</button>
                </div>
              ))}
            </div>
            <button className="clear-all-btn" onClick={handleClearAll}>
              {t('propertiesGallery.clear')}
            </button>
          </div>
        )}
      </motion.div>

      {/* Results Info */}
      {!isLoading && (
        <div className="results-info">
          <p>
            {t('propertiesGallery.showing')} <strong>{visibleProjects.length}</strong> {t('propertiesGallery.of')} <strong>{filteredProjects.length}</strong> {t('propertiesGallery.properties')}
          </p>
        </div>
      )}

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ProjectsGrid
          projects={visibleProjects}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
        />
      </motion.div>

      {/* Load More Button */}
      {!isLoading && visibleCount < filteredProjects.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="load-more-section"
        >
          <button className="load-more-btn" onClick={handleLoadMore}>
            {t('propertiesGallery.loadMore')}
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && <EmptyState />}

      {/* Error State */}
      {isError && (
        <div className="error-state">
          <p>{t('propertiesGallery.error')}</p>
          {error?.message && <p className="error-message">{error.message}</p>}
        </div>
      )}
    </div>
  );
};

export default PropertiesGallery;