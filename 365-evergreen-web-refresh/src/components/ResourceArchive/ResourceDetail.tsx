import React from 'react';
import type { ResourceItem } from './useE365Resources';
import styles from './ResourceDetail.module.css';

const ResourceDetail: React.FC<{ resource: ResourceItem }> = ({ resource }) => {
  return (
    <article className={styles.detailRoot}>
      {resource.featuredImageUrl && (
        <img src={resource.featuredImageUrl} alt={resource.title} className={styles.featured} />
      )}
      <h1 className={styles.title}>{resource.title}</h1>
      <div className={styles.meta}>{resource.resourceType || resource.label}</div>
      <div className={styles.excerpt} dangerouslySetInnerHTML={{ __html: resource.excerpt }} />
    </article>
  );
};

export default ResourceDetail;
