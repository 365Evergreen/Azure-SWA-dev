import React, { useState, useEffect, useMemo } from 'react';

import { VanillaAccordion } from '../VanillaAccordion/VanillaAccordion';
import featuresData from '../../../docs/features.json';

interface FeatureAccordionButtonsProps {
  feature: string;
}

import { useParams } from 'react-router-dom';

const FeatureAccordionButtons: React.FC<FeatureAccordionButtonsProps> = ({ feature }) => {
  // Find featureId from features.json, robustly (by title or slug)
  const { slug } = useParams<{ slug?: string }>();
  type FeatureEdge = { node: { id: string; title: string; slug?: string } };
  const featureId = useMemo(() => {
    const edges: FeatureEdge[] = featuresData.data?.features?.edges || [];
    const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
    let match = edges.find((f) => norm(f.node.title) === norm(feature));
    if (!match && slug) {
      match = edges.find((f) => f.node.slug?.toLowerCase() === slug.toLowerCase());
    }
    if (!match) {
      console.warn('No feature match for:', feature, 'slug:', slug);
    }
    return match?.node?.id ?? undefined;
  }, [feature, slug]);


  // Fetch accordions and accordion-list from hosted URLs
  interface RawAccordion {
    id: string;
    featureId?: string;
    label?: string;
    blurb?: string;
    image?: string;
  }
  interface RawAccordionListItem {
    parentId?: string;
    label?: string;
    blurb?: string;
    order?: number;
  }

  const [accordions, setAccordions] = useState<RawAccordion[]>([]);
  const [accordionList, setAccordionList] = useState<RawAccordionListItem[]>([]);

  useEffect(() => {
    if (!featureId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccordions([]);
       
      setAccordionList([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res1 = await fetch('https://365evergreendev.blob.core.windows.net/365evergreen/accordions.json');
        const data1 = await res1.json();
        const arr = Array.isArray(data1) ? data1 : (data1.body || []);
        if (!cancelled) setAccordions(arr.filter((acc: RawAccordion) => acc.featureId === featureId));

        const res2 = await fetch('https://365evergreendev.blob.core.windows.net/365evergreen/accordion-list.json');
        const data2 = await res2.json();
        if (!cancelled) setAccordionList(Array.isArray(data2) ? data2 : (data2.body || []));
      } catch {
        // ignore fetch errors for this UI helper
      }
    })();

    return () => { cancelled = true; };
  }, [featureId]);

  // State for selected accordion index
  const [selectedIdx, setSelectedIdx] = useState(0);
  useEffect(() => {
    // reset selection when feature changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIdx(0);
  }, [featureId]);

  // Get panels/items for each accordion
  const accordionItems = useMemo(() => (
    accordions.map(acc => {
      // Find items in accordion-list where parentId matches acc.id
      const panels = accordionList.filter(item => item.parentId === acc.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(item => ({ title: item.label ?? '', content: item.blurb ?? '' }));
      return {
        id: acc.id,
        title: acc.label ?? '',
        description: acc.blurb ?? '',
        image: acc.image,
        panels
      };
    })
  ), [accordions, accordionList]);

  return (
    <div>
      {accordionItems.length > 0 && (
        <div style={{ marginTop: '2rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {accordionItems.map((acc, idx) => (
            <button
              key={(acc.id ? acc.id : acc.title) + '-' + idx}
              type="button"
              className={`appButton feature-accordion-btn${selectedIdx === idx ? ' feature-accordion-btn--active' : ''}`}
              style={{
                padding: '0.5em 1.2em',
                borderRadius: 10,
                border: selectedIdx === idx ? '2px solid #000' : '1px solid #ccc',
                background: selectedIdx === idx ? '#000' : '#fff',
                color: selectedIdx === idx ? '#fff' : '#181828',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: selectedIdx === idx ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.18s',
              }}
              onClick={() => setSelectedIdx(idx)}
            >
              {acc.title}
            </button>
          ))}
        </div>
      )}
      {accordionItems[selectedIdx] && (
        <div style={{ marginTop: '2rem' }}>
          <VanillaAccordion items={[accordionItems[selectedIdx]]} />
        </div>
      )}
    </div>
  );
};

export default FeatureAccordionButtons;

