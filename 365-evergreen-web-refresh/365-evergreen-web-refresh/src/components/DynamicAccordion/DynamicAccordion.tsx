import * as React from 'react';
import styles from './DynamicAccordion.module.css';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';

export interface AccordionItem {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  panels: { title: string; content: string }[];
}

interface DynamicAccordionProps {
  items: AccordionItem[];
}


export const DynamicAccordion: React.FC<DynamicAccordionProps> = ({ items }) => {
  return (
    <div className={styles.dynamicAccordionRoot}>
      {items.map((item, idx) => (
        <section
          key={item.title + idx}
          className={
            styles.dynamicAccordionSection +
            (idx % 2 === 1 ? ' ' + styles.rowReverse : '')
          }
        >
          <div className={styles.dynamicAccordionText}>
            <h2 className={styles.dynamicAccordionTitle}>{item.title}</h2>
            {item.description && (
              <p className={styles.dynamicAccordionDescription}>{item.description}</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Accordion collapsible multiple style={{ background: 'none', boxShadow: 'none' }}>
                {item.panels.map((panel, pidx) => (
                  <div key={panel.title + pidx} style={{ border: '1px solid var(--neutralQuaternary)', borderRadius: 8, marginBottom: 0, background: 'var(--neutralLighter)' }}>
                    <AccordionItem value={panel.title + pidx}>
                      <AccordionHeader
                        style={{
                          fontWeight: 700,
                          fontSize: '1.18rem',
                          background: 'var(--neutralLighter)',
                          color: 'var(--neutralPrimary)',
                          borderRadius: 8,
                        }}
                      >
                        {panel.title}
                      </AccordionHeader>
                      <AccordionPanel>{panel.content}</AccordionPanel>
                    </AccordionItem>
                  </div>
                ))}
              </Accordion>
            </div>
          </div>
          {item.image && (
            <div className={styles.dynamicAccordionImageCol}>
              <img
                src={item.image}
                alt={item.imageAlt || item.title}
                className={styles.dynamicAccordionImage}
              />
            </div>
          )}
        </section>
      ))}
    </div>
  );
};
