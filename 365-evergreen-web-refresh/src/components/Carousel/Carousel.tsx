import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Carousel.module.css';
import { Button } from '@fluentui/react-components';

const slides = [
  {
    headline: 'Transform Your Digital Workspace',
    bullets: [
      'Collaborate in real time across teams',
      'Effortless document management',
      'Personalized dashboards for every user',
    ],
    image: '/assets/sharepoint-1.png',
    cta: { label: 'Start Your Journey', href: '/get-started' },
    bg: 'linear-gradient(135deg, #e6f2e6 0%, #d0e6fa 100%)',
  },
  {
    headline: 'Intuitive, Beautiful, Powerful',
    bullets: [
      'Modern UI with Fluent design',
      'Drag-and-drop content blocks',
      'Instant search and smart recommendations',
    ],
    image: '/assets/sharepoint-2.png',
    cta: { label: 'See It In Action', href: '/features' },
    bg: 'linear-gradient(135deg, #f5f7fa 0%, #e6f2e6 100%)',
  },
  {
    headline: 'Enterprise-Grade Security & Scale',
    bullets: [
      'Multi-region data protection',
      'Role-based access controls',
      '99.99% uptime SLA',
    ],
    image: '/assets/sharepoint-3.png',
    cta: { label: 'Learn More', href: '/security' },
    bg: 'linear-gradient(135deg, #e6f2e6 0%, #f0e6fa 100%)',
  },
];

export default function Carousel() {
  const [active, setActive] = React.useState(0);
  const timeoutRef = React.useRef<number | null>(null);
  const navigate = useNavigate();

  // Auto-advance every 7s
  React.useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setActive(a => (a + 1) % slides.length);
    }, 7000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [active]);

  function goTo(idx: number) {
    setActive(idx);
  }
  function prev() {
    setActive(a => (a - 1 + slides.length) % slides.length);
  }
  function next() {
    setActive(a => (a + 1) % slides.length);
  }

  return (
    <section className={styles.carouselRoot} aria-label="Key messages carousel">
      <div className={styles.carouselContainer}>
        {slides.map((slide, idx) => (
          <div
  key={idx}
  className={styles.slide + (idx === active ? ' ' + styles.active : '')}
  aria-hidden={idx !== active}        // <-- boolean expression, not a quoted string
  tabIndex={idx === active ? 0 : -1}
  role="group"
  aria-roledescription="slide"
  aria-label={`Slide ${idx + 1} of ${slides.length}`}
>
            <img
              src={slide.image}
              alt="SharePoint workspace visual"
              className={styles.bgImage}
              loading="lazy"
            />
            <div className={styles.slideContentOverlay}>
              <div className={styles.slideContentCard}>
                <h2 className={styles.headline}>{slide.headline}</h2>
                <ul className={styles.bulletList}>
                  {slide.bullets.map((b, i) => (
                    <li key={i} className={styles.bulletItem}>{b}</li>
                  ))}
                </ul>
                <Button
                  className={`appButton ${styles.cta}`}
                  appearance="primary"
                  size="large"
                  onClick={() => {
                    // Extract slug from href (e.g., '/get-started' => 'get-started')
                    const slug = slide.cta.href.replace(/^\//, '');
                    navigate(`/cta/${slug}`);
                  }}
                >
                  {slide.cta.label}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.navRow}>
        <button
          className={styles.arrow + ' ' + styles.left}
          aria-label="Previous slide"
          onClick={prev}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M17.5 21L11.5 14L17.5 7" stroke="#2d6a2d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className={styles.dots} role="tablist" aria-label="Slide navigation">
          {slides.map((_, idx) => (
<button
  type="button"
  key={idx}
  className={`${styles.dot} ${idx === active ? styles.activeDot : ''}`}
  aria-label={`Go to slide ${idx + 1}`}
  aria-selected={String(idx === active)} // <-- Fixed
  role="tab"
  tabIndex={idx === active ? 0 : -1}
  onClick={() => goTo(idx)}
/>

          ))}
        </div>
        <button
          className={styles.arrow + ' ' + styles.right}
          aria-label="Next slide"
          onClick={next}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10.5 7L16.5 14L10.5 21" stroke="#2d6a2d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </section>
  );
}
