import React from 'react';
import styles from './Pillars.module.css';
import { usePillars } from '../../lib/usePillars';
import { useInView } from '../../lib/useInView';
import { useNavigate } from 'react-router-dom';

const Pillars: React.FC = () => {
  const [ref, inView] = useInView<HTMLElement>();
  const pillars = usePillars(3, inView);
  const navigate = useNavigate();

  if (!pillars || pillars.length === 0) return null;

  return (
    <section ref={ref} className={styles.pillarsRoot} aria-labelledby="pillars-heading">
      <div className={styles.container}>
        <h2 id="pillars-heading" className={`${styles.heading} fluent-title2`}>Explore our features</h2>
        <div className={styles.grid}>
          {pillars.map(p => {
            const url = p.uri || `/feature/${p.slug}`;
            return (
              <a
                key={p.id}
                href={url}
                onClick={e => { e.preventDefault(); navigate(url); }}
                className={styles.card}
              >
                {p.featuredImage?.node?.sourceUrl && (
                  <div className={styles.media}>
                    <img src={p.featuredImage.node.sourceUrl} alt={p.title} className={styles.image} loading="lazy" />
                  </div>
                )}
                <div className={styles.body}>
                  <h3 className={styles.title}>{p.title}</h3>
                  <p className={styles.blurb} dangerouslySetInnerHTML={{ __html: p.e365featurepage?.blurb || '' }} />
                  <span className={styles.cta}>{p.e365featurepage?.buttonText || 'Learn more'}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
