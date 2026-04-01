import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@fluentui/react-components';
import { useFeatureBySlug } from '../../lib/useFeatureBySlug';
import PageBlocks from '../PageBlocks/PageBlocks';
import FeatureAccordionButtons from '../FeatureAccordionButtons/FeatureAccordionButtons';
import FeaturePage from '../FeaturePage/FeaturePage';
import fvStyles from './FeatureView.module.css';


const FeatureView: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const feature = useFeatureBySlug(slug);

  const breadcrumbItems = [
    { text: 'Home', href: '/' },
    { text: 'Features', href: '/all-features' },
    { text: feature?.title || (slug || 'Feature'), href: `/feature/${slug}` },
  ];

  return (
    <>
      <Breadcrumb style={{ padding: '1rem 4vw' }}>
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

      {/* FeatureView-level hero using explicit class names */}
      <header className={fvStyles['featureview-hero']} role="banner">
        <div className={fvStyles['featureview-heroBg']} aria-hidden="true" />
        <div className={fvStyles['featureview-heroOverlay']} aria-hidden="true" />
        <div className={fvStyles['featureview-heroInner']}>
          <h1 className={fvStyles['featureview-heroTitle']}>
            {feature?.siteFeature?.title ?? feature?.title ?? 'Feature'}
          </h1>
          {feature?.siteFeature?.blurb && (
            <p className={fvStyles['featureview-heroBlurb']}>{feature.siteFeature.blurb}</p>
          )}
          <div className={fvStyles['featureview-heroCta']}>
            <a className={fvStyles['featureview-heroBtn']} href="#contact">Get in touch</a>
          </div>
        </div>
      </header>

      {/* Use the FeaturePage for layout/content but hide its internal hero */}
      <FeaturePage hideHero={true}>
        <div style={{ padding: '1rem 4vw' }}>
          {feature ? (
            feature.blocks && feature.blocks.length > 0 ? (
              <PageBlocks blocks={feature.blocks} />
            ) : feature.content ? (
              <div dangerouslySetInnerHTML={{ __html: feature.content }} />
            ) : (
              <em>No content found…</em>
            )
          ) : (
            <em>Loading feature content…</em>
          )}

          {/* Feature buttons and accordions for this feature */}
          {feature?.title && <FeatureAccordionButtons feature={feature.title} />}
        </div>
      </FeaturePage>
    </>
  );
};

export default FeatureView;

