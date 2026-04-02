import { useEffect, useState } from 'react';
import { Button } from '../../lib/localFluent';
import styles from './CookieConsent.module.css';
import { acceptAll, rejectAll, getConsent, subscribe } from '../../lib/cookieConsent';

export function CookieConsent() {
  const [visible, setVisible] = useState(() => getConsent() === null);

  useEffect(() => {
    const unsub = subscribe(rec => {
      setVisible(rec === null);
    });
    return unsub;
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className={styles.text}>
        We use cookies to enhance your experience, analyse site usage, and assist in our marketing efforts. See our <a href="/privacy" className={styles.link}>Privacy Policy</a>.
      </div>
      <div className={styles.actions}>
        <Button appearance="primary" size="small" onClick={() => acceptAll()}>Accept</Button>
        <Button appearance="secondary" size="small" onClick={() => rejectAll()}>Reject</Button>
      </div>
    </div>
  );
}
