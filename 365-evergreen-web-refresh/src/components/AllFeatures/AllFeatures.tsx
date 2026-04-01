import React from 'react';
import styles from './AllFeatures.module.css';
import { useSiteFeatures } from '../../lib/useSiteFeatures';
import type { SiteFeature } from '../../lib/useSiteFeatures';

import { useBreadcrumb } from '../BreadcrumbContext';
import { PeopleTeamToolbox24Regular, ChevronRight24Filled } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

const AllFeatures: React.FC = () => {
  const features = useSiteFeatures() as SiteFeature[];
  const navigate = useNavigate();

  const sortedFeatures = [...features].sort((a, b) => {
    const aOrder = Number(a.siteFeature?.sortOrder) || 0;
    const bOrder = Number(b.siteFeature?.sortOrder) || 0;
    return aOrder - bOrder;
  });

  if (!sortedFeatures.length) return null;

  const breadcrumbItems = [
    { text: 'Home', href: '/' },
    { text: 'All features', href: '/all-features' },
  ];

  const { setItems } = useBreadcrumb();

  React.useEffect(() => {
    setItems(breadcrumbItems);
    return () => setItems([]);
  }, [setItems]);

  return (
    <section className={styles['features-root']}>
      <h2 className="fluent-title2">All features</h2>
      <div className={styles['features-grid']}>
        {sortedFeatures.map(feature => (
          <div
            className={`${styles['features-card']} selectable-card`}
            key={feature.id}
            tabIndex={0}
            role="group"
            onClick={e => {
              if (e.ctrlKey || e.metaKey || e.button === 1) return;
              navigate(`/feature/${feature.slug}`);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/feature/${feature.slug}`);
              }
            }}
          >
            <div className={styles['features-header-row']}>
              <span className={styles['features-icon']}>
                {feature.siteFeature.icon ? (
                  <img src={feature.siteFeature.icon} alt="Feature icon" className={styles['feature-icon-img']} />
                ) : (
                  <PeopleTeamToolbox24Regular />
                )}
              </span>
              <span className={`${styles['features-title']} fluent-title3`}>{feature.siteFeature.title || feature.title}</span>
            </div>
            <div className={`${styles['features-desc']} fluent-body1`}>{feature.siteFeature.blurb}</div>
            <a
              href={`/feature/${feature.slug}`}
              className={styles['features-link']}
              onClick={e => {
                if (e.ctrlKey || e.metaKey || e.button === 1) return;
                e.preventDefault();
                navigate(`/feature/${feature.slug}`);
              }}
              tabIndex={-1}
            >
              <span className={styles['link-inline']}>
                {feature.siteFeature.buttonText || feature.siteFeature.link?.title || 'Learn more'}
                <ChevronRight24Filled className={styles['chevron-icon']} />
              </span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllFeatures;
