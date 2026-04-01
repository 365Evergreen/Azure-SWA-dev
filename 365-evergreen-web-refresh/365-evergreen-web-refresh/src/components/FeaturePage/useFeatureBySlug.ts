import { useEffect, useState } from 'react';
import type { PageBlock } from './usePageBlocks';

export interface FeatureData {
  id: string;
  title: string;
  blocks: PageBlock[];
  content: string;
  siteFeature?: {
    title?: string;
    blurb?: string;
  } | null;
}

export function useFeatureBySlug(slug: string | undefined): FeatureData | null {
  const [data, setData] = useState<FeatureData | null>(null);
  useEffect(() => {
    if (!slug) return;
    fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetFeatureBySlug {\n  featureBy(uri: "${slug}") {\n    id\n    title\n    blocks\n    content\n    siteFeature {\n      title\n      blurb\n    }\n  }\n}`
      })
    })
      .then(res => res.json())
      .then(result => {
        const feature = result?.data?.featureBy;
        let blocks: PageBlock[] = [];
        try {
          blocks = feature?.blocks ? JSON.parse(feature.blocks) : [];
        } catch {
          blocks = [];
        }
        setData(
          feature
            ? { id: feature.id, title: feature.title, blocks, content: feature.content, siteFeature: feature.siteFeature ?? null }
            : null
        );
      });
  }, [slug]);
  return data;
}
