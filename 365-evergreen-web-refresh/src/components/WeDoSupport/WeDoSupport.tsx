import React, { useState, useRef, useEffect } from "react";
import "./WeDoSupport.css";
import WhatWeDoAccordion from "../WhatWeDoAccordion/WhatWeDoAccordion";



// We now fetch accordions and their items from WPGraphQL via `useAccordionsByComponent`
import { useAccordionsByComponent } from '../../lib/useAccordionsByComponent';
import type { Accordion, AccordionItem } from '../../lib/useAccordionsByComponent';

const WeDoSupport: React.FC = () => {

  // Use GraphQL hook to fetch accordions and items for this component
  const { accordions: comms, items: accordionList, loading, error } = useAccordionsByComponent('WeDoSupport');
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
    <section id="support" className="we-do-support-bg">
      <div className="we-do-support-container">
        <h2 className="we-do-support__heading">Support</h2>
        <p className="we-do-support__description">Enhance your business support with Microsoft 365. Our solutions empower teams to collaborate seamlessly, share information effortlessly, and stay connected regardless of location. With tools like Microsoft Teams, SharePoint, and Outlook, you can foster a culture of collaboration, streamline information sharing, and ensure everyone stays informed. From instant messaging to video conferencing and document management, Microsoft 365 offers a comprehensive suite of support tools tailored to your business needs.</p>
        <div className="we-do-support__button-row">
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
                className={`we-do-support__button${selectedIdx === idx ? " selected" : ""}`}
                onClick={() => setSelectedIdx(idx)}
              >
                {item.label}
              </button>
            ))
          )}
        </div>
        <div className="we-do-support__columns">
          <div className="support-accordion-container" ref={accordionContainerRef}>
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
          <div className="support-image-container">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={selected?.label}
                className="support-image"
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
              <div className="support-image-placeholder" style={{ height: accordionHeight ? `${accordionHeight}px` : 'auto', width: '100%' }}>No image</div>
            )}
          </div>
        </div>
        <p className="we-do-support__footer">Yo</p>
      </div>
    </section>
  );
};

export default WeDoSupport;

