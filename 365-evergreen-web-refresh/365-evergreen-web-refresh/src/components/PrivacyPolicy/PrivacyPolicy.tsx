import React from 'react';
import RouteLoader from '../RouteLoader/RouteLoader';
import { usePrivacyPolicy } from '../../lib/usePrivacyPolicy';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy: React.FC = () => {
  const { data, loading, error } = usePrivacyPolicy();

  if (loading) {
    return (
      <section className={styles.privacyPolicyRoot} aria-busy="true">
        <div className={styles.loader}>
          <RouteLoader />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.privacyPolicyRoot}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
        </header>
        <p className={styles.message} role="alert">{error}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className={styles.privacyPolicyRoot}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
        </header>
        <p className={styles.message}>Privacy policy content is currently unavailable.</p>
      </section>
    );
  }

  const title = data.title && data.title.trim().length > 0 ? data.title : 'Privacy Policy';

  return (
    <article className={styles.privacyPolicyRoot}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: data.content }} />
    </article>
  );
};

export default PrivacyPolicy;

