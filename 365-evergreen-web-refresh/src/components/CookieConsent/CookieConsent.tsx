import { useState } from 'react';
import { Button } from '@fluentui/react-components';
import styles from './CookieConsent.module.css';

const CONSENT_KEY = 'cookieConsent';

type Consent = 'accepted' | 'rejected' | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'accepted' || stored === 'rejected') {
      return stored;
    }
    return null;
  });

  function handleConsent(choice: Consent) {
    setConsent(choice);
    localStorage.setItem(CONSENT_KEY, choice || '');
    // Optionally: trigger callback to enable/disable analytics etc.
  }

  if (consent) return null;

  return (
    <div className={styles.banner} role="dialog" aria-live="polite">
      <div className={styles.text}>
        We use cookies to enhance your experience, analyse site usage, and assist in our marketing efforts. See our <a href="/privacy" className={styles.link}>Privacy Policy</a>.
      </div>
      <div className={styles.actions}>
        <Button appearance="primary" size="small" onClick={() => handleConsent('accepted')}>Accept</Button>
        <Button appearance="secondary" size="small" onClick={() => handleConsent('rejected')}>Reject</Button>
      </div>
    </div>
  );
}
