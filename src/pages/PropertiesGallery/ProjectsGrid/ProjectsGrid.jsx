// src/pages/properties-gallery/components/ProjectsGrid.jsx
import { useTranslation } from 'react-i18next';
import ProjectCard from '../ProjectCard/ProjectCard';
import './ProjectsGrid.css';

const ProjectsGrid = ({ projects, isLoading, onViewDetails }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="properties-loading">
        <div className="spinner"></div>
        <p>{t('propertiesGallery.loading')}</p>
      </div>
    );
  }

  return (
    <div className="properties-table-container">
      {/* Table Header (Desktop Only) */}
      <div className="properties-table-header">
        <span>{t('propertiesGallery.table.image')}</span>
        <span>{t('propertiesGallery.table.title')}</span>
        <span>{t('propertiesGallery.table.location')}</span>
        <span>{t('propertiesGallery.table.price')}</span>
        <span className="desktop-only">{t('propertiesGallery.table.beds')}</span>
        <span className="desktop-only">{t('propertiesGallery.table.baths')}</span>
        <span className="desktop-only">{t('propertiesGallery.table.area')}</span>
        <span>{t('propertiesGallery.table.status')}</span>
        <span>{t('propertiesGallery.table.action')}</span>
      </div>

      {/* Table Body */}
      <div className="properties-table-body">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsGrid;