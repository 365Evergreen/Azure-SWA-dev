import styles from "./CTA.module.css";
import { Button } from "@fluentui/react-components";
import { CheckmarkCircle24Regular, PeopleTeam24Regular, Flash24Regular, BrainCircuit24Regular } from "@fluentui/react-icons";

export function CTA() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaGrid}>
        {/* Left column */}
        <div className={styles.ctaLeft}>
          <div className={styles.badge}> 
            <span className={styles.badgeIcon}><Flash24Regular /></span>
            Free to start
          </div>
          <h1 className={styles.headline}>
            Start your free modern<br />workplace journey
          </h1>
          <p className={styles.description}>
            Get instant access to your personalised Evergreen workspace and explore modern collaboration, automation, and AI-powered tools.
          </p>
          <ul className={styles.bulletList}>
            <li><CheckmarkCircle24Regular className={styles.bulletIcon} /> No credit card required</li>
            <li><CheckmarkCircle24Regular className={styles.bulletIcon} /> Set up in under 5 minutes</li>
            <li><CheckmarkCircle24Regular className={styles.bulletIcon} /> Guided onboarding included</li>
          </ul>
          <div className={styles.ctaButtons}>
            <Button appearance="primary" size="large" className={`appButton cta-override-btn ${styles.primaryBtn}`}> 
              Get Started Free
            </Button>
            <Button appearance="outline" size="large" className={`appButton cta-override-btn ${styles.secondaryBtn}`}> 
              What's included
            </Button>
          </div>
          <div className={styles.trustedLine}>
            Trusted by growing teams worldwide <span className={styles.trustedEmoji}>🌱</span>
          </div>
        </div>

        {/* Right column: Feature cards */}
        <div className={styles.ctaRight}>
          <div className={styles.featureCard} style={{ top: 0, left: 0 }}>
            <div className={styles.cardIconWrap} style={{ background: "#EAF3ED" }}>
              <PeopleTeam24Regular className={styles.cardIcon} />
            </div>
            <div className={styles.cardTextWrap}>
              <div className={styles.cardTitle}>Team Collaboration</div>
              <div className={styles.cardDesc}>Connect and work together seamlessly</div>
            </div>
          </div>
          <div className={styles.featureCard} style={{ top: 90, left: 40 }}>
            <div className={styles.cardIconWrap} style={{ background: "#EAF3ED" }}>
              <Flash24Regular className={styles.cardIcon} />
            </div>
            <div className={styles.cardTextWrap}>
              <div className={styles.cardTitle}>Smart Automation</div>
              <div className={styles.cardDesc}>Save time with intelligent workflows</div>
            </div>
          </div>
          <div className={styles.featureCard} style={{ top: 180, left: 0 }}>
            <div className={styles.cardIconWrap} style={{ background: "#EAF3ED" }}>
              <BrainCircuit24Regular className={styles.cardIcon} />
            </div>
            <div className={styles.cardTextWrap}>
              <div className={styles.cardTitle}>AI-Powered Insights</div>
              <div className={styles.cardDesc}>Make smarter decisions faster</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
