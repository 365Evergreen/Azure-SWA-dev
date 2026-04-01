import React from 'react';
import { Button } from '@fluentui/react-components';
import './HowWeDoItHero.css';

const howwedoitHero: React.FC = () => (
  <section className="how-we-do-it-hero-root">
    <div className="how-we-do-it-hero-gradient" />
    <div className="how-we-do-it-hero-content">
      <h1 className="how-we-do-it-hero-title fluent-display">How we do it</h1>
      <p className="how-we-do-it-hero-desc">
        We help teams like yours navigate the complexity of the Microsoft 365 ecosystem, focusing on the six core pillars that define modern work in the evergreen era.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button
          appearance="primary"
          className="how-we-do-it-hero-btn"
          style={{ display: 'none' }}
        >
          Let's see how we can help
        </Button>
        <Button
          appearance="secondary"
          className="how-we-do-it-hero-btn"
        >
          Start your journey
        </Button>
      </div>
    </div>
  </section>
);

export default howwedoitHero;
