import React, { useState } from "react";
import styles from './VanillaAccordion.module.css';

export interface VanillaAccordionPanel {
  title: string;
  content: string;
}

export interface VanillaAccordionItem {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  panels: VanillaAccordionPanel[];
}

interface VanillaAccordionProps {
  items: VanillaAccordionItem[];
}

export const VanillaAccordion: React.FC<VanillaAccordionProps> = ({ items }) => {
  // Track open panel: [itemIndex, panelIndex]
  const [openPanel, setOpenPanel] = useState<{ itemIdx: number; panelIdx: number } | null>(null);
  return (
    <div className={styles.accordion}>
      {items.map((item, idx) => (
        <section
          key={item.title ? `${item.title}-${idx}` : `section-${idx}`}
          className={`${styles.section} ${idx % 2 === 1 ? styles.rowReverse : ''}`.trim()}
        >
          <div className={styles.contentCol}>
            <h2 className={styles.title}>{item.title}</h2>
            {item.description && <p className={styles.description}>{item.description}</p>}
            <div className={styles.panels}>
              {item.panels.map((panel, pidx) => (
                <VanillaAccordionPanel
                  key={panel.title ? `${panel.title}-${pidx}` : `panel-${idx}-${pidx}`}
                  title={panel.title}
                  content={panel.content}
                  open={openPanel?.itemIdx === idx && openPanel?.panelIdx === pidx}
                  onClick={() => setOpenPanel(openPanel?.itemIdx === idx && openPanel?.panelIdx === pidx ? null : { itemIdx: idx, panelIdx: pidx })}
                />
              ))}
            </div>
          </div>
          {item.image && (
            <div className={styles.imageCol}>
              <img
                src={item.image}
                alt={item.imageAlt || item.title}
                className={styles.image}
              />
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

interface VanillaAccordionPanelProps {
  title: string;
  content: string;
  open: boolean;
  onClick: () => void;
}

const VanillaAccordionPanel: React.FC<VanillaAccordionPanelProps> = ({ title, content, open, onClick }) => {
  // Always render the panel container, but only show content if open
  return (
    <div className={styles.panel}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onClick}
        className={styles.button}
      >
        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`.trim()}>
          ▶
        </span>
        {title}
      </button>
      <div
        className={`${styles.panelContent} ${open ? styles.panelContentOpen : styles.panelContentClosed}`}
        aria-hidden={!open}
      >
        {open && content}
      </div>
    </div>
  );
};