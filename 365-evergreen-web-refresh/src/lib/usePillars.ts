import { useEffect, useState } from 'react';

export interface RawPillar {
  id: string;
  title: string;
  slug: string;
  uri?: string;
  e365featurepage?: {
    blurb?: string;
    buttonText?: string;
    icon?: string;
    sortOrder?: number;
  };
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  content?: string;
}

export function usePillars(limit?: number) {
  const [pillars, setPillars] = useState<RawPillar[]>([]);

  useEffect(() => {
    const query = `query featurePages {\n  featurePages {\n    edges {\n      node {\n        id\n        title\n        slug\n        uri\n        e365featurepage {\n          blurb\n          buttonText\n          icon\n          sortOrder\n        }\n        featuredImage {\n          node {\n            sourceUrl\n          }\n        }\n        content(format: RENDERED)\n      }\n    }\n  }\n}`;

    fetch('https://365evergreendev.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then(res => res.json())
      .then(result => {
        const nodes: RawPillar[] = result?.data?.featurePages?.edges?.map((e: { node: RawPillar }) => e.node) || [];
        // Optional: sort by sortOrder if available
        nodes.sort((a: RawPillar, b: RawPillar) => {
          const aOrder = a.e365featurepage?.sortOrder ?? 0;
          const bOrder = b.e365featurepage?.sortOrder ?? 0;
          return aOrder - bOrder;
        });
        setPillars(limit ? nodes.slice(0, limit) : nodes);
      })
      .catch(err => {
        console.error('Failed to fetch featurePages from WPGraphQL:', err);
        setPillars([]);
      });
  }, [limit]);

  return pillars;
}
