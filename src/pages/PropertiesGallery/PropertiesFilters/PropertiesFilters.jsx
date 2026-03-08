// src/pages/properties-gallery/components/PropertiesFilters.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './PropertiesFilters.css';

const PropertiesFilters = ({ filters, onChange, onApply }) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onChange(localFilters);
    onApply();
  };

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleRangeChange = (rangeField, subField, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [rangeField]: {
        ...prev[rangeField],
        [subField]: value === '' ? null : value
      }
    }));
  };

  const handleClear = () => {
    const clearedFilters = {
      search: filters.search, // Keep search
      type: 'all',
      bedrooms: null,
      bathrooms: null,
      area: { min: null, max: null },
      priceRange: { min: null, max: null }
    };
    setLocalFilters(clearedFilters);
    onChange(clearedFilters);
  };

  return (
    <div className="properties-filters">
      <div className="filters-grid">
        {/* Type Dropdown */}
        <div className="filter-control">
          <label>{t('propertiesGallery.filters.typeLabel')}</label>
          <select
            value={localFilters.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="all">{t('propertiesGallery.filters.typeAll')}</option>
            <option value="forSale">{t('propertiesGallery.filters.typeSale')}</option>
            <option value="forRent">{t('propertiesGallery.filters.typeRent')}</option>
            <option value="sold">{t('propertiesGallery.filters.typeSold')}</option>
          </select>
        </div>

        {/* Bedrooms Dropdown */}
        <div className="filter-control">
          <label>{t('propertiesGallery.filters.bedsLabel')}</label>
          <select
            value={localFilters.bedrooms || ''}
            onChange={(e) => handleChange('bedrooms', e.target.value || null)}
          >
            <option value="">{t('propertiesGallery.filters.bedsAny')}</option>
            <option value="1">{t('propertiesGallery.filters.beds1')}</option>
            <option value="2">{t('propertiesGallery.filters.beds2')}</option>
            <option value="3">{t('propertiesGallery.filters.beds3')}</option>
            <option value="4">{t('propertiesGallery.filters.beds4')}</option>
            <option value="5">{t('propertiesGallery.filters.beds5')}</option>
          </select>
        </div>

        {/* Bathrooms Dropdown */}
        <div className="filter-control">
          <label>{t('propertiesGallery.filters.bathsLabel')}</label>
          <select
            value={localFilters.bathrooms || ''}
            onChange={(e) => handleChange('bathrooms', e.target.value || null)}
          >
            <option value="">{t('propertiesGallery.filters.bathsAny')}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Area Range */}
        <div className="filter-control range-control">
          <label>{t('propertiesGallery.filters.areaLabel')}</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder={t('propertiesGallery.filters.areaMin')}
              value={localFilters.area.min || ''}
              onChange={(e) => handleRangeChange('area', 'min', e.target.value)}
              min="0"
            />
            <span className="range-separator">-</span>
            <input
              type="number"
              placeholder={t('propertiesGallery.filters.areaMax')}
              value={localFilters.area.max || ''}
              onChange={(e) => handleRangeChange('area', 'max', e.target.value)}
              min="0"
            />
            <span className="range-unit">{t('propertiesGallery.filters.areaUnit')}</span>
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-control range-control">
          <label>{t('propertiesGallery.filters.priceLabel')}</label>
          <div className="range-inputs">
            <input
              type="number"
              placeholder={t('propertiesGallery.filters.priceMin')}
              value={localFilters.priceRange.min || ''}
              onChange={(e) => handleRangeChange('priceRange', 'min', e.target.value)}
              min="0"
            />
            <span className="range-separator">-</span>
            <input
              type="number"
              placeholder={t('propertiesGallery.filters.priceMax')}
              value={localFilters.priceRange.max || ''}
              onChange={(e) => handleRangeChange('priceRange', 'max', e.target.value)}
              min="0"
            />
            <span className="range-unit">₪</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="filters-actions">
        <button className="apply-btn" onClick={handleApply}>
          {t('propertiesGallery.apply')}
        </button>
        <button className="clear-btn" onClick={handleClear}>
          {t('propertiesGallery.clear')}
        </button>
      </div>
    </div>
  );
};

export default PropertiesFilters;