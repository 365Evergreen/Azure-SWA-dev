import React from 'react';
import { Button } from '../../lib/localFluent';
import styles from './WhatWeDoHero.module.css';

const WhatWeDoHero: React.FC = () => (
  <section className={styles.whatWeDoHeroRoot}>
    <div className={styles.whatWeDoHeroGradient} />
    <div className={styles.whatWeDoHeroContent}>
      <h1 className={`${styles.whatWeDoHeroTitle} fluent-display`}>What we do</h1>
      <p className={styles.whatWeDoHeroDesc}>
        We help teams like yours navigate the complexity of the Microsoft 365 ecosystem, focusing on the six core pillars that define modern work in the evergreen era.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button
          appearance="primary"
          className={styles.whatWeDoHeroBtn}
          style={{ display: 'none' }}
        >
          Let's see how we can help
        </Button>
        <Button
          appearance="secondary"
          className={styles.whatWeDoHeroBtn}
        >
          Start your journey
        </Button>
      </div>
    </div>
  </section>
);

export default WhatWeDoHero;
