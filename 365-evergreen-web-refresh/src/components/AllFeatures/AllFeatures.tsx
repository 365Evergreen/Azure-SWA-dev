import React from 'react';
import './AllFeatures.css';
import { useSiteFeatures } from '../../lib/useSiteFeatures';
import type { SiteFeature } from '../../lib/useSiteFeatures';
import { Breadcrumb, BreadcrumbItem } from '@fluentui/react-components';
import { PeopleTeamToolbox24Regular, ChevronRight24Filled } from '@fluentui/react-icons';
import { useNavigate, Link } from 'react-router-dom';

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

  return (
    <section className="features-root">
      <Breadcrumb>
        {breadcrumbItems.map((item, idx) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              {idx < breadcrumbItems.length - 1 ? (
                <Link to={item.href}>{item.text}</Link>
              ) : (
                <span>{item.text}</span>
              )}
            </BreadcrumbItem>
            {idx < breadcrumbItems.length - 1 && (
              <span style={{ margin: '0 0.5em', color: '#888' }}>/</span>
            )}
          </React.Fragment>
        ))}
      </Breadcrumb>
      <h2 className="fluent-title2">All features</h2>
      <div className="features-grid">
        {sortedFeatures.map(feature => (
          <div
            className="features-card selectable-card"
            key={feature.id}
            tabIndex={0}
            role="button"
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
            <div className="features-header-row">
              <span className="features-icon">
                {feature.siteFeature.icon ? (
                  <img src={feature.siteFeature.icon} alt="Feature icon" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                ) : (
                  <PeopleTeamToolbox24Regular />
                )}
              </span>
              <span className="features-title fluent-title3">{feature.siteFeature.title || feature.title}</span>
            </div>
            <div className="features-desc fluent-body1">{feature.siteFeature.blurb}</div>
            <a
              href={`/feature/${feature.slug}`}
              className="features-link"
              onClick={e => {
                if (e.ctrlKey || e.metaKey || e.button === 1) return;
                e.preventDefault();
                navigate(`/feature/${feature.slug}`);
              }}
              tabIndex={-1}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4em' }}>
                {feature.siteFeature.buttonText || feature.siteFeature.link?.title || 'Learn more'}
                <ChevronRight24Filled style={{ fontSize: '1.1em', marginLeft: '0.1em' }} />
              </span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllFeatures;
