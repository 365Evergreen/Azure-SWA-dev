import React, { useState, useMemo } from 'react';
import featuresData from '../../../docs/features.json';

// Hosted accordions data
const ACCORDIONS_URL = 'https://365evergreendev.blob.core.windows.net/365evergreen/accordions.json';

type FeatureOptionEdge = {
  node?: {
    id?: string | number;
    title?: string;
  } | null;
};

const featureOptions = (featuresData.data?.features?.edges || [] as FeatureOptionEdge[])
  .map(edge => {
    const node = edge?.node;
    if (!node) {
      return null;
    }
    const id = node.id;
    const title = node.title;
    if ((typeof id !== 'string' && typeof id !== 'number') || typeof title !== 'string') {
      return null;
    }
    return { id: String(id), title };
  })
  .filter((option): option is { id: string; title: string } => option !== null);

interface FeatureAccordion {
  id: string;
  label: string;
  featureId?: string;
  blurb?: string;
  image?: string;
}

function normaliseAccordions(payload: unknown): FeatureAccordion[] {
  if (payload === null || payload === undefined) {
    return [];
  }

  const maybeBody = typeof payload === 'object' && payload !== null
    ? (payload as { body?: unknown }).body
    : undefined;

  const source = (Array.isArray(payload)
    ? payload
    : Array.isArray(maybeBody)
      ? maybeBody
      : [payload]) as unknown[];

  return source
    .map(item => {
      if (!item || typeof item !== 'object') {
        return null;
      }
      const record = item as Record<string, unknown>;
      const id = record.id;
      const label = record.label;
      if ((typeof id !== 'string' && typeof id !== 'number') || typeof label !== 'string') {
        return null;
      }
      return {
        id: String(id),
        label,
        featureId: typeof record.featureId === 'string' ? record.featureId : undefined,
        blurb: typeof record.blurb === 'string' ? record.blurb : undefined,
        image: typeof record.image === 'string' ? record.image : undefined,
      } satisfies FeatureAccordion;
    })
    .filter(item => item !== null) as FeatureAccordion[];
}

const FeatureButtonsTest: React.FC = () => {
  const [selectedFeatureId, setSelectedFeatureId] = useState(featureOptions[0]?.id || '');
  const [accordions, setAccordions] = useState<FeatureAccordion[]>([]);

  React.useEffect(() => {
    fetch(ACCORDIONS_URL)
      .then(res => res.json())
      .then(data => setAccordions(normaliseAccordions(data)));
  }, []);

  // Filter accordions by featureId
  const filteredAccordions = useMemo(() => (
    accordions.filter(acc => acc.featureId === selectedFeatureId)
  ), [accordions, selectedFeatureId]);

  return (
    <div style={{ padding: 32 }}>
      <h2>Feature Buttons Test</h2>
      <label>
        Feature:
        <select
          value={selectedFeatureId}
          onChange={e => setSelectedFeatureId(e.target.value)}
        >
          {featureOptions.map(f => (
            <option key={f.id} value={f.id}>{f.title}</option>
          ))}
        </select>
      </label>
      <div style={{ margin: '16px 0' }}>
        <strong>Filtered Accordions (Buttons):</strong>
        {filteredAccordions.length === 0 && <div>No accordions for this feature.</div>}
        {filteredAccordions.map(acc => (
          <button
            key={acc.id}
            style={{ margin: 4, padding: 8 }}
          >
            {acc.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeatureButtonsTest;
