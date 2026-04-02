import styles from './Footer.module.css';
import { Link } from '../../lib/localFluent';
import { LeafThree24Regular } from '../Icons';

export function Footer() {
  return (
    <footer className={styles.footerRoot}>
      <div className={styles.footerContainer}>
        <div className={styles.featuresGrid}>
          {/* Column 1: Brand & Socials */}
          <div>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}><LeafThree24Regular /></div>
              <div>
                <div className={`${styles.footerTitle} fluent-title3`}>365 Evergreen</div>
                <div className={styles.footerDesc}>Empowering individuals to live sustainably, one day at a time. Join our community and make every day count.</div>
              </div>
            </div>
            <div className={styles.footerSocials}>
              <a href="#" className={styles.footerSocial}><span aria-label="Twitter">🐦</span></a>
              <a href="#" className={styles.footerSocial}><span aria-label="GitHub">🐙</span></a>
              <a href="#" className={styles.footerSocial}><span aria-label="LinkedIn">💼</span></a>
            </div>
          </div>
          {/* Column 2: Product Links */}
          <div>
            <div className={styles.footerLinkGroup}>
              <div className={`${styles.footerLinkTitle} fluent-subtitle2`}>Product</div>
              <Link href="#">Features</Link>
              <Link href="#">Pricing</Link>
              <Link href="#">Resources</Link>
              <Link href="#">Updates</Link>
            </div>
          </div>
          {/* Column 3: Company & Legal Links */}
          <div>
            <div className={styles.footerLinkGroup}>
              <div className={`${styles.footerLinkTitle} fluent-subtitle2`}>Company</div>
              <Link href="#">About Us</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Contact</Link>
              <Link href="#">Blog</Link>
            </div>
            <div className={`${styles.footerLinkGroup} ${styles.footerLegalGroup}`}>
              <div className={`${styles.footerLinkTitle} fluent-subtitle2`}>Legal</div>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Cookie Policy</Link>
              <Link href="#">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div>© {new Date().getFullYear()} 365 Evergreen. All rights reserved.</div>
        <div className={`${styles.footerMade} fluent-caption1`}>Made with <span className={styles.footerHeart} role="img" aria-label="love">💚</span> for the planet</div>
      </div>
    </footer>
  );
}
