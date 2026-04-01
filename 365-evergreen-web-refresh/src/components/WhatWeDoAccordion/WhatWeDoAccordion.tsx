import React, { useState } from "react";
import styles from './WhatWeDoAccordion.module.css';
import { ChevronRight24Filled } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

export interface WhatWeDoAccordionPanel {
  title: string;
  content: string;
  slug?: string;
}

export interface WhatWeDoAccordionItem {
  title: string;
  panels: WhatWeDoAccordionPanel[];
}

interface WhatWeDoAccordionProps {
  items: WhatWeDoAccordionItem[];
  openPanelIdx?: number | null;
  setOpenPanelIdx?: (idx: number | null) => void;
}

const WhatWeDoAccordion: React.FC<WhatWeDoAccordionProps> = ({ items, openPanelIdx, setOpenPanelIdx }) => {
  // All panels collapsed by default
  const [internalOpenIdx, setInternalOpenIdx] = useState<number | null>(null);
  const navigate = useNavigate();
  const handlePanelClick = (idx: number) => {
    if (setOpenPanelIdx) {
      setOpenPanelIdx(idx === (openPanelIdx ?? null) ? null : idx);
    } else {
      setInternalOpenIdx(idx === internalOpenIdx ? null : idx);
    }
  };
  const currentOpenIdx = setOpenPanelIdx ? openPanelIdx : internalOpenIdx;
  return (
    <div className={styles.accordion}>
      {items.map((item, itemIdx) => (
        <section key={item.title + itemIdx} className={styles.section}>
          <h2 className={styles.title}>{item.title}</h2>
          <div className={styles.panels}>
            {item.panels.map((panel, pidx) => (
              <div key={panel.title + pidx} className={styles.panel}>
                <button
                  type="button"
                  className={styles.button}
                  aria-expanded={currentOpenIdx === pidx}
                  onClick={() => handlePanelClick(pidx)}
                >
                  <span className={`${styles.arrow} ${currentOpenIdx === pidx ? styles.arrowOpen : ''}`.trim()}>
                    ▶
                  </span>
                  {panel.title}
                </button>
                <div className={styles.contentExpanded}>
                <div
                  className={`${styles.content} ${currentOpenIdx === pidx ? '' : styles.contentHidden}`.trim()}
                  aria-hidden={currentOpenIdx !== pidx}
                >
                  <div dangerouslySetInnerHTML={{ __html: panel.content }} />
                  <div className={styles.ctaWrap}>
                    <a
                      href={panel.slug ? `/what-we-do/${panel.slug}` : '#'}
                      className={`${styles.cta} features-link`}
                      onClick={e => {
                        if (!panel.slug) { e.preventDefault(); return; }
                        // Allow modifier keys to open in new tab/window
                        if (e.ctrlKey || e.metaKey || e.button === 1) return;
                        e.preventDefault();
                        navigate(`/what-we-do/${panel.slug}`);
                      }}
                      tabIndex={0}
                    >
                      <span className={styles.ctaContent}>
                        Learn more
                        <ChevronRight24Filled className={styles.ctaIcon} />
                      </span>
                    </a>
                  </div>
                </div>
              </div></div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default WhatWeDoAccordion;
