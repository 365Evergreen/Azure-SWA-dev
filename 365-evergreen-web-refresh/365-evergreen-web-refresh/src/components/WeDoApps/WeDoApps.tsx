import React, { useState, useRef, useEffect } from "react";
import "./WeDoApps.css";
import WhatWeDoAccordion from "../WhatWeDoAccordion/WhatWeDoAccordion";



// We now fetch accordions and their items from WPGraphQL via `useAccordionsByComponent`
import { useAccordionsByComponent } from '../../lib/useAccordionsByComponent';
import type { Accordion, AccordionItem } from '../../lib/useAccordionsByComponent';

const WeDoApps: React.FC = () => {

  // Use GraphQL hook to fetch accordions and items for this component
  const { accordions: comms, items: accordionList, loading, error } = useAccordionsByComponent('WeDoApps');
  // Compute defaultIdx from comms
  const defaultIdx = comms.findIndex((c: Accordion) => c.label === 'Stay connected');
  const [selectedIdx, setSelectedIdx] = useState<number>(defaultIdx >= 0 ? defaultIdx : 0);
  const [openPanelIdx, setOpenPanelIdx] = useState<number | null>(0);
  const accordionContainerRef = useRef<HTMLDivElement>(null);
  const [accordionHeight, setAccordionHeight] = useState<number>(0);

  const selected = comms.length > 0 ? comms[selectedIdx] : null;
  // Filter panels for the selected accordion and sort by provided order (sortOrder)
  const panels = React.useMemo(() => {
    return selected && Array.isArray(accordionList)
      ? accordionList
        .filter((item: AccordionItem) => item.parentId === selected.id)
        .slice()
        .sort((a, b) => ((a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)))
      : [];
  }, [selected, accordionList]);

  useEffect(() => {
    if (accordionContainerRef.current) {
      setAccordionHeight(accordionContainerRef.current.offsetHeight);
    }
  }, [panels, openPanelIdx, selectedIdx]);

  // previous blob-based fetch replaced by GraphQL hook `useAccordionsByComponent`.
  // We still handle loading/error states for parity with previous behavior.
    // Remove effect that sets state synchronously from comms

  // ...existing code...

  // Get image for selected panel if present, else fallback to selected item
  let imageUrl = selected?.imageUrl;
  if (
    panels.length > 0 &&
    openPanelIdx !== null &&
    panels[openPanelIdx] &&
    panels[openPanelIdx].imageUrl
  ) {
    imageUrl = panels[openPanelIdx].imageUrl;
  }

  return (
    <section id="business-apps" className="we-do-apps-bg">
      <div className="we-do-apps-container">
        <h2 className="we-do-apps__heading">Business apps</h2>
        <p className="we-do-apps__description">Enhance your business apps with Microsoft 365. Our solutions empower teams to collaborate seamlessly, share information effortlessly, and stay connected regardless of location. With tools like Microsoft Teams, SharePoint, and Outlook, you can foster a culture of collaboration, streamline information sharing, and ensure everyone stays informed. From instant messaging to video conferencing and document management, Microsoft 365 offers a comprehensive suite of apps tools tailored to your business needs.</p>
        <div className="we-do-apps__button-row">
          {loading ? (
            <span>Loading...</span>
          ) : error ? (
            <span style={{ color: 'red' }}>Failed to load content</span>
          ) : comms.length === 0 ? (
            <span>No items found</span>
          ) : (
            comms.map((item: Accordion, idx: number) => (
              <button
                key={item.id}
                className={`we-do-apps__button${selectedIdx === idx ? " selected" : ""}`}
                onClick={() => setSelectedIdx(idx)}
              >
                {item.label}
              </button>
            ))
          )}
        </div>
        <div className="we-do-apps__columns">
          <div className="apps-accordion-container" ref={accordionContainerRef}>
            {comms.length === 0 ? (
              <div>Loading accordion...</div>
            ) : selected ? (
              <WhatWeDoAccordion
                items={[{
                  title: selected.label,
                  panels: panels.length > 0
                    ? panels.map((p: AccordionItem) => ({
                        title: p.label,
                        content: p.blurb,
                        slug: p.slug ?? undefined,
                      }))
                    : [{ title: selected.label, content: selected.blurb, slug: undefined }]
                }]}
                openPanelIdx={openPanelIdx}
                setOpenPanelIdx={setOpenPanelIdx}
              />
            ) : (
              <div>No accordion data found.</div>
            )}
          </div>
          <div className="apps-image-container">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={selected?.label}
                className="apps-image"
                style={{
                  opacity: 1,
                  transition: 'opacity 0.5s cubic-bezier(.4,0,.2,1)',
                  height: accordionHeight ? `${accordionHeight}px` : 'auto',
                  width: 'auto',
                  objectFit: 'cover',
                  maxWidth: '100%',
                  display: 'block',
                }}
                onLoad={e => { e.currentTarget.style.opacity = '1'; }}
              />
            ) : (
              <div className="apps-image-placeholder" style={{ height: accordionHeight ? `${accordionHeight}px` : 'auto', width: '100%' }}>No image</div>
            )}
          </div>
        </div>
        <p className="we-do-apps__footer">Yo</p>
      </div>
    </section>
  );
};

export default WeDoApps;

