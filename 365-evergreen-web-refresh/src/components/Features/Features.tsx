import styles from './Features.module.css';
import { useSiteFeatures } from '../../lib/useSiteFeatures';
import { useInView } from '../../lib/useInView';
import type { SiteFeature } from '../../lib/useSiteFeatures';
import { PeopleTeamToolbox24Regular, ChevronRight24Filled } from '../Icons';
import { useNavigate } from 'react-router-dom';

export function Features() {
  const [ref, inView] = useInView<HTMLElement>();
  const features = useSiteFeatures(inView) as SiteFeature[];
  const navigate = useNavigate();

  // Sort features by siteFeature.sortOrder (ascending)
  const sortedFeatures = [...features].sort((a, b) => {
    const aOrder = Number(a.siteFeature?.sortOrder) || 0;
    const bOrder = Number(b.siteFeature?.sortOrder) || 0;
    return aOrder - bOrder;
  });

  if (!sortedFeatures.length) return null;

  return (
    <section ref={ref} className={`${styles.featuresRoot} home-section`}>
      <h2 className="fluent-title2 home-section-heading">What we do to help you succeed</h2>
      <div className={styles.featuresGrid}>
        {sortedFeatures.map(feature => (
          <div
            className={`${styles.featuresCard} selectable-card`}
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
            <div className={styles.featuresHeaderRow}>
              <span className={styles.featuresIcon}>
                {feature.siteFeature.icon ? (
                  <img src={feature.siteFeature.icon} alt="Feature icon" className={styles.featureIconImage} />
                ) : (
                  <PeopleTeamToolbox24Regular />
                )}
              </span>
              <span className={`${styles.featuresTitle} fluent-title3`}>{feature.siteFeature.title || feature.title}</span>
            </div>
            <div className={`${styles.featuresDesc} fluent-body1`}>{feature.siteFeature.blurb}</div>
            <a
              href={`/feature/${feature.slug}`}
              className={styles.featuresLink}
              onClick={e => {
                if (e.ctrlKey || e.metaKey || e.button === 1) return;
                e.preventDefault();
                navigate(`/feature/${feature.slug}`);
              }}
              tabIndex={-1}
            >
              <span className={styles.featuresLinkContent}>
                {feature.siteFeature.buttonText || feature.siteFeature.link?.title || 'Learn more'}
                <ChevronRight24Filled className={styles.featuresLinkIcon} />
              </span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
