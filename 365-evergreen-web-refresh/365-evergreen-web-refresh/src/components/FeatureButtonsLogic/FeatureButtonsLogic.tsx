import React, { useState, useEffect, useMemo } from 'react';

// Hosted data URLs
const ACCORDIONS_URL = 'https://365evergreendev.blob.core.windows.net/365evergreen/accordions.json';
const ACCORDION_LIST_URL = 'https://365evergreendev.blob.core.windows.net/365evergreen/accordion-list.json';

interface FeatureButtonsLogicProps {
  featureId: string; // WP post ID, passed from parent (e.g., homepage selection)
}

const FeatureButtonsLogic: React.FC<FeatureButtonsLogicProps> = ({ featureId }) => {
  const [accordions, setAccordions] = useState<any[]>([]);
  const [accordionList, setAccordionList] = useState<any[]>([]);
  const [selectedAccordionId, setSelectedAccordionId] = useState<string | null>(null);

  useEffect(() => {
    fetch(ACCORDIONS_URL)
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.body || []);
        setAccordions(arr.filter((acc: { featureId: string; }) => acc.featureId === featureId));
        // Set default accordion (first one)
        if (arr.length > 0) {
          const filtered = arr.filter((acc: { featureId: string; }) => acc.featureId === featureId);
          setSelectedAccordionId(filtered[0]?.id ? String(filtered[0].id) : null);
        }
      });
    fetch(ACCORDION_LIST_URL)
      .then(res => res.json())
      .then(data => {
        setAccordionList(Array.isArray(data) ? data : (data.body || []));
      });
  }, [featureId]);

  // Buttons: accordions for this feature
  const buttons = useMemo(() => accordions.map(acc => ({ id: String(acc.id), label: acc.label })), [accordions]);

  // Items for selected accordion
  const items = useMemo(() => {
    if (!selectedAccordionId) return [];
    return accordionList.filter(item => String(item.parentId) === selectedAccordionId);
  }, [accordionList, selectedAccordionId]);

  return (
    <div style={{ padding: 32 }}>
      <h2>Feature Buttons Logic Test</h2>
      <div style={{ margin: '16px 0' }}>
        <strong>Buttons:</strong>
        {buttons.length === 0 && <div>No accordions for this feature.</div>}
        {buttons.map(btn => (
          <button
            key={btn.id}
            style={{ margin: 4, padding: 8, background: selectedAccordionId === btn.id ? '#222' : '#eee', color: selectedAccordionId === btn.id ? '#fff' : '#222' }}
            onClick={() => setSelectedAccordionId(btn.id)}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div>
        <strong>Accordion Items:</strong>
        {items.length === 0 && <div>No items for this accordion.</div>}
        <ul>
          {items.map(item => (
            <li key={item.id}><strong>{item.label}</strong>: {item.blurb}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeatureButtonsLogic;
